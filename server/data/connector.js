const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

const INPUT_FILE =
  process.argv[2] || path.join(__dirname, "amazon_electronics_sample.csv");
const OUTPUT_FILE = process.argv[3] || path.join(__dirname, "data.json");

function cleanText(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text === "" ? null : text;
}

function toNumber(value) {
  if (value === undefined || value === null) return null;

  const raw = String(value).trim();
  if (!raw) return null;

  const normalized = raw.replace(/[$,]/g, "");
  const num = Number(normalized);

  return Number.isFinite(num) ? num : null;
}

function toInt(value) {
  const num = toNumber(value);
  return num === null ? null : Math.round(num);
}

function pick(row, candidates) {
  for (const key of candidates) {
    if (
      row[key] !== undefined &&
      row[key] !== null &&
      String(row[key]).trim() !== ""
    ) {
      return row[key];
    }
  }
  return null;
}

function unique(arr) {
  return [...new Set(arr.filter(Boolean))];
}

function extractUrls(text) {
  if (!text) return [];
  const matches = String(text).match(/https?:\/\/[^\s"'\\\],)]+/g);
  return matches ? unique(matches) : [];
}

function collectImageUrls(row) {
  const urls = [];

  for (const [key, value] of Object.entries(row)) {
    if (!value) continue;

    const lowerKey = key.toLowerCase();

    if (
      lowerKey.includes("image") ||
      lowerKey.includes("thumbnail") ||
      lowerKey.includes("photo") ||
      lowerKey.includes("img")
    ) {
      const found = extractUrls(value);
      if (found.length) {
        urls.push(...found);
      } else if (String(value).startsWith("http")) {
        urls.push(String(value).trim());
      }
    }
  }

  return unique(urls);
}

function buildSpecs(row, excludedKeys) {
  const specs = {};

  for (const [key, value] of Object.entries(row)) {
    if (excludedKeys.has(key)) continue;

    const cleaned = cleanText(value);
    if (cleaned === null) continue;

    specs[key] = cleaned;
  }

  return specs;
}

function main() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`Input file not found: ${INPUT_FILE}`);
    process.exit(1);
  }

  const csvText = fs.readFileSync(INPUT_FILE, "utf8");

  const rows = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    relax_column_count: true,
  });

  const products = rows.map((row, index) => {
    const id = cleanText(pick(row, ["id", "product_id", "asin", "sku"]));

    const title = cleanText(
      pick(row, ["title", "product_title", "name", "product_name"]),
    );

    const brand = cleanText(pick(row, ["brand", "manufacturer"]));

    const price = toNumber(
      pick(row, ["price", "current_price", "sale_price", "final_price"]),
    );

    const priceText = cleanText(
      pick(row, ["price_text", "formatted_price", "display_price"]),
    );

    const rating = toNumber(pick(row, ["rating", "stars", "average_rating"]));

    const reviewCount = toInt(
      pick(row, [
        "review_count",
        "reviews_count",
        "ratings_count",
        "rating_count",
      ]),
    );

    const availability = cleanText(
      pick(row, ["availability", "stock_status", "availability_text"]),
    );

    const categoryName = cleanText(
      pick(row, ["category_name", "category", "subcategory_name"]),
    );

    const categoryId = cleanText(pick(row, ["category_id", "subcategory_id"]));

    const imageUrls = collectImageUrls(row);

    const coreKeys = new Set([
      "id",
      "product_id",
      "asin",
      "sku",
      "title",
      "product_title",
      "name",
      "product_name",
      "brand",
      "manufacturer",
      "price",
      "current_price",
      "sale_price",
      "final_price",
      "price_text",
      "formatted_price",
      "display_price",
      "rating",
      "stars",
      "average_rating",
      "review_count",
      "reviews_count",
      "ratings_count",
      "rating_count",
      "availability",
      "stock_status",
      "availability_text",
      "category_name",
      "category",
      "subcategory_name",
      "category_id",
      "subcategory_id",
    ]);

    const specs = buildSpecs(row, coreKeys);

    return {
      id: id || `row_${index + 1}`,
      source: "amazon_best_selling_electronics_2025_sample",
      title,
      brand,
      price,
      price_text: priceText,
      rating,
      review_count: reviewCount,
      availability,
      category_name: categoryName,
      category_id: categoryId,
      image_urls: imageUrls,
      images_count: imageUrls.length,
      specs,
    };
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(products, null, 2), "utf8");

  console.log(`Parsed rows: ${rows.length}`);
  console.log(`Saved file: ${OUTPUT_FILE}`);
  console.log(`First product:`);
  console.log(JSON.stringify(products[0], null, 2));
}

main();
