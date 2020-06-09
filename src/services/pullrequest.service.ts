import PullRequestModel from '../database/models/PullRequest'
import { PullRequest } from '../models/PullRequest';

export default class PullRequestService {
  static async getPullRequests(id: string): Promise<PullRequest[]> {
    return <PullRequest[]><unknown>PullRequestModel
      .find({ 'pullRequestUserData.githubId': id });
  }

  static async getPullRequestsByNameOrId(nameOrId: string): Promise<PullRequest[]> {
    return <PullRequest[]><unknown>PullRequestModel.find().or([
      { 'pullRequestUserData.githubId': nameOrId },
      { 'pullRequestUserData.login': nameOrId }
    ]);
  }

  static async getAllPullRequests(): Promise<PullRequest[]> {
    return <PullRequest[]><unknown>PullRequestModel.find()
      .sort({ 'pullRequestData.updated_at': -1 });
  }

  static getPullRequestsLimit(skip: number) {
    return <PullRequest[] | unknown>PullRequestModel.find()
      .sort({ 'pullRequestData.updated_at': -1 })
      .skip(skip)
      .limit(15);
  }
}