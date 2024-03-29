import { Request, Response } from 'express';
import EventService from '../services/events.service';
import { UserSession } from '../models/SessionUser';
import OAuth2Credentials from '../database/models/OAuth2Credentials';
import { decryptToken } from '../utilities/hash';
import GithubService from '../services/external/github.service';

export default class WebhookController {
  static async postGithubPullRequest(req: Request, res: Response) {
    const { action, pull_request, repository } = req.body;
    const { merged } = pull_request;
    console.log(`New PR Action: ${action}`);
    if (pull_request.base.ref !== 'master') return res.status(403).json({ msg: 'Not Master Branch' });
    const userId: string = pull_request.user.id;

    try {
      const { default: module } = await import(`../actions/pull-requests/${action}`);
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
    const { action, issue, repository } = req.body;
    console.log(`New Issue Action: ${action}`);
  }

  static async createRepositoryWebhook(req: Request, res: Response) {
    
  }

  static async getRepositoryWebhooks(req: Request | any, res: Response) {
    const { user } = <{ user: UserSession }>req;
    const credentials = await OAuth2Credentials.findOne({ githubId: user.githubId });
    if (credentials) {
      const githubAccessToken = credentials.get('githubAccessToken');
      const token = decryptToken(githubAccessToken);
      const webhooks = await GithubService.getWebhooks(token);
      res.send(webhooks);
    }
  }

  static async postPullRequestComment(req: Request, res: Response) {
    console.log('Hmmm');
  }
}