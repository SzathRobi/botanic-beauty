'use client'

import { TService } from '@prisma/client'
import { useState } from 'react'

import { Button } from '@/components/Button'
import { DataTable } from '@/components/ui/DataTable'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog'

import { columns } from './serviceColumns'
import ServiceForm from './ServiceForm'

interface ServiceTableProps {
  services: TService[]
}

const ServiceTable = ({ services }: ServiceTableProps) => {
  const [isOpen, setIsOpen] = useState(false)

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
  )
}

export default ServiceTable
