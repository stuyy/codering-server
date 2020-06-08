import { Router } from 'express';
import EventController from '../../controllers/events.controller';
import { authenticated } from '../../middlewares/auth';

const router = Router();

router.get('/', authenticated, EventController.getEvents);
router.post('/', authenticated, EventController.createEvent)

export default router;