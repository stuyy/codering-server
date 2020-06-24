import PullRequestModel from '../database/models/PullRequest'
import { GithubActions } from '../constants/Github';
import EventService from './events.service';
import { buildPullRequestObject } from '../utilities/resolver';

export default class WebhookService {

  static async findAndUpdate(
    id: string,
    state: GithubActions,
    lastUpdated: Date,
    mergedAt?: Date,
    closedAt?: Date) {
    return PullRequestModel.findOneAndUpdate({ 'pullRequestData.pullRequestID': id }, { 
      state,
      $set: {
        'pullRequestData.updated_at': lastUpdated,
        'pullRequestData.closed_at': closedAt,
        'pullRequestData.merged_at': mergedAt
      },
    });
  }

  static async handleOpenedPullRequest(body: any) {
    const pr = buildPullRequestObject(body);
    const newPr = new PullRequestModel({
      state: pr.state,
      number: pr.number,
      pullRequestData: pr.pull_request,
      pullRequestUserData: pr.pull_request.user,
      repository: pr.repository,
    });
    return newPr.save();
  }

  static async handleReopenedPullRequest(body: any) {

  }

}