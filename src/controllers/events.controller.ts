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

/**1) Create Github Event
2) Display Events on a Page
3) When clicked, it will navigate to an Event/:id page on Angular
4) events/:id page will display all of the stats for the event
 - Should display last 10 updated pull requests
 - Should display last 5 comments across all PRs/Issues
 - Should display last 5 issues
 - Should display top 10 users in descending order based on points

When the Event Start Date Arrives, e.g: 6/8/2020 12 AM to 6/10/2020 11:59 PM

- Status of Event = OPENED
- Must always validate the Event's Status & the start & end date.
- Check if EVENT.STATUS === 'OPENED"
- Check if current date > 6/8/2020 12 AM AND current date < 6/10/2020 11:59 PM
- Check if the Event's Github Repository ID matches the Repository ID for the PR.
- The Event must map to an EventPointsData Document
- EventPointsData document holds ALL users and their total points.

EventPointsData {
  repositoryId: string;
  users: Map<githubId, PointsData>;
}

Event -> EventPointsData 

EventPointsData will have a users map that maps every user's github id to a Points object

Points {
  commentPoints: number,
  issuePoints: number;
  prPoints: number;
  mergePoints: number;
}

Event -> Contributions

Contributions {
  pullRequests: number;
  issues: number;
  comments: number;
  merges: number;
}

 */