import type { Response } from 'express';
import type { User } from '../generated/prisma/client';

export function sendValidationError(res: Response, message: string) {
  res.status(400).json({
    error: {
      code: 'VALIDATION_ERROR',
      message,
    },
  });
}

export function toPublicUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
