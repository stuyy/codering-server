import PullRequestModel from '../database/models/PullRequest'
import { GithubActions } from '../constants/GithubActions';

export default class WebhookService {

  static async findAndUpdate(id: string, state: GithubActions) {
    return PullRequestModel.findOneAndUpdate({ 'pullRequestData.pullRequestID': id }, { state });
  }
}