"use client";

import { TService } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { formatDuration } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown";
import { Button } from "@/components/Button";
import {
  ArrowDown,
  ArrowUpDown,
  MoreHorizontal,
  Pen,
  Trash2,
} from "lucide-react";
import BackgroundBlur from "@/components/BackgroundBlur";

const deleteService = async (id: string) => {
  try {
    await fetch(`/api/services`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
  } catch (error) {
    console.log(error);
  }
};

export const columns: ColumnDef<TService>[] = [
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Menü megnyitása</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <BackgroundBlur className="!p-4">
              <DropdownMenuLabel>Műveletek</DropdownMenuLabel>
              {/* <DialogTrigger>
                <DropdownMenuItem className="flex justify-between gap-4">
                  <span>Módosítás</span> <Pen />
                </DropdownMenuItem>
              </DialogTrigger> */}
              <DropdownMenuItem
                className="flex justify-between gap-4"
                onClick={() => deleteService(row.original.id)}
              >
                <span>Törlés</span> <Trash2 />
              </DropdownMenuItem>
            </BackgroundBlur>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Név
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ár
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ cell }) => `${cell.renderValue()} Ft`,
  },
  {
    accessorKey: "duration",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Időtartam
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ cell }) => `${formatDuration(Number(cell.renderValue()))}`,
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kategória
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];
