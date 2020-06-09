import { Router, Request, Response } from 'express';
import PullRequestController from '../../controllers/pullrequest.controller';

const router = Router();

router.use((req: Request, res: Response, next: Function) => {
  if (!req.user) return res.status(403).json({ msg: 'Not Authorized' });
  return next();
});

/** 
 * GET /
 * Returns User's Pull Requests
 */
router.get('/', PullRequestController.getPullRequests);

/**
 *  GET /:idOrName
 *  Return pull requests based on id or name
 */
router.get('/:idOrName', PullRequestController.getPullRequestByIdOrName);

router.get('/users/all', PullRequestController.getAllPullRequests);

export default router;