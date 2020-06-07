import { Request, Response } from 'express';
import PullRequestService from '../services/pullrequest.service';
import { UserSession } from '../models/SessionUser';

export default class PullRequestController {
  static async getPullRequests(req: Request | any, res: Response){
    const { user } = <{ user: UserSession }>req;
    if (!req.user) return res.status(403).json({ msg: 'Not Authorized' });
    console.time(`Fetching PRs for ${user.username} (${user.githubId})`);
    try {
      const pullRequests = await PullRequestService.getPullRequests(user.githubId);
      console.timeEnd(`Fetching PRs for ${user.username} (${user.githubId})`);
      res.status(200).send(pullRequests);
    } catch (err) {
      console.log(err);
      res.status(500).send({ msg: 'Internal Server Error' });
    }
  }

  static async getPullRequestByIdOrName(req: Request, res: Response){
    console.log(req.user);
    if (!req.user) return res.status(403).json({ msg: 'Not Authorized' });
  }
  
  static async getAllPullRequests(req: Request, res: Response) {
    try {
      const pullRequests = await PullRequestService.getAllPullRequests();
      return res.status(200).send(pullRequests);
    } catch (err) {
      console.log(err);
    }
  }
}