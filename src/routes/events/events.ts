import { Router } from 'express';
import EventController from '../../controllers/events.controller';
import { authenticated, checkAdmin } from '../../middlewares/auth';

const router = Router();

router.get('/', authenticated, EventController.getEvents);

router.get('/:repositoryId/pull-requests', EventController.getPullRequests);

router.put('/:repositoryId', EventController.closeEvent);

router.post('/', [authenticated, checkAdmin], EventController.createEvent);


export default router;