import { Request, Response } from 'express';
import { PullRequest } from '../models/PullRequest';
import PullRequestModel from '../database/models/PullRequest';
import { buildPullRequestObject } from '../utilities/resolver';

export default class WebhookController {
  static async postGithubPullRequest(req: Request, res: Response) {
    const { action } = req.body;
    if (action === 'opened') {
      
      const pr = buildPullRequestObject(req.body);
      const newPr = new PullRequestModel({
        action: pr.action,
        number: pr.number,
        pullRequestData: pr.pull_request,
        pullRequestUserData: pr.pull_request.user,
        repository: pr.repository,
      });
      await newPr.save();
      console.log('Saved!');
      
    } else if (action === 'closed') {
      console.log(action);
    }
    console.log(action);
    res.status(201);
  }

  static async getGithubPullRequest() {
    
  }
}