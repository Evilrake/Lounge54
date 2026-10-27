import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import multer from "multer";
import { decrement, readRows, stockOf, writeRows } from "./lib/stock.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, "data");
const UPLOADS = path.join(__dirname, "uploads");
const PUBLIC = path.join(__dirname, "public");
const STOCK_FILE = path.join(DATA, "stock.xlsx");
const ADMIN_FILE = path.join(DATA, "admin.json");
const FOLDERS = new Set(["hookah", "bowls", "kalouds", "flasks", "shafts", "meshes", "files"]);
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf", ".txt", ".svg"]);

const sessions = new Map();

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(DATA, name), "utf8"));
}

function writeJson(name, value) {
  fs.writeFileSync(path.join(DATA, name), `${JSON.stringify(value, null, 2)}\n`);
}

function ensureAdmin() {
  if (fs.existsSync(ADMIN_FILE)) return JSON.parse(fs.readFileSync(ADMIN_FILE, "utf8")).password;
  const password = process.env.ADMIN_PASSWORD || crypto.randomBytes(4).toString("hex");
  fs.writeFileSync(ADMIN_FILE, `${JSON.stringify({ password }, null, 2)}\n`);
  console.log(`Пароль админки записан в data/admin.json: ${password}`);
  return password;
}

ensureAdmin();

function currentPassword() {
  return JSON.parse(fs.readFileSync(ADMIN_FILE, "utf8")).password;
}

async function seedStock() {
  if (fs.existsSync(STOCK_FILE)) return;
  const products = readJson("products.json");
  const brands = readJson("brands.json");
  const categories = readJson("categories.json");
  const qty = {
    classic: 6,
    night: 2,
    compact: 4,
    phunnel: 8,
    open: 5,
    deep: 3,
    heat: 7,
    "heat-mini": 4,
    clear: 3,
    smoke: 0,
    craft: 2,
    stem: 4,
    "stem-slim": 1,
    mesh: 12,
  };
  const rows = products
    .filter((product) => Object.prototype.hasOwnProperty.call(qty, product.id))
    .map((product) => ({
      Артикул: product.id,
      Название: product.name,
      Категория: categories.find((item) => item.id === product.category)?.title || product.category,
      Бренд: brands.find((item) => item.id === product.brandId)?.name || "",
      Количество: qty[product.id],
    }));
  await writeRows(STOCK_FILE, rows);
}

if (!fs.existsSync(path.join(DATA, "orders.json"))) writeJson("orders.json", []);

function safeFolder(name) {
  if (!FOLDERS.has(name)) {
    const error = new Error("Неизвестная папка");
    error.status = 400;
    throw error;
  }
  return name;
}

function listFiles(folder) {
  const dir = path.join(UPLOADS, safeFolder(folder));
  return fs
    .readdirSync(dir)
    .filter((name) => name !== ".gitkeep" && fs.statSync(path.join(dir, name)).isFile());
}

function publicProduct(product, rows, brands, categories) {
  const stock = stockOf(rows, product.id);
  const brand = brands.find((item) => item.id === product.brandId);
  const category = categories.find((item) => item.id === product.category);
  return {
    ...product,
    brandName: brand?.name || "",
    categoryTitle: category?.title || product.category,
    inStock: stock.inStock,
    qty: stock.qty,
    imageUrl: product.image ? `/uploads/${product.category}/${encodeURIComponent(product.image)}` : "",
  };
}

async function catalogPayload() {
  const products = readJson("products.json");
  const brands = readJson("brands.json");
  const categories = readJson("categories.json");
  const pages = readJson("pages.json");
  const rows = await readRows(STOCK_FILE);
  return {
    categories,
    brands,
    pages,
    products: products.map((product) => publicProduct(product, rows, brands, categories)),
  };
}

function requireAdmin(req, res, next) {
  const token = String(req.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token || !sessions.has(token)) {
    res.status(401).json({ error: "Нужен вход в админку" });
    return;
  }
  next();
}

function passwordsMatch(input) {
  const left = Buffer.from(String(input));
  const right = Buffer.from(String(currentPassword()));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, _file, callback) {
      try {
        callback(null, path.join(UPLOADS, safeFolder(req.query.folder)));
      } catch (error) {
        callback(error);
      }
    },
    filename(_req, file, callback) {
      const ext = path.extname(file.originalname).toLowerCase();
      const base = path
        .basename(file.originalname, path.extname(file.originalname))
        .replace(/[^\w.-]+/g, "-")
        .slice(0, 40);
      callback(null, `${Date.now()}-${base || "file"}${ext}`);
    },
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter(req, file, callback) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXT.has(ext)) {
      callback(new Error("Такой тип файла не сохраняем"));
      return;
    }
    if (req.query.folder !== "files" && !file.mimetype.startsWith("image/") && ext !== ".svg") {
      callback(new Error("В папку категории можно загрузить только изображение"));
      return;
    }
    callback(null, true);
  },
});

