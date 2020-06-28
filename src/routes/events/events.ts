import { Router } from 'express';
import EventController from '../../controllers/events.controller';
import { authenticated, checkAdmin } from '../../middlewares/auth';

const router = Router();

/**
 * GET /events
 * description:
 *  Gets all events that are opened.
 */
router.get('/', authenticated, EventController.getEvents);

/**
 * GET /events/:repositoryId/pull-requests
 * description:
 *  Gets all pull requests for a repository or event.
 */
router.get('/:repositoryId/pull-requests', EventController.getPullRequests);

/**
 * PUT /events/:repositoryId
 * description:
 *  Updates an event
 */
router.put('/:repositoryId', EventController.closeEvent);

/**
 * POST /events
 * description:
 *  Creates a new Event
 */
router.post('/', [authenticated, checkAdmin], EventController.createEvent);

/**
 * GET /events/:repositoryId/leaderboards
 */
router.get('/:repositoryId/leaderboards', EventController.getLeaderboards);

export default router;