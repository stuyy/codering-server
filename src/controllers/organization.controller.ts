import { Request, Response } from 'express';
import { UserSession } from '../models/SessionUser';
import GithubService from '../services/external/github.service';

export default class OrganizationController {
  static async getOrganizations(req: Request | any, res: Response) {
    const { user } = <{ user: UserSession }>req;
    const { username, githubId } = user;
    const result = await GithubService.fetchOrganizations(username, githubId);
    const orgs = await result.json();
    res.send(orgs);
  }

  static async getOrganizationRepositories(req: Request | any, res: Response) {
    const { user } = <{ user: UserSession }>req;
    const { org } = req.params;
    if (!org) return res.status(400).send({ msg: 'Bad Request' });
    const result = await GithubService.fetchRepositoriesByOrganization(org, user.githubId);
    const response = await result.json();
    res.send(response);
  }
}