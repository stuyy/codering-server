import e, { Request, Response } from 'express';
import PullRequestModel from '../database/models/PullRequest';
import { buildPullRequestObject } from '../utilities/resolver';
import { GithubActions } from '../constants/GithubActions';
import WebhookService from '../services/webhook.service';
import EventService from '../services/events.service';
import { EventData, EventUser, Points, Contributions } from '../models/EventData';
import { Event } from '../models/Event';
import EventDataModel from '../database/models/EventData';

// We need to check to make sure if the User is in the Database.

export default class WebhookController {
  static async postGithubPullRequest(req: Request, res: Response) {
    const { action, pull_request, repository } = req.body;
    const { id: pullRequestID, merged } = pull_request;

    console.log(`New PR Action: ${action}`);

    try {
      const event = await EventService.validateEvent(repository.id);
      console.log(event);
      if (!event)
        return res.status(409).send({ msg: 'Pull Request is not associated with a Valid Event' });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ msg: 'Internal Server Error' });
    }
    
    console.log(`Valid Event. Continuing`);

    if (pull_request.base.ref !== 'master')
      return res.status(403).json({ msg: 'Not Master Branch' });
    // Before we start saving Pull Requests to the Database, we must check the Database for an "Event"
    // Document and check which Repository that Event corresponds to.
    switch (action) {
      case GithubActions.OPENED: {
        try {
          console.time('Start');
          console.time(`PR ${pullRequestID} was opened.`)
          const newPr = await WebhookService.handleOpenedPullRequest(req.body);
          console.timeEnd(`PR ${pullRequestID} was opened.`);
          const eventData = <EventData>await EventService.getEventData(repository.id);
          const eventObj = <Event>await EventService.getEvent(repository.id);
          if (eventData && eventObj) {
            const id: string = pull_request.user.id;
            const { users } = eventData;
            const user = users!.get(id.toString());
            const { pullRequestPoints } = eventObj;
            console.log(users);
            if (user) {
              console.log('User found in Map');
              user.points.pullRequests += pullRequestPoints;
              user.contributions.pullRequests++;
              users?.set(user.githubId.toString(), user);
              await EventDataModel.findOneAndUpdate({
                repositoryId: repository.id
              }, { users });
              console.log('Updated...');
            } else {
              console.log('Not found in Map');
              const points: Points = { pullRequests: pullRequestPoints, comments: 0, issues: 0, merges: 0 };
              const contributions: Contributions = { pullRequests: 1, comments: 0, issues: 0, merges: 0 }
              const eventUser: EventUser = {
                githubId: pull_request.user.id,
                repositoryId: repository.id,
                points,
                contributions,
              };
              users?.set(id.toString(), eventUser);
              await EventDataModel.findOneAndUpdate({
                repositoryId: repository.id,
              }, { users });
              console.log('updated');
            }
          } else {
            throw new Error('Event Data or Event not found for this Event');
          }
          console.timeEnd('Start');
          break;
        } catch (err) {
          console.log(err);
          return res.status(500).send({ msg: 'Internal Server Error' });
        }
      }
      case GithubActions.REOPENED: {
        // Search the Database for the Pull Request
        console.time(`Pull Request ${pullRequestID} was re-opened.`);
        await WebhookService.findAndUpdate(pullRequestID, GithubActions.REOPENED, pull_request.updated_at);
        const eventData = <EventData>await EventService.getEventData(repository.id);
          const eventObj = <Event>await EventService.getEvent(repository.id);
          
          const { pullRequestPoints } = eventObj;
          
          if (eventData && eventObj) {
            const id: string = pull_request.user.id;
            const { users } = eventData;
            const user = users!.get(id.toString());
            console.log(users);
            if (user) {
              console.log('User found in Map');
              console.time('Updated Merge Count & Points')
              user.points.pullRequests += pullRequestPoints;
              user.contributions.pullRequests++;
              users?.set(user.githubId.toString(), user);
              await EventDataModel.findOneAndUpdate({ repositoryId: repository.id }, { users });
              console.timeEnd('Updated Merge Count & Points')
            } else {
              console.log('Something went wrong when merging. User or PR was not in Database so merge did not count.');
            }
          }
        console.timeEnd('Pull Request ${pullRequestID} was re-opened.');
        break;
      }
      case GithubActions.CLOSED: {
        // Search the Database for the Pull Request.
        if (merged) {
          console.time('Merging PR');
          await WebhookService.findAndUpdate(
            pullRequestID,
            GithubActions.MERGED,
            pull_request.updated_at,
            pull_request.merged_at,
            pull_request.closed_at);
          const eventData = <EventData>await EventService.getEventData(repository.id);
          const eventObj = <Event>await EventService.getEvent(repository.id);
          
          const { mergedPullRequestPoints } = eventObj;
          
          if (eventData && eventObj) {
            const id: string = pull_request.user.id;
            const { users } = eventData;
            const user = users!.get(id.toString());
            console.log(users);
            if (user) {
              console.log('User found in Map');
              console.time('Updated Merge Count & Points')
              user.points.merges += mergedPullRequestPoints;
              user.contributions.merges++;
              users?.set(user.githubId.toString(), user);
              await EventDataModel.findOneAndUpdate({ repositoryId: repository.id }, { users });
              console.timeEnd('Updated Merge Count & Points')
            } else {
              console.log('Something went wrong when merging. User or PR was not in Database so merge did not count.');
            }
          }

          console.timeEnd('Merging PR');
        } else {
          console.time(`Pull Request ${pullRequestID} was closed.`);
          await WebhookService.findAndUpdate(pullRequestID, GithubActions.CLOSED, pull_request.updated_at, undefined, pull_request.closed_at);
          // Update Points
          const eventData = <EventData>await EventService.getEventData(repository.id);
          const eventObj = <Event>await EventService.getEvent(repository.id);
          const { pullRequestPoints } = eventObj;
          if (eventData && eventObj) {
            const id: string = pull_request.user.id;
            const { users } = eventData;
            const user = users!.get(id.toString());
            console.log(users);
            if (user) {
              console.time('Updated Merge Count & Points')
              user.points.pullRequests -= pullRequestPoints;
              user.contributions.pullRequests--;
              users?.set(user.githubId.toString(), user);
              await EventDataModel.findOneAndUpdate({ repositoryId: repository.id }, { users });
              console.timeEnd('Updated Merge Count & Points')
            } else {
              console.log('Something went wrong when merging. User or PR was not in Database so merge did not count.');
            }
          }
          console.timeEnd(`Pull Request ${pullRequestID} was closed.`);
        }
      }
    }
    res.status(201);
  }
  static async getGithubPullRequest() {
    
  }

  static async postGithubIssue(req: Request, res: Response) {
    console.log(`New Issue`)
  }
}