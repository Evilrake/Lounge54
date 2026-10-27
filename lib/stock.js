import fs from "node:fs";
import ExcelJS from "exceljs";

export const HEADERS = ["Артикул", "Название", "Категория", "Бренд", "Количество"];

export async function readRows(file) {
  if (!fs.existsSync(file)) return [];
  const book = new ExcelJS.Workbook();
  await book.xlsx.readFile(file);
  const sheet = book.getWorksheet("Наличие") || book.worksheets[0];
  if (!sheet) return [];
  const rows = [];
  sheet.eachRow((row, index) => {
    if (index === 1) return;
    const item = {};
    HEADERS.forEach((header, headerIndex) => {
      const value = row.getCell(headerIndex + 1).value;
      item[header] = value && typeof value === "object" && "result" in value ? value.result : (value ?? "");
    });
    if (String(item["Артикул"]).trim()) rows.push(item);
  });
  return rows;
}

export async function writeRows(file, rows) {
  const book = new ExcelJS.Workbook();
  const sheet = book.addWorksheet("Наличие");
  sheet.addRow(HEADERS);
  for (const row of rows) {
    sheet.addRow(HEADERS.map((header) => row[header] ?? ""));
  }
  sheet.getColumn(5).numFmt = "0";
  await book.xlsx.writeFile(file);
}

export function stockOf(rows, productId) {
  const row = rows.find((item) => String(item["Артикул"]) === String(productId));
  if (!row) return { inStock: false, qty: null };
  const qty = Number(String(row["Количество"]).replace(",", "."));
  if (!Number.isFinite(qty) || qty <= 0) return { inStock: false, qty: 0 };
  return { inStock: true, qty };
}

export async function decrement(file, productId, amount) {
  const rows = await readRows(file);
  const row = rows.find((item) => String(item["Артикул"]) === String(productId));
  if (!row) return { ok: false, error: "Позиции нет в таблице наличия" };
  const current = Number(String(row["Количество"]).replace(",", "."));
  if (!Number.isFinite(current) || current < amount) {
    return { ok: false, error: "В таблице не хватает количества" };
  }
  row["Количество"] = current - amount;
  await writeRows(file, rows);
  return { ok: true, qty: current - amount };
}
