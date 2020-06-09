import { Request, Response } from 'express';
import PullRequestService from '../services/pullrequest.service';
import { PullRequest } from '../models/PullRequest';

export default class PullRequestController {
  static async getPullRequests(req: Request | any, res: Response){
    console.time(`Fetching PRs for ${req.user.username} (${req.user.githubId})`);
    try {
      const pullRequests = await PullRequestService.getPullRequests(req.user.githubId);
      console.timeEnd(`Fetching PRs for ${req.user.username} (${req.user.githubId})`);
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

    const { count } = req.query;
    if (count) {
      const results = <PullRequest[]>await PullRequestService.getPullRequestsLimit(parseInt(<string>count));
      return res.status(200).send({
        count: results.length,
        results
      });
    }

    try {
      const pullRequests = await PullRequestService.getAllPullRequests();
      return res.status(200).send(pullRequests);
    } catch (err) {
      console.log(err);
    }
  }

  static async getPullRequestByCount(req: Request, res: Response) {
    
  }
}