async function syncStockRow(product) {
  const brands = readJson("brands.json");
  const categories = readJson("categories.json");
  const rows = await readRows(STOCK_FILE);
  let row = rows.find((item) => String(item["Артикул"]) === product.id);
  const brandName = brands.find((item) => item.id === product.brandId)?.name || "";
  const categoryTitle = categories.find((item) => item.id === product.category)?.title || product.category;
  if (!row) {
    row = {
      Артикул: product.id,
      Название: product.name,
      Категория: categoryTitle,
      Бренд: brandName,
      Количество: 0,
    };
    rows.push(row);
  } else {
    row["Название"] = product.name;
    row["Категория"] = categoryTitle;
    row["Бренд"] = brandName;
  }
  await writeRows(STOCK_FILE, rows);
}

const app = express();
app.use(express.json({ limit: "1mb" }));

app.get("/api/bootstrap", async (_req, res) => {
  res.json(await catalogPayload());
});

app.post("/api/orders", async (req, res) => {
  const productId = String(req.body.productId || "");
  const qty = Math.floor(Number(req.body.qty));
  const products = readJson("products.json");
  const product = products.find((item) => item.id === productId);
  if (!product) {
    res.status(404).json({ error: "Товар не найден" });
    return;
  }
  if (!Number.isInteger(qty) || qty < 1) {
    res.status(400).json({ error: "Укажите количество" });
    return;
  }
  const stock = stockOf(await readRows(STOCK_FILE), product.id);
  if (!stock.inStock || stock.qty < qty) {
    res.status(409).json({ error: "Этого количества нет в наличии" });
    return;
  }
  const orders = readJson("orders.json");
  const order = {
    id: crypto.randomBytes(4).toString("hex"),
    productId: product.id,
    name: product.name,
    qty,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  orders.unshift(order);
  writeJson("orders.json", orders);
  const pages = readJson("pages.json");
  const text = `Хочу купить: ${product.name}, ${qty} шт. Заявка ${order.id}`;
  res.json({
    order,
    telegramUrl: `${pages.telegramUrl}?text=${encodeURIComponent(text)}`,
  });
});

app.post("/api/admin/login", (req, res) => {
  if (!passwordsMatch(req.body.password || "")) {
    res.status(401).json({ error: "Неверный пароль" });
    return;
  }
  const token = crypto.randomBytes(24).toString("hex");
  sessions.set(token, Date.now());
  res.json({ token });
});

app.get("/api/admin/state", requireAdmin, async (_req, res) => {
  const folders = {};
  for (const folder of FOLDERS) folders[folder] = listFiles(folder);
  res.json({
    ...(await catalogPayload()),
    stock: await readRows(STOCK_FILE),
    orders: readJson("orders.json"),
    folders,
  });
});

app.put("/api/admin/products/:id", requireAdmin, async (req, res) => {
  const products = readJson("products.json");
  const index = products.findIndex((item) => item.id === req.params.id);
  if (index < 0) {
    res.status(404).json({ error: "Товар не найден" });
    return;
  }
  const next = normalizeProduct({ ...products[index], ...req.body, id: products[index].id });
  products[index] = next;
  writeJson("products.json", products);
  await syncStockRow(next);
  res.json(next);
});

app.post("/api/admin/products", requireAdmin, async (req, res) => {
  const products = readJson("products.json");
  const id = String(req.body.id || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-");
  if (!id || products.some((item) => item.id === id)) {
    res.status(400).json({ error: "Нужен уникальный артикул латиницей" });
    return;
  }
  const product = normalizeProduct({ ...req.body, id });
  products.push(product);
  writeJson("products.json", products);
  await syncStockRow(product);
  res.json(product);
});

app.delete("/api/admin/products/:id", requireAdmin, (req, res) => {
  const products = readJson("products.json").filter((item) => item.id !== req.params.id);
  writeJson("products.json", products);
  res.json({ ok: true });
});

app.put("/api/admin/brands/:id", requireAdmin, (req, res) => {
  const brands = readJson("brands.json");
  const index = brands.findIndex((item) => item.id === req.params.id);
  if (index < 0) {
    res.status(404).json({ error: "Бренд не найден" });
    return;
  }
  brands[index] = normalizeBrand({ ...brands[index], ...req.body, id: brands[index].id });
  writeJson("brands.json", brands);
  res.json(brands[index]);
});

app.post("/api/admin/brands", requireAdmin, (req, res) => {
  const brands = readJson("brands.json");
  const id = String(req.body.id || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-");
  if (!id || brands.some((item) => item.id === id)) {
    res.status(400).json({ error: "Нужен уникальный код бренда латиницей" });
    return;
  }
  const brand = normalizeBrand({ ...req.body, id });
  brands.push(brand);
  writeJson("brands.json", brands);
  res.json(brand);
});

app.delete("/api/admin/brands/:id", requireAdmin, (req, res) => {
  writeJson(
    "brands.json",
    readJson("brands.json").filter((item) => item.id !== req.params.id),
  );
  res.json({ ok: true });
});

app.put("/api/admin/pages", requireAdmin, (req, res) => {
  const current = readJson("pages.json");
  const next = {
    telegramUrl: String(req.body.telegramUrl || current.telegramUrl),
    catering: req.body.catering || current.catering,
    rental: req.body.rental || current.rental,
  };
  writeJson("pages.json", next);
  res.json(next);
});

app.get("/api/admin/stock", requireAdmin, async (_req, res) => {
  res.json(await readRows(STOCK_FILE));
});

app.put("/api/admin/stock", requireAdmin, async (req, res) => {
  if (!Array.isArray(req.body.rows)) {
    res.status(400).json({ error: "Нужен список строк" });
    return;
  }
  await writeRows(STOCK_FILE, req.body.rows);
  res.json(await readRows(STOCK_FILE));
});

app.get("/api/admin/stock.xlsx", requireAdmin, (_req, res) => {
  res.download(STOCK_FILE, "lounge54-nalichie.xlsx");
});

app.get("/api/admin/orders", requireAdmin, (_req, res) => {
  res.json(readJson("orders.json"));
});

app.post("/api/admin/orders/:id/confirm", requireAdmin, async (req, res) => {
  const orders = readJson("orders.json");
  const order = orders.find((item) => item.id === req.params.id);
  if (!order) {
    res.status(404).json({ error: "Заявка не найдена" });
    return;
  }
  if (order.status !== "pending") {
    res.status(409).json({ error: "Заявка уже обработана" });
    return;
  }
  const result = await decrement(STOCK_FILE, order.productId, order.qty);
  if (!result.ok) {
    res.status(409).json({ error: result.error });
    return;
  }
  order.status = "confirmed";
  order.confirmedAt = new Date().toISOString();
  writeJson("orders.json", orders);
  res.json({ order, qty: result.qty });
});

app.post("/api/admin/orders/:id/cancel", requireAdmin, (req, res) => {
  const orders = readJson("orders.json");
  const order = orders.find((item) => item.id === req.params.id);
  if (!order || order.status !== "pending") {
    res.status(409).json({ error: "Отменить можно только новую заявку" });
    return;
  }
  order.status = "cancelled";
  writeJson("orders.json", orders);
  res.json(order);
});

app.post("/api/admin/upload", requireAdmin, (req, res) => {
  upload.single("file")(req, res, (error) => {
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: "Файл не пришёл" });
      return;
    }
    res.json({ name: req.file.filename, folder: req.query.folder });
  });
});

