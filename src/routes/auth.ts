import passport from 'passport';
import { Router, Request, Response } from 'express';
import User from '../database/models/User';

const REDIRECT_URI = process.env.ENVIRONMENT === 'DEVELOPMENT' ? 'http://localhost:4200/dashboard' : 'https://ansonfoong.com/intellectual/dashboard';
const router = Router();

router.get('/user', async (req: Request, res: Response) => {
  const { user }: any = req;
  try {
    const findUser = await User.findOne({ githubId: user.githubId });
    if (findUser) {
      res.status(200).send(findUser);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

router.get('/github', passport.authenticate('github'));
router.get('/github/redirect', passport.authenticate('github'),
(req: Request, res: Response) => {
  res.redirect(REDIRECT_URI);
});

// router.get('/discord', setupStrategy(), passport.authenticate('discord'));

// router.get('/discord/redirect', passport.authenticate('discord'), (req: Request, res: Response) => {
//   console.log('hi')
//   console.log(req.user);
//   res.redirect(REDIRECT_URI);
// });

// router.get('/discord/error', (req: Request, res: Response) => {
//   res.send(403);
// });

export default router;