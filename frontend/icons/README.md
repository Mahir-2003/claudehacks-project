# Extension Icons

This folder should contain the extension icons in PNG format.

Required sizes:
- `icon16.png` - 16x16px (toolbar icon)
- `icon32.png` - 32x32px (Windows computers)
- `icon48.png` - 48x48px (extension management page)
- `icon128.png` - 128x128px (Chrome Web Store)

## Temporary Icons

For development, you can create simple placeholder icons or use UW-Madison branding colors:
- Primary Red: #C5050C
- Background: White

## Creating Icons

You can create these using:
1. **Online tool**: https://www.favicon-generator.org/
2. **Photoshop/Figma**: Design once, export at different sizes
3. **Command line** (if you have ImageMagick):
   ```bash
   convert -size 128x128 xc:#C5050C -fill white -gravity center -pointsize 72 -annotate +0+0 "B" icon128.png
   ```

For now, the extension will work but may show broken icon images until these are added.
