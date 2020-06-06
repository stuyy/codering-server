import { Router } from 'express';
import { validateGithubPayload } from '../../middlewares/github';
import WebhookController from '../../controllers/webhook.controller';

const router = Router();

router.post('/pull-request', validateGithubPayload, WebhookController.postGithubPullRequest);
router.post('/issues', validateGithubPayload, WebhookController.postGithubIssue);

export default router;