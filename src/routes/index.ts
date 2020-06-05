import { Router } from 'express';
import auth from './auth/auth';
import github from './github';
import user from './user/user';

const router = Router();

router.use('/auth', auth);
router.use('/github', github);
router.use('/users', user);

export default router;