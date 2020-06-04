import PullRequestModel from '../database/models/PullRequest'

export default class PullRequestService {
  static async getPullRequests(id: string) {
    return PullRequestModel.findById({ 'pullRequestUserData.githubId': id });
  }
}