# Clickons Icons Directory

## Structure

Place your exported Clickons SVG icons here:

```
clickons/
├── stroke/          # Stroke version icons
│   ├── dashboard.svg
│   ├── users.svg
│   └── ...
└── fill/            # Fill version icons
    ├── dashboard.svg
    ├── users.svg
    └── ...
```

## Exporting from Figma

1. Open `Clickons.fig` in Figma
2. For each icon:
   - Select the icon frame
   - Right-click → "Export Selection"
   - Choose SVG format
   - Name the file (use lowercase with hyphens: `user-profile.svg`)
   - Export to the appropriate folder (stroke or fill)

## SVG Optimization

Before adding to this directory, ensure your SVGs:
- Have proper viewBox attribute: `viewBox="0 0 24 24"`
- Are optimized (use tools like SVGO)
- Have consistent sizing
- Use `currentColor` for stroke/fill to allow CSS coloring

## Quick Export Script

If you have Node.js, you can use a script to batch export:

```bash
# Install svgo for optimization
npm install -g svgo

# Optimize all SVGs in a directory
svgo -f ./stroke -o ./stroke-optimized
```

