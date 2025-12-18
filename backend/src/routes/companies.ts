import { Router } from 'express';
import companyController from '../controllers/company.controller';

const router = Router();

router.get('/', companyController.getCompanies.bind(companyController));
router.get('/:id', companyController.getCompanyById.bind(companyController));
router.post('/', companyController.createCompany.bind(companyController));
router.put('/:id', companyController.updateCompany.bind(companyController));
router.delete('/:id', companyController.deleteCompany.bind(companyController));

export default router;
