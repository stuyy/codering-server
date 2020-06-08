import { Request, Response } from 'express';
import EventService from '../services/events.service';
import { EventStatus } from '../models/Event';
import { buildRepositoryObject } from '../utilities/resolver';
import { UserSession } from '../models/SessionUser';

export default class EventController {
  static async getEvents(req: Request, res: Response){
    const events = await EventService.getEvents();
    return res.status(200).send(events);
  }

  static async createEvent(req: Request | any, res: Response) {
    const { user } = <{ user: UserSession }>req;
    if (!user.roles.includes('ADMINISTRATOR'))
      return res.status(403).send({ msg: 'Not an Administrator' });
    
    const { repository } = req.body;
    const event = await EventService.getEvent(repository.id);
    if (event) {
      console.log('Event already exists!');
      return res.status(409).send({ msg: 'An event is already associated with that repository', repository });
    } else {
      const { body } = req;
      try {
        const event = await EventService.createEvent({
          creatorId: body.creatorId,
          startDate: body.startDate,
          endDate: body.endDate,
          pullRequestPoints: body.pullRequestPoints,
          issuePoints: body.issuePoints,
          commentsPoints: body.commentsPoints,
          mergedPullRequestPoints: body.mergedPullRequestPoints,
          repository: buildRepositoryObject(repository),
          repositoryId: repository.id,
          status: EventStatus.OPENED
        });
        // Need to create EventData Model
        const eventData = await EventService.createEventData({
          repositoryId: repository.id
        });
        console.log(eventData);
        return res.status(201).send(event);
      } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: 'Internal Server Error' });
      }
    }
  }
}