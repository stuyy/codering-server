import { Request, Response } from 'express';

export function authenticated(req: Request, res: Response, next: Function) {
  if (!req.user) return res.status(403).send({ msg: 'Not Authorized' });
  next();
}