import { Request, Response } from 'express';
import { GithubHeaders } from '../constants/Headers';
import { computeHash } from '../utilities/hash';
import EventService from '../services/events.service';

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

export async function validateEventPayload(req: Request, res: Response, next: Function) {
  const { repository } = req.body;
  try { 
    const event = await EventService.validateEvent(repository.id);
    if (!event) {
      console.log('Not a valid event');
      return res.status(409).send({ msg: 'The event webhook is not associated with a Valid Event' });
    }
    console.log('Event Payload Valid');
    return next();
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: 'Internal Server Error' });
  }
}

