import { Router } from 'express';
import workflowController from '../controllers/workflow.controller';

const router = Router();

router.get('/', workflowController.getWorkflows.bind(workflowController));
router.get('/:id', workflowController.getWorkflowById.bind(workflowController));
router.post('/', workflowController.createWorkflow.bind(workflowController));
router.put('/:id', workflowController.updateWorkflow.bind(workflowController));
router.delete('/:id', workflowController.deleteWorkflow.bind(workflowController));

export default router;
