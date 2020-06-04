import passport from 'passport';
import { Router } from 'express';
import AuthController from '../../controllers/auth.controller';

const router = Router();

router.get('/user', AuthController.getUserDetails);
router.get('/github', passport.authenticate('github'));
router.get('/github/redirect', passport.authenticate('github'), AuthController.githubRedirect);
export default router;