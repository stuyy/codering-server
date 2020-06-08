import { Request, Response } from 'express';
import PullRequestModel from '../database/models/PullRequest';
import { buildPullRequestObject } from '../utilities/resolver';
import { GithubActions } from '../constants/GithubActions';
import WebhookService from '../services/webhook.service';
import EventService from '../services/events.service';

// We need to check to make sure if the User is in the Database.

export default class WebhookController {
  static async postGithubPullRequest(req: Request, res: Response) {
    const { action, pull_request, repository } = req.body;
    const { id: pullRequestID, merged } = pull_request;

    console.log(`New PR Action: ${action}`);

    try {
      const event = await EventService.validateEvent(repository.id);
      console.log(event);
      if (!event)
        return res.status(409).send({ msg: 'Pull Request is not associated with a Valid Event' });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ msg: 'Internal Server Error' });
    }
    
    console.log(`Valid Event. Continuing`);

    if (pull_request.base.ref !== 'master')
      return res.status(403).json({ msg: 'Not Master Branch' });
    // Before we start saving Pull Requests to the Database, we must check the Database for an "Event"
    // Document and check which Repository that Event corresponds to.
    switch (action) {
      case GithubActions.OPENED: {
        console.time(`PR ${pullRequestID} was opened.`)
        const newPr = await WebhookService.handleOpenedPullRequest(req.body);
        console.timeEnd(`PR ${pullRequestID} was opened.`)
        break;
      }
      case GithubActions.REOPENED: {
        // Search the Database for the Pull Request
        console.time('Pull Request ${pullRequestID} was re-opened.');
        await WebhookService.findAndUpdate(pullRequestID, GithubActions.REOPENED, pull_request.updated_at);
        console.timeEnd('Pull Request ${pullRequestID} was re-opened.');
        break;
      }
      case GithubActions.CLOSED: {
        // Search the Database for the Pull Request.
        if (merged) {
          console.time('Merging PR');
          await WebhookService.findAndUpdate(pullRequestID, GithubActions.MERGED, pull_request.updated_at, pull_request.merged_at, pull_request.closed_at);
          console.timeEnd('Merging PR');
        } else {
          console.time(`Pull Request ${pullRequestID} was closed.`);
          await WebhookService.findAndUpdate(pullRequestID, GithubActions.CLOSED, pull_request.updated_at, undefined, pull_request.closed_at);
          console.timeEnd(`Pull Request ${pullRequestID} was closed.`);
        }
      }
    }
    res.status(201);
  }
  static async getGithubPullRequest() {
    
  }

  static async postGithubIssue(req: Request, res: Response) {
    console.log(`New Issue`)
  }
}