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
