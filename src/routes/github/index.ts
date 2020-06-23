import { Router } from 'express';
import WebhookRoute from './webhooks';
import PullRequestRoute from './pull-request';
const router = Router();

router.use('/pull-request', PullRequestRoute);
router.use('/webhook', WebhookRoute);

export default router;