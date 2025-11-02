# Clickons Icons Integration Guide

## Overview

This guide explains how to integrate Clickons icons into your LMS Admin application.

## Prerequisites

- Clickons icons in Figma file format (you have `Clickons.fig`)
- Access to Figma to export SVG files

## Step 1: Export Icons from Figma

1. Open `Clickons.fig` in Figma
2. For each icon you want to use:
   - Select the icon (both fill and stroke versions if needed)
   - Right-click → "Copy as SVG" OR Export as SVG file
   - Save to: `/public/icons/clickons/stroke/` (for stroke versions)
   - Save to: `/public/icons/clickons/fill/` (for fill versions)

### Recommended Icon Export Structure:
```
public/
  icons/
    clickons/
      stroke/
        dashboard.svg
        users.svg
        book.svg
        ...
      fill/
        dashboard.svg
        users.svg
        book.svg
        ...
```

## Step 2: Icon Naming Convention

When exporting, name your SVG files to match the ClickonsIconMap in `src/lib/icons.tsx`. 

Common mappings:
- `users` → `users.svg`
- `people-group` → `users-group.svg`
- `book` → `book.svg`
- `dashboard` → `dashboard.svg`
- `settings` → `settings.svg`

## Step 3: Using Clickons Icons in Components

### Option A: Direct Usage
```tsx
import { ClickonsIcon } from "@/lib/icons"

function MyComponent() {
  return <ClickonsIcon name="dashboard" className="w-5 h-5" />
}
```

### Option B: Using the Wrapper (Recommended for Migration)
```tsx
import { ClickonsIconWrapper } from "@/components/clickons-icon-wrapper"

function MyComponent() {
  return <ClickonsIconWrapper icon="dashboard" className="w-5 h-5" />
}
```

### Option C: Create Icon Components
```tsx
import { createIconComponent } from "@/components/clickons-icon-wrapper"

const IconDashboard = createIconComponent("dashboard")

function MyComponent() {
  return <IconDashboard className="w-5 h-5" />
}
```

## Step 4: Replacing Akar Icons with Clickons

Since we currently use Akar icons via `@iconify/react`, you have two options:

### Option 1: Gradual Migration (Recommended)
Keep Akar icons and gradually replace with Clickons as you export them:

```tsx
// Before (Akar)
const IconDashboard = (props: any) => <Icon icon="akar-icons:dashboard" {...props} />

// After (Clickons)
import { createIconComponent } from "@/components/clickons-icon-wrapper"
const IconDashboard = createIconComponent("dashboard")
```

### Option 2: Complete Replacement
Replace all icon usages at once. Update all files that currently import icons.

## Step 5: Icon Mapping

Update `src/lib/icons.tsx` → `ClickonsIconMap` to map your icon aliases to actual Clickons icon file names.

Example:
```tsx
export const ClickonsIconMap: Record<string, string> = {
  dashboard: "dashboard", // Maps to dashboard.svg
  users: "users-group",    // Maps to users-group.svg
  // ... add more mappings
}
```

## Step 6: Batch Export Script (Optional)

If you have many icons, you can:
1. Use Figma's batch export feature
2. Or create a script to organize exported SVGs

## Notes

- **Fallback**: Currently, if a Clickons icon is not found, it will log a warning. You can implement Akar icons as fallback.
- **Performance**: Inline SVGs are loaded faster than external files. Consider converting to React components if needed.
- **Styling**: Clickons SVGs can be styled with CSS classes and props like any other SVG.

## Icon Checklist

Common icons needed for your LMS Admin app:
- [ ] dashboard
- [ ] users / people-group
- [ ] book / book-open
- [ ] chart-bar
- [ ] settings
- [ ] search
- [ ] plus
- [ ] edit / pencil
- [ ] trash
- [ ] check-circle
- [ ] cross-circle
- [ ] building / home
- [ ] activity
- [ ] graduation-cap
- [ ] message
- [ ] more-horizontal
- [ ] logout / sign-out

## Troubleshooting

1. **Icon not showing**: Check that the SVG file exists in the correct path
2. **Wrong icon displayed**: Verify the mapping in `ClickonsIconMap`
3. **Styling issues**: Ensure SVG has proper viewBox and preserveAspectRatio attributes

