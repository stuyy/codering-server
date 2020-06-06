import PullRequestModel from '../database/models/PullRequest'
import { PullRequest } from '../models/PullRequest';

export default class PullRequestService {
  static async getPullRequests(id: string): Promise<PullRequest[]> {
    return <PullRequest[]><unknown>PullRequestModel.find({ 'pullRequestUserData.githubId': id });
  }

  static async getPullRequestsByNameOrId(nameOrId: string): Promise<PullRequest[]> {
    return <PullRequest[]><unknown>PullRequestModel.find().or([
      { 'pullRequestUserData.githubId': nameOrId },
      { 'pullRequestUserData.login': nameOrId }
    ]);
  }

  static async getAllPullRequests(): Promise<PullRequest[]> {
    return <PullRequest[]><unknown>PullRequestModel.find();
  }
}