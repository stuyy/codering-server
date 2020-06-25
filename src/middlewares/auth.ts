import { Request, Response } from 'express';
import { UserSession } from '../models/SessionUser';

export function authenticated(req: Request, res: Response, next: Function) {
  console.log('Checking Authenticated Credentials');
  if (!req.user) return res.status(403).send({ msg: 'Not Authorized' });
  next();
}

export function checkAdmin(req: Request | any, res: Response, next: Function) {
  console.log('Checking if Administrator');
  const { user } = <{ user: UserSession }>req;
  if (!user)
    return res.status(403).send({ msg: 'Not Authorized' });
  if (!user.roles.includes('ADMINISTRATOR'))
    return res.status(403).send({ msg: 'Forbidden Action' });
  return next();
}