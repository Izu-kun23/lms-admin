"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  RowSelectionState,
  VisibilityState,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { Icon } from "@iconify/react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const IconChevronUp = (props: any) => <Icon icon="bx:chevron-up" {...props} />
const IconChevronDown = (props: any) => <Icon icon="bx:chevron-down" {...props} />
const IconChevronRight = (props: any) => <Icon icon="bx:chevron-right" {...props} />
const IconEdit = (props: any) => <Icon icon="bx:edit" {...props} />
const IconTrash = (props: any) => <Icon icon="bx:trash" {...props} />
const IconMore = (props: any) => <Icon icon="bx:dots-horizontal-rounded" {...props} />
const IconSearch = (props: any) => <Icon icon="bx:search" {...props} />
const IconCalendar = (props: any) => <Icon icon="bx:calendar" {...props} />
const IconGrid = (props: any) => <Icon icon="bx:grid-alt" {...props} />
const IconFilter = (props: any) => <Icon icon="bx:filter" {...props} />
const IconFile = (props: any) => <Icon icon="bx:file" {...props} />

interface EnhancedTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  title?: string
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  onBulkAction?: (action: string, selectedRows: TData[]) => void
  actionButtons?: React.ReactNode
  getRowId?: (row: TData) => string
  enableDateRange?: boolean
  dateRangeValue?: string
  onDateRangeChange?: (range: string) => void
  itemLabel?: string // e.g., "agreement" for "Showing X of Y agreement"
  defaultPageSize?: number
}

