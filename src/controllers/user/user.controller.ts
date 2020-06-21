import { Request, Response } from 'express';
import { UserSession } from '../../models/SessionUser';
import UserService from '../../services/user.service';
import PullRequestService from '../../services/pullrequest.service';

export default class UserController {
  
  static async getUser(req: Request, res: Response) {
    console.log(req.user);
    const { nameOrId } = req.params;
    console.time(`Fetching user: ${nameOrId}`)
    const user = await UserService.getUser(nameOrId);
    console.timeEnd(`Fetching user: ${nameOrId}`)
    if (!user) return res.status(404).send({ msg: 'User not found' });
    return res.status(200).send(user);
  }

  static async getPullRequests(req: Request, res: Response): Promise<Response> {
    const { nameOrId } = req.params;
    console.log(req.user);
    console.time(`Fetching user PRs: ${nameOrId}`)
    const pullRequests = await PullRequestService.getPullRequestsByNameOrId(nameOrId);
    console.timeEnd(`Fetching user PRs: ${nameOrId}`);
    return res.status(200).send(pullRequests);
  }

  static async getIssues(req: Request, res: Response): Promise<Response> {
    return res.status(200).send({ msg: 'Good' });
  }
}