import { Router } from 'express';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { asyncHandler } from '../async-handler';
import { findUserById } from './auth.repo';
import { sendUnauthorized, toPublicUser } from './helper';

const meRouter = Router();

meRouter.get(
  '/me',
  asyncHandler(async (req, res) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      sendUnauthorized(res, 'UNAUTHORIZED', 'Требуется авторизация');
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET не задан');
    }

    try {
      const decoded = jwt.verify(accessToken, jwtSecret);
      if (typeof decoded !== 'object' || decoded === null) {
        sendUnauthorized(res, 'INVALID_TOKEN', 'Требуется авторизация');
        return;
      }

      const userId = decoded.sub;
      if (!userId) {
        sendUnauthorized(res, 'INVALID_TOKEN', 'Требуется авторизация');
        return;
      }

      const user = await findUserById(userId);
      if (!user) {
        sendUnauthorized(res, 'INVALID_TOKEN', 'Требуется авторизация');
        return;
      }

      res.json({ data: toPublicUser(user) });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        sendUnauthorized(res, 'TOKEN_EXPIRED', 'Требуется авторизация');
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

export default meRouter;
