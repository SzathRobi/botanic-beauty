"use client";

import { Button } from "@/components/Button";
import {
  DialogTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import ServiceForm from "./ServiceForm";
import { DataTable } from "@/components/ui/DataTable";
import { TService } from "@prisma/client";
import { columns } from "./serviceColumns";
import { useState } from "react";

interface ServiceTableProps {
  services: TService[];
}

const ServiceTable = ({ services }: ServiceTableProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">Szolgáltatás hozzáadása +</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Szolgáltatás</DialogTitle>
          </DialogHeader>

          <ServiceForm />
        </DialogContent>

        <DataTable data={services} columns={columns} />
      </Dialog>
    </div>
  );
};

export default ServiceTable;
