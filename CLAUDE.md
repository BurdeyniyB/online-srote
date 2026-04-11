# Project Rules

## Language
All user-facing text in the client must be in English. If Ukrainian text is found in JSX (labels, buttons, placeholders, etc.), replace it with the English equivalent.

## Product Name Display
When displaying a product name, show only the part before the first comma. Example: `"Samsung Galaxy S24, 256GB"` → `"Samsung Galaxy S24"`. Use `name.split(',')[0]`.

## Device Images
The `img` field on a device is returned as an array of image filenames. To display the first image use `device.img[0]`.
