import { Router } from 'express';
import EventController from '../../controllers/events.controller';
import { authenticated, checkAdmin } from '../../middlewares/auth';

const router = Router();

router.get('/', authenticated, EventController.getEvents);

router.post('/', [authenticated, checkAdmin], EventController.createEvent);

router.put('/:repositoryId', EventController.closeEvent);

export default router;