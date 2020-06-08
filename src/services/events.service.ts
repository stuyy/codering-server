import EventModel from '../database/models/Event';
import { Event as EventInterface, EventStatus } from '../models/Event';
import { EventData } from '../models/EventData';
import EventDataModel from '../database/models/EventData';

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
      mergedPullRequestPoints: event.mergedPullRequestPoints
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
      repositoryId: data.repositoryId
    });
  }

  static async getEventData(repositoryId: string) {
    return <EventData | unknown>EventDataModel.findOne({ repositoryId });
  }
}