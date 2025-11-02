# Enhanced Table Component Usage

The `EnhancedTable` component provides a clean, modern table layout matching the reference design, with white and blue (#228DE5) color scheme.

## Features

- ✅ Clean header with title on left, action buttons on right
- ✅ Comprehensive filter/search bar with:
  - Search input with icon
  - Date range picker (optional)
  - "Show X Rows" dropdown
  - "Manage Columns" button
  - Filter and more options buttons
- ✅ Sortable column headers with up/down arrows
- ✅ Row selection checkboxes
- ✅ Status badges with various colors (green, gray, purple, blue, orange, red)
- ✅ Action buttons (edit, delete) in rows
- ✅ Pagination with:
  - "Showing X of Y items" on left
  - Circular page number buttons (current page highlighted in blue)
  - "Go to page" input on right
- ✅ Rounded corners on all buttons and inputs

## Basic Usage

```tsx
import { EnhancedTable, StatusBadge } from "@/components/ui/enhanced-table"
import { ColumnDef } from "@tanstack/react-table"

interface Agreement {
  id: string
  name: string
  dateCreated: string
  role: string
  reporting: string
  assetClass: string
  document: string
}

const columns: ColumnDef<Agreement>[] = [
  {
    accessorKey: "name",
    header: "AGREEMENT NAME",
  },
  {
    accessorKey: "dateCreated",
    header: "DATE CREATED",
  },
  {
    accessorKey: "role",
    header: "ROLE",
  },
  {
    accessorKey: "reporting",
    header: "REPORTING",
  },
  {
    accessorKey: "assetClass",
    header: "ASSET CLASS",
    cell: ({ row }) => {
      const assetClass = row.getValue("assetClass") as string
      let variant: "green" | "gray" | "purple" | "blue" = "gray"
      
      if (assetClass === "All Asset") variant = "green"
      if (assetClass === "Uncategorized") variant = "gray"
      if (assetClass === "Legality Asset") variant = "purple"
      if (assetClass === "Subscription Asset") variant = "blue"
      
      return <StatusBadge status={assetClass} variant={variant} />
    },
  },
  {
    accessorKey: "document",
    header: "DOCUMENT",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <IconFile className="h-4 w-4 text-muted-foreground" />
        <span>{row.getValue("document")}</span>
      </div>
    ),
  },
]

export function AgreementsTable() {
  const data: Agreement[] = [
    {
      id: "1",
      name: "Promissory Note",
      dateCreated: "Feb 24th, 2023; 08:53 AM",
      role: "Lessee",
      reporting: "Yes",
      assetClass: "All Asset",
      document: "Agreement Document",
    },
    // ... more data
  ]

  return (
    <EnhancedTable
      data={data}
      columns={columns}
      title="Agreements"
      searchPlaceholder="Search Agreement"
      itemLabel="agreement"
      defaultPageSize={8}
      enableDateRange
      dateRangeValue="Feb 24th, 2023 - March 15, 2023"
      onDateRangeChange={(range) => console.log("Date range:", range)}
      actionButtons={
        <>
          <Button variant="outline" className="rounded-lg">Export All Data</Button>
          <Button className="rounded-lg bg-orange-500 hover:bg-orange-600">+ Add Agreement</Button>
        </>
      }
      onSearch={(query) => {
        console.log("Search:", query)
      }}
    />
  )
}
```

## Status Badge Colors

- `green`: Green background with white text
- `gray`: Gray background with dark gray text
- `purple`: Purple background with white text
- `blue`: Blue background (#228DE5) with white text
- `orange`: Orange background with white text
- `red`: Red background with white text
- `default`: Muted background

## Customization

The component automatically:
- Adds checkboxes to the first column
- Makes all string headers sortable with arrow indicators
- Adds an actions column if not provided (edit, delete)
- Handles pagination with blue highlighted current page
- Provides search functionality
- Manages column visibility

You can customize by:
- Providing custom `columns` with your own cell renderers
- Including an `actions` column in your columns definition to override the default
- Customizing `itemLabel` for pagination text (e.g., "agreement", "order", "user")
- Setting `defaultPageSize` for initial rows per page
- Enabling `enableDateRange` for date filtering
- Providing `actionButtons` for header actions
- Providing `onSearch` callback for custom search logic
