import { Request, Response } from 'express';
import EventService from '../services/events.service';
import { buildRepositoryObject } from '../utilities/resolver';
import { UserSession } from '../models/SessionUser';
import GithubService from '../services/external/github.service';
import UserService from '../services/user.service';
import { getWebhookPayloads } from '../utilities/utils';
import EventModel from '../database/models/Event';
import PullRequestService from '../services/pullrequest.service';
import { EventData, EventUser } from '../models/EventData';
import { User } from '../constants/Permissions';

declare interface EventUserData extends EventUser {
  totalPoints: number;
  totalContributions: number;
  avatar: string;
  username: string;
}

export default class EventController {
  static async getEvents(req: Request, res: Response){
    const events = await EventService.getEvents();
    return res.status(200).send(events);
  }

  static async createEvent(req: Request | any, res: Response) {
    const { user } = <{ user: UserSession }>req;
    const repository = buildRepositoryObject(req.body.repository);
    const event = await EventService.getEvent(repository.repositoryId);
    if (event) {
      console.log('Event already exists!');
      return res.status(409).send({ msg: 'An event is already associated with that repository', repository });
    } else {
      const { body } = req;
      try {
        const event = await EventService.createEvent(body, repository);
        // Need to create EventData Model
        const eventData = await EventService.createEventData({ repositoryId: repository.repositoryId, users: new Map()});
        // Get Github OAuth2 Token
        const token = await UserService.getGithubOAuth2Token(user.githubId);
        // Call Github REST API to Create Webhooks
        const result = await GithubService.postWebhooks(token, repository, user.githubId);
        console.log(result);
        return res
          .status(201)
          .send({ event, eventData });
        
      } catch (err) {
        console.log(err);
        await EventModel.deleteOne({ repositoryId: repository.repositoryId })
        return res
          .status(500)
          .send({ msg: 'Internal Server Error' });
      }
    }
  }

  static async closeEvent(req: Request | any, res: Response) {
    const { repositoryId } = req.params;
    if (!repositoryId) return res.status(404).send({ msg: 'Not found' });
    try {
      const event = await EventModel.findOne({ repositoryId });
      if (!event) return res.status(404).send({ msg: 'Not found' });
      if (event.get('status') === 'closed') return res.status(400).send({ msg: 'Event could not be closed' });
      await event.update({ status: 'closed' });
      // Need to update webhooks.
      await GithubService.deleteWebhooks();
      return res.status(200).send({ msg: 'Success' });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ msg: 'Internal Server Error' });
    }
  }

  static async getPullRequests(req: Request, res: Response) {
    const { repositoryId } = req.params;
    console.log(repositoryId);
    const pullRequests = await PullRequestService.getPullRequestsByEventId(repositoryId);
    return res.status(200).send(pullRequests);
  }

  static async getLeaderboards(req: Request, res: Response) {
    const { repositoryId } = req.params;
    const { order } = req.query;

    const sum = (sum: number, curr: number) => sum + curr;
    const descending = (a: EventUserData, b: EventUserData) => b.totalPoints - a.totalPoints;
    const ascending = (a: EventUserData, b: EventUserData) => a.totalPoints - b.totalPoints;
    if (!repositoryId) return res.status(400).send({ msg: 'Bad Request' });
    const { users: eventUsers } = <EventData> await EventService.getEventData(repositoryId);
    if (eventUsers) {
      const data: EventUserData[] = [];
      const users = <UserSession[]> await UserService.getUsers(Array.from(eventUsers.keys()));
      for (const user of users) {
        const eventUser = eventUsers.get(user.githubId);
        const { avatar, username } = user;
        if (eventUser) {
          const totalPoints: number = Object.values(eventUser.points).reduce(sum, 0);
          const totalContributions: number = Object.values(eventUser.contributions).reduce(sum, 0);
          data.push({ ...eventUser, totalPoints, totalContributions, avatar, username });
        }
      }
      if (order && order === 'asc') return res.status(200).send(data.sort(ascending));
      else return res.status(200).send(data.sort(descending));

    } return res.status(400).send({ msg: 'Bad Request' });
  }
}