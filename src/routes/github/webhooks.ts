import { Router } from 'express';
import { validateGithubPayload, validateEventPayload } from '../../middlewares/github';
import WebhookController from '../../controllers/webhook.controller';

const router = Router();



router.post('/pull-request',
  validateGithubPayload,
  validateEventPayload,
  WebhookController.postGithubPullRequest);

router.post('/issues', validateGithubPayload, WebhookController.postGithubIssue);

export default router;