export function EnhancedTable<TData extends Record<string, any>>({
  data,
  columns,
  title,
  searchPlaceholder = "Search",
  onSearch,
  onBulkAction,
  actionButtons,
  getRowId,
  enableDateRange = false,
  dateRangeValue,
  onDateRangeChange,
  itemLabel = "entries",
  defaultPageSize = 8,
}: EnhancedTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [pageSize, setPageSize] = React.useState(defaultPageSize)
  const [goToPage, setGoToPage] = React.useState("")

  // Add checkbox column
  const checkboxColumn: ColumnDef<TData> = {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  }

  // Enhance columns with sortable headers
  const enhancedColumns = React.useMemo(() => {
    const cols = [checkboxColumn, ...columns.map((col) => ({
      ...col,
      header: typeof col.header === 'string' || typeof col.header === 'function' 
        ? ({ header: tableHeader }: any) => {
            if (typeof col.header === 'string') {
              const canSort = tableHeader.column.getCanSort()
              const sortDirection = tableHeader.column.getIsSorted()
              
              if (!canSort) {
                return <span>{col.header}</span>
              }

              return (
                <button
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                  onClick={tableHeader.column.getToggleSortingHandler()}
                >
                  <span>{col.header}</span>
                  <div className="flex flex-col">
                    <IconChevronUp
                      className={cn(
                        "h-3 w-3",
                        sortDirection === "asc" ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <IconChevronDown
                      className={cn(
                        "h-3 w-3 -mt-1",
                        sortDirection === "desc" ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                  </div>
                </button>
              )
            }
            return typeof col.header === 'function' 
              ? col.header({ header: tableHeader } as any)
              : col.header
          }
        : col.header,
      enableSorting: col.enableSorting !== false,
    }))]

    // Add actions column if not already present
    const hasActions = columns.some((col) => col.id === "actions")
    if (!hasActions) {
      cols.push({
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }: any) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <IconEdit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <IconTrash className="h-4 w-4" />
            </Button>
          </div>
        ),
        enableSorting: false,
      } as ColumnDef<TData>)
    }

    return cols
  }, [columns])

  const table = useReactTable({
    data,
    columns: enhancedColumns as ColumnDef<TData>[],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    enableRowSelection: true,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
      globalFilter,
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
    getRowId: getRowId || ((row) => (row as any).id?.toString() || Math.random().toString()),
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original)
  const totalEntries = table.getFilteredRowModel().rows.length
  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()
  const visibleEntries = table.getRowModel().rows.length

  React.useEffect(() => {
    table.setPageSize(pageSize)
  }, [pageSize, table])

  React.useEffect(() => {
    if (onSearch) {
      onSearch(globalFilter)
    }
  }, [globalFilter, onSearch])

  const handleGoToPage = () => {
    const pageNum = parseInt(goToPage)
    if (pageNum >= 1 && pageNum <= totalPages) {
      table.setPageIndex(pageNum - 1)
      setGoToPage("")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Title and Action Buttons */}
      {(title || actionButtons) && (
        <div className="flex items-center justify-between">
          {title && (
            <h1 className="text-3xl font-bold">{title}</h1>
          )}
          {actionButtons && <div className="flex items-center gap-2">{actionButtons}</div>}
        </div>
      )}

      {/* Filter/Search Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 rounded-lg border-border"
          />
        </div>

        {/* Date Range Picker */}
        {enableDateRange && (
          <div className="relative">
            <IconCalendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Select date range"
              value={dateRangeValue || ""}
              onChange={(e) => onDateRangeChange?.(e.target.value)}
              className="pl-9 w-[240px] rounded-lg border-border"
            />
          </div>
        )}

        {/* Rows per page */}
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => setPageSize(Number(value))}
        >
          <SelectTrigger className="w-[140px] rounded-lg border-border">
            <SelectValue placeholder="Show rows" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="8">Show 8 Rows</SelectItem>
            <SelectItem value="10">Show 10 Rows</SelectItem>
            <SelectItem value="20">Show 20 Rows</SelectItem>
            <SelectItem value="50">Show 50 Rows</SelectItem>
            <SelectItem value="100">Show 100 Rows</SelectItem>
          </SelectContent>
        </Select>

        {/* Manage Columns */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-lg">
              <IconGrid className="h-4 w-4 mr-2" />
              Manage Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filter Button */}
        <Button variant="outline" size="icon" className="rounded-lg">
          <IconFilter className="h-4 w-4" />
        </Button>

        {/* More Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-lg">
              <IconMore className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Export</DropdownMenuItem>
            <DropdownMenuItem>Import</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/30">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={enhancedColumns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        {/* Left: Showing X of Y */}
        <div className="text-sm text-muted-foreground">
          Showing {visibleEntries} of {totalEntries} {itemLabel}
        </div>

        {/* Center: Page Numbers */}
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
            const pageNum = i + 1
            const isActive = currentPage === pageNum

            return (
              <Button
                key={pageNum}
                variant={isActive ? "default" : "outline"}
                size="icon"
                onClick={() => table.setPageIndex(pageNum - 1)}
                className={cn(
                  "h-8 w-8 rounded-full",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                {pageNum}
              </Button>
            )
          })}
          {totalPages > 10 && (
            <>
              <span className="px-2 text-muted-foreground">...</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.setPageIndex(totalPages - 1)}
                className="h-8 w-8 rounded-full"
              >
                {totalPages}
              </Button>
            </>
          )}
          {totalPages > 1 && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 rounded-full ml-1"
            >
              <IconChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Right: Go to Page */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Go to page</span>
          <Input
            type="number"
            min={1}
            max={totalPages}
            value={goToPage}
            onChange={(e) => setGoToPage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleGoToPage()
              }
            }}
            className="w-16 h-8 rounded-lg border-border"
            placeholder={currentPage.toString()}
          />
        </div>
      </div>
    </div>
  )
}

// Status Badge component for colorful tags
export function StatusBadge({
  status,
  variant = "default",
}: {
  status: string
  variant?: "green" | "gray" | "purple" | "blue" | "orange" | "red" | "default"
}) {
  const variantStyles = {
    green: "bg-green-500 text-white border-green-500",
    gray: "bg-gray-100 text-gray-800 border-gray-200",
    purple: "bg-purple-500 text-white border-purple-500",
    blue: "bg-primary text-primary-foreground border-primary",
    orange: "bg-orange-500 text-white border-orange-500",
    red: "bg-red-500 text-white border-red-500",
    default: "bg-muted text-muted-foreground",
  }

  return (
    <Badge
      variant="outline"
      className={cn("rounded-full px-3 py-0.5 font-medium", variantStyles[variant])}
    >
      {status}
    </Badge>
  )
}
