"use client";

import { Button } from "@/components/Button";
import { DataTable } from "@/components/ui/DataTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { read, utils } from "xlsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown";
import { Input } from "@/components/ui/Input";
import { Customer } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, UserPlus, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/Checkbox";
import { DataTableColumnHeader } from "@/components/ui/DataTableHeader";
import CustomerForm from "./customerForm/CustomerForm";
import toast from "react-hot-toast";
import BackgroundBlur from "@/components/BackgroundBlur";

type CustomersContainerProps = {
  salonCustomers: Customer[];
};

const requiredHeaders = ["Név", "Email", "Telefonszám"];

const columns: (
  // eslint-disable-next-line no-unused-vars
  openCustomerForm: (customer: Customer) => void
) => ColumnDef<Customer>[] = (openCustomerForm) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Név" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Telefon" />
    ),
  },
  {
    accessorKey: "hairdressers",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fodrászok" />
    ),
  },
  {
    accessorKey: "Egyéb infó",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Egyéb infó" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => openCustomerForm(customer)}>
              Modify customer
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(customer.email)}
            >
              Copy customer email
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(customer.phone)}
            >
              Copy customer phone
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const CustomersContainer = ({ salonCustomers }: CustomersContainerProps) => {
  const [customers, setCustomers] = useState<Customer[]>(salonCustomers);
  const [excelHeadersError, setExcelHeadersError] = useState<string | null>(
    null
  );
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  const openCustomerForm = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsCustomerFormOpen(true);
  };

  const onDialogOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedCustomer(null);
    }

    setIsCustomerFormOpen(open);
  };

  const readExcel = (file?: File) => {
    if (!file) return;

    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target?.result;
        const wb = read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = utils.sheet_to_json(ws);

        // Ellenőrizze az oszlopfejléceket
        const headers = Object.keys(data[0] as any);
        const isValid = requiredHeaders.every((header) =>
          headers.includes(header)
        );

        if (!isValid) {
          setExcelHeadersError(
            `Hibás fejléc. Az elvárt oszlopnevek: ${requiredHeaders.join(", ")}`
          );
          return;
        }

        setExcelHeadersError(null);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise
      .then(async (excelData: any) => {
        if (!excelHeadersError) {
          const excelCustomers: Customer[] = excelData.map((row: any) => ({
            name: row["Név"],
            email: row["Email"],
            phone: row["Telefonszám"].toString(),
            otherInfo: row["Egyeb információ"],
            hairdressers: [],
          }));

          try {
            const response = await fetch(`/api/customers/excel-upload`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(excelCustomers),
            });

            if (!response.ok) {
              toast.error("Hiba történt az Excel fájl feldolgozása során.");
              return;
            }

            setCustomers((prevCustomers) => [
              ...prevCustomers,
              ...(excelCustomers as Customer[]),
            ]);
          } catch (error) {
            toast.error("Hiba történt az Excel fájl feldolgozása során.");
            return;
          }
        }
      })
      .catch(() => {
        toast.error("Hiba történt az Excel fájl feldolgozása során.");
      });
  };

  const deleteSelectedCustomers = async (customersToBeDeleted: Customer[]) => {
    const selectedCustomerEmails = customersToBeDeleted.map(
      (customerToBeDeleted) => customerToBeDeleted.email
    );

    const filteredCustomers = customers.filter(
      (customer) => !selectedCustomerEmails.includes(customer.email)
    );

    const response = await fetch("/api/customers", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedCustomerEmails),
    });

    if (!response.ok) {
      toast.error("Hiba történt a kijelzett ugyfelek feldolgozása során.");
      return;
    }

    setCustomers(filteredCustomers);
  };

  return (
    <div className="container">
      <Dialog
        open={!!excelHeadersError}
        onOpenChange={() => setExcelHeadersError(null)}
      >
        <DialogContent className="dark">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-start gap-2">
              <X className="size-8 text-destructive" /> Wrong excel column
              headers
            </DialogTitle>
            <DialogDescription>
              To help us process your data, please make sure your excel file has
              the correct column headers.
            </DialogDescription>
          </DialogHeader>

          <Image
            alt=""
            src="/excel-columns.jpg"
            width={720}
            height={506}
            className="rounded-md"
          />

          <DialogFooter>
            <Button
              className="w-full bg-primary"
              onClick={() => setExcelHeadersError(null)}
            >
              Ok
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCustomerFormOpen} onOpenChange={onDialogOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mb-8">
            Add customer
            <UserPlus className="ml-2 size-4 text-primary" />
          </Button>
        </DialogTrigger>
        <DialogContent className="dark">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-start gap-2">
              Add customer
            </DialogTitle>
            <DialogDescription>
              Add a new customer to your salon.
            </DialogDescription>
          </DialogHeader>

          <CustomerForm
            setCustomers={setCustomers}
            selectedCustomer={selectedCustomer}
            setIsCustomerFormOpen={setIsCustomerFormOpen}
          />
        </DialogContent>
      </Dialog>

      <BackgroundBlur className="!max-w-none !w-full">
        <Input
          type="file"
          className="mb-8 max-w-72 bg-primary text-primary-foreground file:text-primary-foreground"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          onChange={(e) => {
            const file = e.target.files?.[0];
            readExcel(file);
          }}
        />

        <DataTable
          columns={columns(openCustomerForm)}
          data={customers}
          onDeleteSelectedRows={deleteSelectedCustomers}
        />
      </BackgroundBlur>
    </div>
  );
};

export default CustomersContainer;
