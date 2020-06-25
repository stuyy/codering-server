import { Router } from 'express';
import auth from './auth/auth';
import github from './github';
import users from './user/user';
import events from './events/events';

const router = Router();

router.use('/auth', auth);
router.use('/github', github);
router.use('/users', users);
router.use('/events', events);

export default router;