import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { asyncHandler } from '../async-handler';
import { createUser, findUserByEmail } from './auth.repo';
import { Prisma } from '../generated/prisma/client';
import type { User } from '../generated/prisma/client';
import type { Response } from 'express';

const authRouter = Router();
const SALT_ROUNDS = 12;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sendValidationError(res: Response, message: string) {
  res.status(400).json({
    error: {
      code: 'VALIDATION_ERROR',
      message,
    },
  });
}

function toPublicUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

authRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
    const body = req.body;

    if (typeof body !== 'object' || body === null) {
      sendValidationError(res, 'Тело запроса должно быть JSON-объектом');
      return;
    }

    const { email, password, name } = body as Record<string, unknown>;
    if (typeof email !== 'string') {
      sendValidationError(res, 'email обязателен и должен быть строкой');
      return;
    }

    if (typeof password !== 'string') {
      sendValidationError(res, 'password обязателен и должен быть строкой');
      return;
    }

    if (name !== undefined && name !== null && typeof name !== 'string') {
      sendValidationError(res, 'name должен быть строкой');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const normalizedName = typeof name === 'string' && name.trim().length > 0 ? name.trim() : null;

    if (!emailPattern.test(normalizedEmail)) {
      sendValidationError(res, 'Некорректный email');
      return;
    }

    if (password.length < 8) {
      sendValidationError(res, 'Пароль должен содержать минимум 8 символов');
      return;
    }

    if (Buffer.byteLength(password, 'utf8') > 72) {
      sendValidationError(res, 'Пароль слишком длинный');
      return;
    }

    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
      res.status(409).json({
        error: {
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'Пользователь с таким email уже существует',
        },
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    try {
      const user = await createUser({
        email: normalizedEmail,
        passwordHash,
        name: normalizedName,
      });

      res.status(201).json({
        data: toPublicUser(user),
      });
      return;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        res.status(409).json({
          error: {
            code: 'EMAIL_ALREADY_EXISTS',
            message: 'Пользователь с таким email уже существует',
          },
        });
        return;
      }

      throw error;
    }
  }),
);

export default authRouter;
