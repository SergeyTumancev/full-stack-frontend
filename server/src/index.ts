import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import { getProductBySlug, getProducts } from './products.repo';
import { asyncHandler } from './async-handler';
import { Prisma } from './generated/prisma/client';

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get(
  '/api/products',
  asyncHandler(async (_req, res) => {
    const products = await getProducts();
    res.json({ data: products });
  }),
);

app.get(
  '/api/products/:slug',
  asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const product = await getProductBySlug(slug);

    if (!product) {
      res
        .status(404)
        .json({ error: { code: 'PRODUCT_NOT_FOUND', message: 'Товар не найден', slug: slug } });
      return;
    }

    res.json({ data: product });
  }),
);

const prismaUnavailable = new Set(['P1001', 'P1002', 'P1008', 'P1017']);
const driverUnavailable = new Set([
  'ECONNREFUSED',
  'ECONNRESET',
  'ETIMEDOUT',
  'ENOTFOUND',
  'EAI_AGAIN',
  'EPIPE',
]);

app.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
  console.error(`${new Date().toISOString()} ${_req.method} ${_req.path}`, error);

  if (res.headersSent) {
    return next(error);
  }

  const code = (error as { code?: string }).code;

  const dbUnavailable =
    error instanceof Prisma.PrismaClientInitializationError ||
    (code !== undefined && (prismaUnavailable.has(code) || driverUnavailable.has(code)));

  if (dbUnavailable) {
    res.status(503).json({
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Сервис временно недоступен, попробуйте позже',
      },
    });
    return;
  }

  res.status(500).json({
    error: { code: 'INTERNAL_SERVER_ERROR', message: 'Внутренняя ошибка сервера' },
  });
});

app.listen(port, () => {
  console.log(`API запущен на http://localhost:${port}`);
});
