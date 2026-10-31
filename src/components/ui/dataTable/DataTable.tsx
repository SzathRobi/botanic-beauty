'use client'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type OnChangeFn,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table'
import { Eye, Trash2, X } from 'lucide-react'
import { type ReactNode, useMemo, useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../AlertDialog'
import { Button } from '../Button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../DropdownMenu'
import {
  type CollectionConfig,
  selectedCollectionRows,
  type SortValue,
} from './collection-model'
import {
  CollectionEmpty,
  CollectionPagination,
  CollectionToolbar,
} from './CollectionControls'
import { DataTableColumnHeader } from './DataTableHeader'
import { useCollectionView } from './useCollectionView'
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  collection?: CollectionConfig<TData>
  hasPagination?: boolean
  hasColumnVisibility?: boolean
  columnVisibilityValueMap?: Record<string, string>
  hasRowSelection?: boolean
  emptyText?: string
  emptyIcon?: ReactNode
  onDeleteSelectedRows?: (data: TData[]) => Promise<void>
  hasSearch?: boolean
}
export function DataTable<TData, TValue>({
  columns,
  data,
  collection,
  hasPagination = true,
  hasColumnVisibility = false,
  columnVisibilityValueMap,
  hasRowSelection,
  emptyIcon,
  emptyText = 'Nincsenek megjeleníthető elemek',
  onDeleteSelectedRows,
  hasSearch = true,
}: DataTableProps<TData, TValue>) {
  const fallback = useMemo<CollectionConfig<TData>>(
    () => ({
      label: 'Lista',
      getId: (item) => {
        const row = item as { id?: unknown; name?: unknown }
        return String(row.id ?? row.name ?? JSON.stringify(item))
      },
      search: (item) =>
        Object.values(item as Record<string, unknown>).filter((value) =>
          ['string', 'number'].includes(typeof value)
        ),
      sorts: columns.flatMap((column) =>
        'accessorKey' in column
          ? [
              {
                id: String(column.accessorKey),
                label:
                  typeof column.header === 'string'
                    ? column.header
                    : String(column.accessorKey),
                value: (item: TData) =>
                  (item as Record<string, SortValue>)[
                    String(column.accessorKey)
                  ],
              },
            ]
          : []
      ),
    }),
    [columns]
  )
  const view = useCollectionView(data, collection || fallback, hasPagination)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false),
    [isDeleteLoading, setIsDeleteLoading] = useState(false),
    [deleteError, setDeleteError] = useState(''),
    [pendingIds, setPendingIds] = useState<string[]>([])
  const selectable = hasRowSelection ?? !!onDeleteSelectedRows
  const [sortId, direction] = view.state.sort.split(':')
  const sorting: SortingState = sortId
    ? [{ id: sortId, desc: direction === 'desc' }]
    : []
  const enriched = useMemo(
    () =>
      columns.map((column) => {
        const id =
          'id' in column && column.id
            ? column.id
            : 'accessorKey' in column
              ? String(column.accessorKey)
              : ''
        return {
          ...column,
          enableSorting: view.config.sorts.some((sort) => sort.id === id),
          ...(['select', 'actions'].includes(id)
            ? { enableHiding: false }
            : {}),
        }
      }),
    [columns, view.config.sorts]
  )
  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === 'function' ? updater(sorting) : updater
    view.dispatch({
      type: 'sort',
      value: next[0] ? next[0].id + ':' + (next[0].desc ? 'desc' : 'asc') : '',
    })
  }
  const table = useReactTable({
    data: view.rows,
    columns: enriched,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => view.config.getId(row),
    manualSorting: true,
    manualPagination: true,
    onSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: selectable,
    state: {
      sorting,
      columnVisibility: { ...columnVisibility, select: selectable },
      rowSelection,
    },
  })
  const selected = selectedCollectionRows(
    view.allRows,
    view.config.getId,
    rowSelection
  )
  const pending = data.filter((item) =>
    pendingIds.includes(view.config.getId(item))
  )
  const clearSelection = () => setRowSelection({})
  const remove = async () => {
    if (!onDeleteSelectedRows || !pending.length) return
    setIsDeleteLoading(true)
    setDeleteError('')
    try {
      await onDeleteSelectedRows(pending)
      clearSelection()
      setIsDeleteDialogOpen(false)
    } catch {
      setDeleteError('A törlés nem sikerült. Próbáld újra.')
    } finally {
      setIsDeleteLoading(false)
    }
  }
  return (
    <div>
      <CollectionToolbar
        view={view}
        hasSearch={hasSearch}
        onCriteriaChange={clearSelection}
        actions={
          hasColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                  <Eye size={15} className="mr-2" />
                  Oszlopok
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {columnVisibilityValueMap?.[column.id] ||
                        (typeof column.columnDef.header === 'string'
                          ? column.columnDef.header
                          : column.id)}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        }
      />
      {!!selected.length && !!onDeleteSelectedRows && (
        <div className="mb-3 flex flex-wrap items-center gap-3 rounded-lg border bg-muted/40 px-3 py-2">
          <span className="mr-auto text-xs font-medium">
            {selected.length} elem kijelölve az összes oldalról
          </span>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="gap-1"
            onClick={clearSelection}
          >
            <X size={14} />
            Kijelölés törlése
          </Button>
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={(open) => {
              if (isDeleteLoading) return
              setIsDeleteDialogOpen(open)
              if (open) {
                setPendingIds(selected.map(view.config.getId))
                setDeleteError('')
              }
            }}
          >
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="gap-1"
              >
                <Trash2 size={14} />
                Kijelöltek törlése
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {pending.length} elem törlése?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  A kijelölt elemek végleg eltávolításra kerülnek. A művelet nem
                  vonható vissza.
                </AlertDialogDescription>
              </AlertDialogHeader>
              {deleteError && (
                <p role="alert" className="text-sm text-destructive">
                  {deleteError}
                </p>
              )}
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleteLoading}>
                  Mégse
                </AlertDialogCancel>
                <Button
                  type="button"
                  variant="destructive"
                  isLoading={isDeleteLoading}
                  disabled={isDeleteLoading || !pending.length}
                  onClick={() => void remove()}
                >
                  Törlés
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
      {!view.count && data.length > 0 ? (
        <CollectionEmpty
          onClear={() => {
            clearSelection()
            view.dispatch({ type: 'clear' })
          }}
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {group.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      aria-sort={
                        header.column.getIsSorted() === 'asc'
                          ? 'ascending'
                          : header.column.getIsSorted() === 'desc'
                            ? 'descending'
                            : undefined
                      }
                    >
                      {!header.isPlaceholder &&
                        (typeof header.column.columnDef.header === 'string' ? (
                          <DataTableColumnHeader
                            column={header.column}
                            title={header.column.columnDef.header}
                          />
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                        ))}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? 'selected' : undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={Math.max(1, table.getVisibleLeafColumns().length)}
                  >
                    <div className="flex flex-col items-center justify-center gap-3 py-10 text-muted-foreground">
                      {emptyIcon}
                      <span className="text-sm">{emptyText}</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      {hasPagination && data.length > 0 && <CollectionPagination view={view} />}
    </div>
  )
}
