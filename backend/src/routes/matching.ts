import { Router } from 'express';
import matchingController from '../controllers/matching.controller';

const router = Router();

router.get('/company/:companyId/workflows', matchingController.findWorkflowMatches.bind(matchingController));
router.get('/user/:userId/products', matchingController.findProductMatches.bind(matchingController));
router.get('/:entityType/:entityId', matchingController.getMatches.bind(matchingController));
router.get('/analytics', matchingController.getMatchAnalytics.bind(matchingController));

export default router;
