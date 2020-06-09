import { Request, Response } from 'express';
import EventService from '../services/events.service';

export default class WebhookController {
  static async postGithubPullRequest(req: Request, res: Response) {
    const { action, pull_request, repository } = req.body;
    const { merged } = pull_request;
    console.log(`New PR Action: ${action}`);
    try { 
      const event = await EventService.validateEvent(repository.id);
      if (!event)
        return res.status(409).send({ msg: 'Pull Request is not associated with a Valid Event' });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ msg: 'Internal Server Error' });
    }
    if (pull_request.base.ref !== 'master')
      return res.status(403).json({ msg: 'Not Master Branch' });

    const userId: string = pull_request.user.id;
    const { default: module } = await import(`../actions/pull-requests/${action}`);
    try {
      await module({ pull_request, repository, body: req.body,userId: userId.toString(), merged });
      return res.status(200).send({ msg: 'Success' });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ msg: 'Internal Server Error' });
    }
  }
  static async getGithubPullRequest() {
    
  }

  static async postGithubIssue(req: Request, res: Response) {
    console.log(`New Issue`)
  }
}