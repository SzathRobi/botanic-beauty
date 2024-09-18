"use client";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";

import { useState } from "react";
import { Button } from "../Button";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onDeleteSelectedRows?: (data: any) => Promise<void>;
}

export function DataTable<T>({
  data,
  columns,
  onDeleteSelectedRows,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  const selectedRowIndexes = Object.keys(rowSelection);
  const extendedRowSelectionData = data.filter((_, index) =>
    selectedRowIndexes.includes(index.toString())
  );

  const deleteAllSelectedRows = () => {
    setIsDeleteLoading(true);
    !!onDeleteSelectedRows &&
      onDeleteSelectedRows(extendedRowSelectionData)
        .then(() => {
          setRowSelection({});
        })
        .finally(() => {
          setIsDeleteLoading(false);
        });
  };

  return (
    <div>
      {!!onDeleteSelectedRows && (
        <Button
          isLoading={isDeleteLoading}
          variant="outline"
          onClick={deleteAllSelectedRows}
        >
          Delete selected rows
        </Button>
      )}

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
                  );
                })}
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
                  Nincsenek szolgáltatások
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
