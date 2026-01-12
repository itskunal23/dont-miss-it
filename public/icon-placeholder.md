# PWA Icons Required

The manifest.json references these icons that need to be created:

- `/icon-192.png` (192x192 pixels)
- `/icon-512.png` (512x512 pixels)

## Quick Solution

1. **Generate icons online:**
   - Visit https://realfavicongenerator.net/
   - Upload a logo or create a simple icon
   - Download the generated icons
   - Place them in the `public/` folder

2. **Or create simple colored squares:**
   - Use any image editor
   - Create 192x192 and 512x512 PNG images
   - Use the brand color: #4F46E5 (indigo)
   - Add "DMI" or "Dont Miss It" text if desired

3. **Temporary fix:**
   - Remove icon references from manifest.json until icons are ready
   - The app will still work, just without PWA icons

## Icon Design Suggestions

- Background: #4F46E5 (indigo)
- Text/Icon: White or #86EFAC (mint green)
- Style: Minimal, clean, matches the calm aesthetic
