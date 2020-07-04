import { Router } from 'express';
import OrganizationController from '../../controllers/organization.controller';
import { authenticated } from '../../middlewares/auth';

const router = Router();

router.get('/', authenticated, OrganizationController.getOrganizations);

router.get('/:org/repositories', authenticated, OrganizationController.getOrganizationRepositories);

export default router;