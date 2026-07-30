import { z } from 'zod';

export const allocateWorkerSchema = z.object({
  worker_id: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
  project_id: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
  day_of_week: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  allocation_date: z.string().optional()
});

export const removeAllocationSchema = z.object({
  id: z.number().or(z.string().regex(/^\d+$/).transform(Number)).optional(),
  worker_id: z.number().or(z.string().regex(/^\d+$/).transform(Number)).optional(),
  project_id: z.number().or(z.string().regex(/^\d+$/).transform(Number)).optional(),
  day_of_week: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).optional()
});

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project/Site name is required'),
  description: z.string().optional()
});

export const createWorkerSchema = z.object({
  name: z.string().min(1, 'Worker name is required'),
  trade: z.string().min(1, 'Trade is required'),
  experience: z.string().optional(),
  skill_level: z.string().optional(),
  profile_photo_url: z.string().optional()
});

export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid request data',
        errors: err.errors
      });
    }
    next(err);
  }
};
