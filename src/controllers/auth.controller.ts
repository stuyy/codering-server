import { Request, Response } from 'express';
import { UserSession } from '../models/SessionUser';
import User from '../database/models/User';
const REDIRECT_URI = process.env.ENVIRONMENT === 'DEVELOPMENT' ? 'http://localhost:4200/dashboard' : 'https://ansonfoong.com/intellectual/dashboard';


export default class AuthController {
  static async githubRedirect(req: Request, res: Response) {
    console.log('Redirecting to ' + REDIRECT_URI);
    res.redirect(REDIRECT_URI);
  }

  static async getUserDetails(req: Request | any, res: Response) {
    const { user } = <{ user: UserSession }>req;
    if (!user) return res.status(403).send({ msg: 'Not Authenticated' });
    try {
      const findUser = await User.findOne({ githubId: user.githubId });
      if (findUser)
        res.status(200).send(findUser);
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error' });
    }
  }
}