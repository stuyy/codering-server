import passport from 'passport';
import { Router } from 'express';
import AuthController from '../../controllers/auth.controller';

const router = Router();

router.get('/user', AuthController.getUserDetails);
router.get('/github', passport.authenticate('github'));
router.get('/github/redirect', passport.authenticate('github'), AuthController.githubRedirect);

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