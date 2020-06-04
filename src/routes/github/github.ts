import { Router } from 'express';
import WebhookRoute from './webhooks';

const router = Router();

router.get('/', (req, res) => res.send({ msg: 'GitHub' }));

router.use('/webhook', WebhookRoute);

export default router;