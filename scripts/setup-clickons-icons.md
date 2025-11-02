# Setup Guide: Using Clickons Icons

## Quick Start

Yes, you can absolutely use Clickons icons throughout your app! Here's how:

## Step 1: Export Icons from Figma

1. Open the `Clickons.fig` file in Figma
2. For each icon you need:
   - Find the icon in Figma
   - Select it
   - Right-click → "Export Selection" or use the Export panel
   - Choose SVG format
   - Export to your project

## Step 2: Organize SVG Files

Create this directory structure and place your exported SVGs:

```
public/
  icons/
    clickons/
      stroke/
        dashboard.svg
        users.svg
        book.svg
        settings.svg
        ...
      fill/
        dashboard.svg
        users.svg
        ...
```

**Tip**: You can export multiple icons at once from Figma by selecting them all.

## Step 3: Use in Your Components

Once you have the SVG files, you can use them like this:

```tsx
import { ClickonsIcon } from "@/lib/icons"

// In your component
<ClickonsIcon name="dashboard" className="w-5 h-5" />
<ClickonsIcon name="users" variant="stroke" className="w-6 h-6" />
```

## Step 4: Replace Existing Icons (Optional)

You can gradually replace Akar icons with Clickons. For example:

**Before (Akar icons):**
```tsx
const IconDashboard = (props: any) => <Icon icon="akar-icons:dashboard" {...props} />
```

**After (Clickons):**
```tsx
import { ClickonsIcon } from "@/lib/icons"
const IconDashboard = (props: any) => <ClickonsIcon name="dashboard" {...props} />
```

Or use the wrapper:
```tsx
import { ClickonsIconWrapper } from "@/components/clickons-icon-wrapper"
const IconDashboard = (props: any) => <ClickonsIconWrapper icon="dashboard" {...props} />
```

## Icon Naming

Make sure your SVG file names match what you use in the `name` prop:
- Use lowercase
- Use hyphens for spaces: `user-profile.svg` → `name="user-profile"`
- Check `src/lib/icons.tsx` → `ClickonsIconMap` for common mappings

## Common Icons You'll Need

Based on your app, you'll likely need:
- dashboard
- users / people-group
- book
- chart-bar
- settings
- search
- plus
- edit
- trash
- check-circle
- building
- graduation-cap
- message
- logout

## Performance Tips

1. **Optimize SVGs**: Use tools like [SVGO](https://github.com/svg/svgo) to reduce file size
2. **Use stroke version**: Usually smaller file size than fill versions
3. **Lazy load**: Icons are loaded on-demand when components mount

## Alternative: Inline SVGs

If you prefer better performance, you can also:
1. Copy SVG content directly into React components
2. Create individual icon components like `IconDashboard.tsx`
3. Import them directly

This gives you better TypeScript support and tree-shaking.

