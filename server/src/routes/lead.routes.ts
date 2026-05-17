import { Router } from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from '../controllers/lead.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createLeadValidation,
  updateLeadValidation,
  leadIdValidation,
} from '../validators/lead.validator';
import { UserRole } from '../types';

const router = Router();

// All lead routes require authentication
router.use(authenticate);

// CSV export (must be before /:id to avoid route conflict)
router.get('/export/csv', exportLeadsCSV);

// CRUD operations
router.post('/', createLeadValidation, validate, createLead);
router.get('/', getLeads);
router.get('/:id', leadIdValidation, validate, getLeadById);
router.put('/:id', updateLeadValidation, validate, updateLead);
router.delete('/:id', leadIdValidation, validate, authorize(UserRole.ADMIN), deleteLead);

export default router;
