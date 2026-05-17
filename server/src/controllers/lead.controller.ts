import { Response } from 'express';
import { LeadService } from '../services/lead.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import {
  AuthenticatedRequest,
  CreateLeadBody,
  UpdateLeadBody,
  LeadQueryParams,
} from '../types';

export const createLead = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const data = req.body as CreateLeadBody;
    const lead = await LeadService.create(data, req.user!.id);

    ApiResponse.created(res, 'Lead created successfully', { lead });
  }
);

export const getLeads = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const query = req.query as unknown as LeadQueryParams;
    const { leads, pagination } = await LeadService.getAll(query);

    ApiResponse.paginated(res, 'Leads retrieved successfully', { leads }, pagination);
  }
);

export const getLeadById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const lead = await LeadService.getById(req.params.id as string);

    ApiResponse.ok(res, 'Lead retrieved successfully', { lead });
  }
);

export const updateLead = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const data = req.body as UpdateLeadBody;
    const lead = await LeadService.update(req.params.id as string, data);

    ApiResponse.ok(res, 'Lead updated successfully', { lead });
  }
);

export const deleteLead = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await LeadService.delete(req.params.id as string);

    ApiResponse.noContent(res, 'Lead deleted successfully');
  }
);

export const exportLeadsCSV = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const query = req.query as unknown as LeadQueryParams;
    const leads = await LeadService.exportCSV(query);

    // Build CSV manually to avoid dependency issues
    const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
    const rows = leads.map((lead) => {
      const createdBy = lead.createdBy as unknown as { name: string; email: string };
      return [
        `"${lead.name}"`,
        `"${lead.email}"`,
        `"${lead.status}"`,
        `"${lead.source}"`,
        `"${new Date(lead.createdAt).toISOString()}"`,
        `"${createdBy?.name || 'N/A'}"`,
      ].join(',');
    });

    const allHeaders = [...headers, 'Created By'];
    const csv = [allHeaders.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads-export.csv');
    res.send(csv);
  }
);
