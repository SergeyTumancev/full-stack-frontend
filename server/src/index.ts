import cors from "cors";
import express from "express";
import { getProductById, products } from "./data/products";

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/products", (_req, res) => {
  res.json({ data: products });
});

app.get("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const product = getProductById(id);

  if (!product) {
    res.status(404).json({ "error": { "code": "PRODUCT_NOT_FOUND", "message": "Товар не найден", "id": id }});
    return;
  }

  res.json({ data: product });
});

app.listen(port, () => {
  console.log(`API запущен на http://localhost:${port}`);
});
