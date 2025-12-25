/**
 * Validation Schemas using Zod
 * Validates request data for donors and columns
 */

import { z } from 'zod';

// Donor validation schemas
export const createDonorSchema = z.object({
  donor_name: z.string().min(1, 'Donor name is required').max(200),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional().nullable(),
  total_donated: z.number().min(0).optional().default(0),
  total_donations: z.number().int().min(0).optional().default(0),
  status: z.enum(['potential', 'active', 'inactive']).optional().default('potential')
});

export const updateDonorSchema = z.object({
  donor_name: z.string().min(1).max(200).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional().nullable(),
  total_donated: z.number().min(0).optional(),
  total_donations: z.number().int().min(0).optional(),
  status: z.enum(['potential', 'active', 'inactive']).optional()
});

export const updateCustomFieldSchema = z.object({
  column_key: z.string().min(1, 'Column key is required'),
  value: z.any()
});

// Dynamic column validation schemas
export const createColumnSchema = z.object({
  column_key: z.string()
    .min(1, 'Column key is required')
    .regex(/^[a-z0-9_]+$/, 'Column key must contain only lowercase letters, numbers, and underscores'),
  title: z.string().min(1, 'Column title is required').max(100),
  type: z.enum(['text', 'number', 'email', 'phone', 'date', 'status', 'checkbox', 'dropdown', 'file', 'person', 'link']),
  options: z.any().optional(),
  width: z.number().int().min(50).max(800).optional().default(150),
  order: z.number().int().optional().default(0),
  isRequired: z.boolean().optional().default(false)
});

export const updateColumnSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  type: z.enum(['text', 'number', 'email', 'phone', 'date', 'status', 'checkbox', 'dropdown', 'file', 'person', 'link']).optional(),
  options: z.any().optional(),
  width: z.number().int().min(50).max(800).optional(),
  order: z.number().int().optional(),
  isRequired: z.boolean().optional(),
  isActive: z.boolean().optional()
});

// Query validation schemas
export const querySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
  search: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
  status: z.enum(['potential', 'active', 'inactive']).optional()
});
