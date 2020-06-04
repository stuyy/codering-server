import { Router, Request, Response } from 'express';
import PullRequestController from '../../controllers/pullrequest.controller';

const router = Router();

router.get('/', PullRequestController.getPullRequests);
router.get('/:idOrName', PullRequestController.getPullRequestByIdOrName);

router.use((req: Request, res: Response, next: Function) => {
  if (!req.user) return res.status(403).json({ msg: 'Not Authorized' });
  next();
});

export default router;