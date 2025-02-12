'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'

import { Button } from '../Button'
import { Input } from './Input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './Table'

interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  noDataText?: string
  onDeleteSelectedRows?: (data: any) => Promise<void>
}

export function DataTable<T>({
  data,
  columns,
  noDataText = 'Nincs adat',
  onDeleteSelectedRows,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      rowSelection,
      columnFilters,
    },
  })

  const selectedRowIndexes = Object.keys(rowSelection)
  const extendedRowSelectionData = data.filter((_, index) =>
    selectedRowIndexes.includes(index.toString())
  )

  const deleteAllSelectedRows = () => {
    setIsDeleteLoading(true)
    !!onDeleteSelectedRows &&
      onDeleteSelectedRows(extendedRowSelectionData)
        .then(() => {
          setRowSelection({})
        })
        .finally(() => {
          setIsDeleteLoading(false)
        })
  }

  return (
    <div>
      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder="Név kereső..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        {!!onDeleteSelectedRows && (
          <Button
            isLoading={isDeleteLoading}
            variant="outline"
            onClick={deleteAllSelectedRows}
          >
            Kiválasztott sorok törlése
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {noDataText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
