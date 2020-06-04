import { Request, Response } from 'express';
import { GithubHeaders } from '../constants/Headers';
import { computeHash } from '../utilities/hash';

export async function validateGithubPayload(req: Request | any, res: Response, next: Function) {
  const { headers } = req;
  try {
    if (GithubHeaders.GITHUB_SIGNATURE in headers) {
      const githubHash = headers[GithubHeaders.GITHUB_SIGNATURE];
      const hash = `sha1=${computeHash(req.rawBody, 'sha1', 'githubwarrior')}`;
      return hash === githubHash ? next() : res.status(403).json({ msg: 'Invalid Request' });
    } throw new Error('Invalid Request');
  } catch (err) {
    console.log(err);
    res.status(403).json({ msg: 'Invalid Request' });
  }
}