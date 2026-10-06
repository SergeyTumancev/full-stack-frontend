import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { asyncHandler } from '../async-handler';
import { findUserByEmail } from './auth.repo';
import jwt from 'jsonwebtoken';
import { sendValidationError, toPublicUser } from './helper';

const loginRouter = Router();
const accessTokenTtlSeconds = Number(process.env.ACCESS_TOKEN_TTL);

if (!Number.isFinite(accessTokenTtlSeconds) || accessTokenTtlSeconds <= 0) {
  throw new Error('ACCESS_TOKEN_TTL должен быть положительным числом секунд');
}

loginRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const body = req.body;

    if (typeof body !== 'object' || body === null) {
      sendValidationError(res, 'Тело запроса должно быть JSON-объектом');
      return;
    }

    const { email, password } = body as Record<string, unknown>;

    if (typeof email !== 'string') {
      sendValidationError(res, 'email обязателен и должен быть строкой');
      return;
    }

    if (typeof password !== 'string' || password.length === 0) {
      sendValidationError(res, 'password обязателен и должен быть строкой');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await findUserByEmail(normalizedEmail);

    if (user === null) {
      res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Неверный email или пароль',
        },
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Неверный email или пароль',
        },
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error('JWT_SECRET не задан');
    }

    const accessToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
      },
      jwtSecret,
      {
        expiresIn: accessTokenTtlSeconds,
      },
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: accessTokenTtlSeconds * 1000,
      path: '/',
    });

    res.status(200).json({
      data: toPublicUser(user),
    });
    return;
  }),
);

export default loginRouter;
