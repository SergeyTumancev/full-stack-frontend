import { Router } from 'express';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { asyncHandler } from '../async-handler';
import { findUserById } from './auth.repo';
import { sendUnauthorized, toPublicUser } from './helper';

const refreshRouter = Router();

const accessTokenTtlSeconds = Number(process.env.ACCESS_TOKEN_TTL);
const refreshTokenTtlSeconds = Number(process.env.REFRESH_TOKEN_TTL);

if (!Number.isFinite(accessTokenTtlSeconds) || accessTokenTtlSeconds <= 0) {
  throw new Error('ACCESS_TOKEN_TTL должен быть положительным числом секунд');
}

if (!Number.isFinite(refreshTokenTtlSeconds) || refreshTokenTtlSeconds <= 0) {
  throw new Error('REFRESH_TOKEN_TTL должен быть положительным числом секунд');
}

const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
if (!refreshTokenSecret) {
  throw new Error('REFRESH_TOKEN_SECRET не задан');
}

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('JWT_SECRET не задан');
}

refreshRouter.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      sendUnauthorized(res, 'REFRESH_TOKEN_MISSING', 'Токен не найден');
      return;
    }

    try {
      const decoded = jwt.verify(refreshToken, refreshTokenSecret);
      if (typeof decoded !== 'object' || decoded === null) {
        sendUnauthorized(res, 'REFRESH_TOKEN_INVALID', 'Требуется авторизация');
        return;
      }

      const userId = decoded.sub;
      if (typeof userId !== 'string') {
        sendUnauthorized(res, 'REFRESH_TOKEN_INVALID', 'Требуется авторизация');
        return;
      }

      const user = await findUserById(userId);
      if (!user) {
        sendUnauthorized(res, 'REFRESH_TOKEN_INVALID', 'Требуется авторизация');
        return;
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

      const newRefreshToken = jwt.sign({ sub: user.id }, refreshTokenSecret, {
        expiresIn: refreshTokenTtlSeconds,
      });

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: refreshTokenTtlSeconds * 1000,
        path: '/api/auth',
      });

      res.status(200).json({
        data: toPublicUser(user),
      });
      return;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        sendUnauthorized(res, 'REFRESH_TOKEN_EXPIRED', 'Токен просрочен');
        return;
      }

      if (error instanceof JsonWebTokenError) {
        sendUnauthorized(res, 'INVALID_TOKEN', 'Требуется авторизация');
        return;
      }

      throw error;
    }
  }),
);

export default refreshRouter;
