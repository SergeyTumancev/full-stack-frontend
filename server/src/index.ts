import cors from 'cors';
import express from 'express';
import { getProductBySlug, products } from './data/products';

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

app.get('/api/products', (_req, res) => {
  res.json({ data: products });
});

app.get('/api/products/:slug', (req, res) => {
  const { slug } = req.params;
  const product = getProductBySlug(slug);

  if (!product) {
    res
      .status(404)
      .json({ error: { code: 'PRODUCT_NOT_FOUND', message: 'Товар не найден', slug: slug } });
    return;
  }

  res.json({ data: product });
});

app.listen(port, () => {
  console.log(`API запущен на http://localhost:${port}`);
});
