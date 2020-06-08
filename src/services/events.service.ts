import EventModel from '../database/models/Event';
import { Event, EventStatus } from '../models/Event';

export default class EventService {
  static async getEvents(): Promise<Event[]> {
    return <Event[]><unknown>EventModel.find();
  }

  static async getEvent(repositoryId: string) {
    return <Event | unknown>EventModel.findOne({ repositoryId });
  }

  static async createEvent(event: Event) {
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
}