app.delete("/api/admin/files/:folder/:name", requireAdmin, (req, res) => {
  const folder = safeFolder(req.params.folder);
  const name = path.basename(req.params.name);
  const full = path.join(UPLOADS, folder, name);
  if (!fs.existsSync(full)) {
    res.status(404).json({ error: "Файл не найден" });
    return;
  }
  fs.unlinkSync(full);
  const products = readJson("products.json").map((product) =>
    product.image === name && product.category === folder ? { ...product, image: "" } : product,
  );
  writeJson("products.json", products);
  res.json({ ok: true });
});

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Не найдено" });
});

app.use("/uploads", express.static(UPLOADS));
app.use(express.static(PUBLIC));
app.use((req, res) => {
  if (req.method === "GET" || req.method === "HEAD") {
    res.sendFile(path.join(PUBLIC, "index.html"));
    return;
  }
  res.status(404).end();
});

app.use((error, _req, res, _next) => {
  res.status(error.status || 500).json({ error: error.message || "Ошибка сервера" });
});

function normalizeProduct(input) {
  const categories = new Set(readJson("categories.json").map((item) => item.id));
  const category = categories.has(input.category) ? input.category : "hookah";
  return {
    id: input.id,
    category,
    brandId: String(input.brandId || ""),
    name: String(input.name || "Без названия"),
    summary: String(input.summary || ""),
    description: String(input.description || ""),
    price: Math.max(0, Math.round(Number(input.price) || 0)),
    priceIsPlaceholder: Boolean(input.priceIsPlaceholder),
    featured: Boolean(input.featured),
    image: path.basename(String(input.image || "")),
    specs: toLines(input.specs),
    set: toLines(input.set),
  };
}

function normalizeBrand(input) {
  return {
    id: input.id,
    name: String(input.name || "Бренд"),
    years: Math.max(0, Math.round(Number(input.years) || 0)),
    city: String(input.city || ""),
    makes: String(input.makes || ""),
    summary: String(input.summary || ""),
    about: toLines(input.about),
  };
}

function toLines(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

const port = Number(process.env.PORT) || 3000;
await seedStock();
app.listen(port, () => {
  console.log(`Lounge54: http://127.0.0.1:${port}`);
});
