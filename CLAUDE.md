# Project Rules

## Language
All user-facing text in the client must be in English. If Ukrainian text is found in JSX (labels, buttons, placeholders, etc.), replace it with the English equivalent.

## Product Name Display
When displaying a product name, show only the part before the first comma. Example: `"Samsung Galaxy S24, 256GB"` → `"Samsung Galaxy S24"`. Use `name.split(',')[0]`.

## Device Images
The `img` field on a device may be an array or a string. Always use this pattern to display the first image:
```js
src={Array.isArray(device.img) ? device.img[0] : device.img}
```
Do NOT prepend `process.env.REACT_APP_API_URL` — images already include the full path.

## AI Chat (Store page)
A floating AI assistant button (bottom-right, `AiChat` component) lets users describe what they need in natural language. It calls `POST /api/ai/search` (server uses `gpt-4o-mini`) which returns structured filters and applies them to the MobX `DeviceStore`. The OpenAI key must be set as `OPENAI_API_KEY` in the server `.env`. Filters applied: `search`, `minPrice`, `maxPrice`, `typeIds`, `brandIds`, `minRating`, `inStockOnly`, `onSaleOnly`. A "Clear filters" button resets everything the AI set.
