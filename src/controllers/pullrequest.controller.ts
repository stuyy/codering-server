import { Request, Response } from 'express';
import PullRequestService from '../services/pullrequest.service';
import { UserSession } from '../models/SessionUser';

export default class PullRequestController {
  static async getPullRequests(req: Request | any, res: Response){
    const { user } = <{ user: UserSession }>req;
    if (!req.user) return res.status(403).json({ msg: 'Not Authorized' });
    const pullRequests = await PullRequestService.getPullRequests(user.githubId);
    console.log(pullRequests);
  }

  static async getPullRequestByIdOrName(req: Request, res: Response){
    console.log(req.user);
    if (!req.user) return res.status(403).json({ msg: 'Not Authorized' });
    
  }
}