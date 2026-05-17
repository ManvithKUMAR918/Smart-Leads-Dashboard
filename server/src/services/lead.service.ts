import { FilterQuery } from 'mongoose';
import { Lead, ILeadDocument } from '../models/Lead.model';
import { ApiError } from '../utils/ApiError';
import {
  CreateLeadBody,
  UpdateLeadBody,
  LeadQueryParams,
  PaginationMeta,
} from '../types';

interface LeadListResult {
  leads: ILeadDocument[];
  pagination: PaginationMeta;
}

export class LeadService {
  static async create(
    data: CreateLeadBody,
    userId: string
  ): Promise<ILeadDocument> {
    const lead = await Lead.create({
      ...data,
      createdBy: userId,
    });

    return lead.populate('createdBy', 'name email role');
  }

  static async getAll(query: LeadQueryParams): Promise<LeadListResult> {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10', 10)));
    const skip = (page - 1) * limit;

    // Build filter
    const filter: FilterQuery<ILeadDocument> = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.source) {
      filter.source = query.source;
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
      ];
    }

    // Build sort
    const sortOrder = query.sortBy === 'oldest' ? 1 : -1;
    const sort: Record<string, 1 | -1> = { createdAt: sortOrder };

    // Execute query
    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email role')
        .lean(),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    const pagination: PaginationMeta = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    return { leads: leads as unknown as ILeadDocument[], pagination };
  }

  static async getById(id: string): Promise<ILeadDocument> {
    const lead = await Lead.findById(id).populate('createdBy', 'name email role');

    if (!lead) {
      throw ApiError.notFound('Lead not found');
    }

    return lead;
  }

  static async update(
    id: string,
    data: UpdateLeadBody
  ): Promise<ILeadDocument> {
    const lead = await Lead.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name email role');

    if (!lead) {
      throw ApiError.notFound('Lead not found');
    }

    return lead;
  }

  static async delete(id: string): Promise<void> {
    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      throw ApiError.notFound('Lead not found');
    }
  }

  static async exportCSV(query: LeadQueryParams): Promise<ILeadDocument[]> {
    const filter: FilterQuery<ILeadDocument> = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.source) {
      filter.source = query.source;
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
      ];
    }

    const sortOrder = query.sortBy === 'oldest' ? 1 : -1;

    const leads = await Lead.find(filter)
      .sort({ createdAt: sortOrder })
      .populate('createdBy', 'name email role')
      .lean();

    return leads as unknown as ILeadDocument[];
  }
}
