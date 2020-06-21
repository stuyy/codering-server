import EventModel from '../database/models/Event';
import { Event as EventInterface, EventStatus, Event } from '../models/Event';
import { EventData, Points, Contributions, EventUser } from '../models/EventData';
import EventDataModel from '../database/models/EventData';
import { GithubActions } from '../constants/GithubActions';

export default class EventService {
  static async getEvents(): Promise<EventInterface[]> {
    return <EventInterface[]><unknown>EventModel.find();
  }

  static async getEvent(repositoryId: string) {
    return <EventInterface | unknown>EventModel.findOne({ repositoryId });
  }

  static async createEvent(event: EventInterface) {
    return EventModel.create({
      repositoryId: event.repositoryId,
      repository: event.repository,
      status: event.status,
      creatorId: event.creatorId,
      startDate: event.startDate,
      endDate: event.endDate,
      pullRequestPoints: event.pullRequestPoints,
      issuePoints: event.issuePoints,
      commentsPoints: event.commentsPoints,
      mergedPullRequestPoints: event.mergedPullRequestPoints,
      eventName: event.eventName
    });
  }

  static async validateEvent(repositoryId: any) {
    const event = await this.getEvent(repositoryId);
    if (event) {
      console.log(event);
      return event;
    } else {
      return null;
    }
  }

  static async createEventData(data: EventData) {
    return EventDataModel.create({
      repositoryId: data.repositoryId,
      users: new Map(),
    });
  }

  static async getEventData(repositoryId: string) {
    return <EventData | unknown>EventDataModel.findOne({ repositoryId });
  }

  /**
   * Searches the database for the event corresponding to the repository.
   * Updates the user accordingly to the action triggered by the Github Webhook.
   * @param repositoryId id of the repository/event
   */
  static async updateUserEventData(
    repositoryId: string,
    githubId: string,
    action: GithubActions) {
    // Retrieve the EventData Document
    const eventData = <EventData>await this.getEventData(repositoryId);
    // Retrieve the Event Document
    const event = <Event>await this.getEvent(repositoryId);
    
    if (eventData && event) {
      const { users }  = eventData;
      const { pullRequestPoints, mergedPullRequestPoints } = event;
      const user = users.get(githubId);
      // If user is found in Database.
      if (user) {
        switch (action) {
          case GithubActions.OPENED: {
            user.points.pullRequests += pullRequestPoints;
            user.contributions.pullRequests++;
            users.set(githubId, user);
            return EventDataModel.findOneAndUpdate({ repositoryId }, { users });
          }
          case GithubActions.REOPENED: {
            user.points.pullRequests += pullRequestPoints;
            user.contributions.pullRequests++;
            users.set(githubId, user);
            return EventDataModel.findOneAndUpdate({ repositoryId }, { users });
          }
          case GithubActions.CLOSED: {
            user.points.pullRequests -= pullRequestPoints;
            user.contributions.pullRequests--;
            users.set(githubId, user);
            return EventDataModel.findOneAndUpdate({ repositoryId }, { users });
          }
          case GithubActions.MERGED: {
            user.points.merges += mergedPullRequestPoints;
            user.contributions.merges++;
            users.set(githubId, user);
            return EventDataModel.findOneAndUpdate({ repositoryId }, { users });
          }
          default: {
            console.log('Unknown Action');
            break;
          }
        }
      } else {
        console.log('User was not in Map. This might be their first contribution');
        if (action === GithubActions.OPENED) {
          const points: Points = { pullRequests: pullRequestPoints, comments: 0, issues: 0, merges: 0 };
          const contributions: Contributions = { pullRequests: 1, comments: 0, issues: 0, merges: 0 };
          const newEventUser: EventUser = { githubId, repositoryId, points, contributions };
          users.set(githubId, newEventUser);
          return EventDataModel.findOneAndUpdate({ repositoryId }, { users });
        } throw new Error(`Action: ${action} occured, but user was not in Map.`);
      }
    } else {
      throw new Error("Event Data or Event was not found for this Repository's Pull Request.");
    }
  }

}