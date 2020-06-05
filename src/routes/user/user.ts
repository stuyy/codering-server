import { Router } from 'express';
import UserController from '../../controllers/user/user.controller';

const router = Router();

router.get('/:nameOrId', UserController.getUser);
router.get('/:nameOrId/pull-requests', UserController.getPullRequests);
router.get('/:nameOrId/issues', UserController.getIssues);

export default router;