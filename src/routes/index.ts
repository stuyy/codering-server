import { Router } from 'express';
import auth from './auth/auth';
import github from './github';

const router = Router();

router.use('/auth', auth);
router.use('/github', github);


export default router;