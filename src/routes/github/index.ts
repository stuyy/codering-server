import { Router } from 'express';
import WebhookRoute from './webhooks';
import PullRequestRoute from './pull-request';
import OrganizationRoute from './organizations';

const router = Router();

router.use('/pull-request', PullRequestRoute);
router.use('/webhook', WebhookRoute);
router.use('/organizations', OrganizationRoute);

export default router;