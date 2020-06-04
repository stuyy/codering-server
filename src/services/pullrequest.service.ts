import PullRequestModel from '../database/models/PullRequest'
import { PullRequest } from '../models/PullRequest';

export default class PullRequestService {
  static async getPullRequests(id: string): Promise<PullRequest[]> {
    return <PullRequest[]><unknown>PullRequestModel.find({ 'pullRequestUserData.githubId': id });
  }
}