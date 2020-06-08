import { Request, Response } from 'express';
import { GithubActions } from '../constants/GithubActions';
import WebhookService from '../services/webhook.service';
import EventService from '../services/events.service';

export default class WebhookController {
  static async postGithubPullRequest(req: Request, res: Response) {
    const { action, pull_request, repository } = req.body;
    const { id: pullRequestID, merged } = pull_request;

    console.log(`New PR Action: ${action}`);

    try { 
      const event = await EventService.validateEvent(repository.id);
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

    const userId: string = pull_request.user.id;
    switch (action) {
      case GithubActions.OPENED: {
        try {
          console.time(`PR ${pullRequestID} was opened.`)
          await WebhookService.handleOpenedPullRequest(req.body);
          await EventService.updateUserEventData(
            repository.id,
            userId.toString(),
            GithubActions.OPENED);
          console.timeEnd(`PR ${pullRequestID} was opened.`);
          return res.status(201).send({ msg: 'Created' });
        } catch (err) {
          console.log(err);
          return res.status(500).send({ msg: 'Internal Server Error' });
        }
      }
      case GithubActions.REOPENED: {
        // Search the Database for the Pull Request
        console.time(`Pull Request ${pullRequestID} was re-opened.`);
        try {
          await WebhookService.findAndUpdate(
            pullRequestID,
            GithubActions.REOPENED,
            pull_request.updated_at);
          
          await EventService.updateUserEventData(
            repository.id,
            userId.toString(),
            GithubActions.REOPENED,
          );
          console.timeEnd('Pull Request ${pullRequestID} was re-opened.');
          return res.status(200).send({ msg: 'Success' });
        } catch (err) {
          console.log(err);
          return res.status(500).send({ msg: 'Internal Server Error' });
        }
      }
      case GithubActions.CLOSED: {
        // Search the Database for the Pull Request.
        if (merged) {
          try {
            console.time(`Merging Pull Request ${pullRequestID}`);
            await WebhookService.findAndUpdate(
              pullRequestID,
              GithubActions.MERGED,
              pull_request.updated_at,
              pull_request.merged_at,
              pull_request.closed_at);
            
            await EventService.updateUserEventData(
              repository.id,
              userId.toString(),
              GithubActions.MERGED,);
            console.timeEnd(`Merging Pull Request ${pullRequestID}`);
            return res.status(200).send({ msg: 'Success' });
          } catch (err) {
            console.log(err);
            return res.status(500).send({ msg: 'Internal Server Error' });
          }
        } else {
          try {
            console.time(`Pull Request ${pullRequestID} was closed.`);
            await WebhookService.findAndUpdate(pullRequestID, GithubActions.CLOSED, pull_request.updated_at, undefined, pull_request.closed_at);
            // Update Points
            await EventService.updateUserEventData(
              repository.id,
              userId.toString(),
              GithubActions.CLOSED);
            console.timeEnd(`Pull Request ${pullRequestID} was closed.`);
            return res.status(200).send({ msg: 'Success' });
          } catch (err) {
            console.log(err);
            return res.status(500).send({ msg: 'Internal Server Error' });
          }
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