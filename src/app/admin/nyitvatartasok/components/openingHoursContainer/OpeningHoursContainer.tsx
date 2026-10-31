'use client'

import { OpeningHour, SpecialOpeningHour } from '@prisma/client'
import {
  CalendarCheck,
  CalendarCog,
  CalendarPlus,
  CalendarX,
  Clock,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

import ActionBar from '@/components/ui/ActionBar'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/AlertDialog'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { specialHoursCollection } from '@/components/ui/dataTable/collection-presets'
import {
  CollectionPagination,
  CollectionToolbar,
} from '@/components/ui/dataTable/CollectionControls'
import { useCollectionView } from '@/components/ui/dataTable/useCollectionView'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { SALON_API_SPECIAL_OPENING_HOURS_ROUTE } from '@/constants/routes.constants'
import { useIsMobile } from '@/hooks/use-mobile'

import { getI18nDay } from '../../utils/getI18nDay.util'
import OpeningHoursContainerMobile from '../openingHoursContainerMobile/openingHoursContainerMobile'
import OpeningHoursDialog from '../openingHoursDialog/OpeningHoursDialog'
import OpeningHoursModifySpecialOpeningHoursForm from '../openingHoursModifySpecialOpeningHoursForm/OpeningHoursModifySpecialOpeningHoursForm'
import OpeningHoursSpecialOpeningHoursForm from '../openingHoursSpecialOpeningHoursForm/OpeningHoursSpecialOpeningHoursForm'
import SpecialOpeningHoursContainerMobile from '../specialOpeningHoursContainerMobile/SpecialOpeningHoursContainerMobile'

type OpeningHoursContainerProps = {
  salonOpeningHours: OpeningHour[]
  salonSpecialOpeningHours: SpecialOpeningHour[]
  salonId: string
}

const OpeningHoursContainer = ({
  salonId,
  salonOpeningHours,
  salonSpecialOpeningHours,
}: OpeningHoursContainerProps) => {
  const isMobile = useIsMobile()

  const [openingHours, setOpeningHours] =
    useState<OpeningHour[]>(salonOpeningHours)
  const [specialOpeningHours, setSpecialOpeningHours] = useState<
    SpecialOpeningHour[]
  >(salonSpecialOpeningHours)
  const [isSpecialOpeningHoursFormOpen, setIsSpecialOpeningHoursFormOpen] =
    useState(false)
  const [
    isModifySpecialOpeningHoursFormOpen,
    setIsModifySpecialOpeningHoursFormOpen,
  ] = useState(false)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSpecialOpeningHour, setSelectedSpecialOpeningHour] =
    useState<SpecialOpeningHour | null>(null)

  const specialView = useCollectionView(
    specialOpeningHours,
    specialHoursCollection
  )

  const deleteSpecialOpeningHourByDate = async (date: Date) => {
    setIsDeleteLoading(true)

    const response = await fetch(
      `/api/${salonId}${SALON_API_SPECIAL_OPENING_HOURS_ROUTE}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date }),
      }
    )

    if (response.status === 403) {
      toast.error('Nincs jogosultsága')
      setIsDeleteLoading(false)
      return
    }

    if (!response.ok) {
      toast.error('Hiba történt a speciális nyitvatartás törlése során.')
      setIsDeleteLoading(false)
      return
    }

    setSpecialOpeningHours((prev) =>
      prev.filter((openingHour) => openingHour.date !== date)
    )
    setIsDeleteLoading(false)
    setIsDeleteDialogOpen(false)
    toast.success('A speciális nyitvatartás törlése sikeres')
  }

  return (
    <div>
      <Tabs defaultValue="nyitvatartas">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nyitvatartas">Nyitvatartás</TabsTrigger>
          <TabsTrigger value="specialis-nyitvatartas">
            Speciális nyitvatartás
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nyitvatartas">
          <ActionBar>
            <OpeningHoursDialog
              openingHours={openingHours}
              salonId={salonId}
              setOpeningHours={setOpeningHours}
            />
          </ActionBar>

          {isMobile ? (
            <OpeningHoursContainerMobile openingHours={openingHours} />
          ) : (
            <Table className="mb-8">
              <TableHeader>
                <TableRow>
                  <TableHead>Nap</TableHead>
                  <TableHead>Nyitási idő</TableHead>
                  <TableHead>Zárási idő</TableHead>
                  <TableHead className="text-right">Nyitva</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {openingHours.map((openingHour) => (
                  <TableRow key={openingHour.day}>
                    <TableCell className="font-medium">
                      {getI18nDay(openingHour.day)}
                      {/* {openingHour.day} */}
                    </TableCell>
                    <TableCell>{openingHour.openingHour}</TableCell>
                    <TableCell>{openingHour.closingHour}</TableCell>
                    <TableCell className="text-right">
                      {openingHour.isOpen ? (
                        <Badge>
                          <CalendarCheck className="mr-1" size={16} /> Nyitva
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <CalendarX className="mr-1" size={16} /> Zárva
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="specialis-nyitvatartas">
          <ActionBar>
            <Dialog
              open={isSpecialOpeningHoursFormOpen}
              onOpenChange={setIsSpecialOpeningHoursFormOpen}
            >
              <DialogTrigger asChild>
                <Button size={'sm'}>
                  <CalendarPlus className="mr-2" size={16} /> Speciális
                  nyitvatartás hozzáadása
                </Button>
              </DialogTrigger>

              <DialogContent className="dark max-w-3xl text-foreground">
                <DialogHeader>
                  <DialogTitle>Speciális nyitvatartás hozzáadása </DialogTitle>
                </DialogHeader>

                <OpeningHoursSpecialOpeningHoursForm
                  salonId={salonId}
                  setSpecialOpeningHours={setSpecialOpeningHours}
                  setIsSpecialOpeningHoursFormOpen={
                    setIsSpecialOpeningHoursFormOpen
                  }
                />
              </DialogContent>
            </Dialog>

            {specialOpeningHours.length > 0 && (
              <Dialog
                open={isModifySpecialOpeningHoursFormOpen}
                onOpenChange={setIsModifySpecialOpeningHoursFormOpen}
              >
                <DialogTrigger asChild>
                  <Button size={'sm'} variant="outline">
                    <CalendarCog className="mr-2" size={16} /> Speciális
                    nyitvatartás módosítása
                  </Button>
                </DialogTrigger>

                <DialogContent className="dark max-w-2xl text-foreground">
                  <DialogHeader>
                    <DialogTitle>
                      Speciális nyitvatartási idő módosítása
                    </DialogTitle>
                  </DialogHeader>

                  <OpeningHoursModifySpecialOpeningHoursForm
                    salonId={salonId}
                    specialOpeningHours={specialOpeningHours}
                    setIsModifySpecialOpeningHoursFormOpen={
                      setIsModifySpecialOpeningHoursFormOpen
                    }
                    setSpecialOpeningHours={setSpecialOpeningHours}
                  />
                </DialogContent>
              </Dialog>
            )}
          </ActionBar>

          <CollectionToolbar view={specialView} />
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            {isMobile ? (
              <SpecialOpeningHoursContainerMobile
                salonId={salonId}
                setSpecialOpeningHours={setSpecialOpeningHours}
                specialOpeningHours={specialView.rows}
                hasActiveFilters={specialView.hasFilters}
              />
            ) : (
              <Table className="mb-8">
                <TableHeader>
                  <TableRow>
                    <TableHead>Dátum</TableHead>
                    <TableHead>Nyitási idő</TableHead>
                    <TableHead>Zárási idő</TableHead>
                    <TableHead>Nyitva</TableHead>
                    <TableHead>Műveletek</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {specialView.count > 0 ? (
                    specialView.rows.map((openingHour) => (
                      <TableRow key={specialHoursCollection.getId(openingHour)}>
                        <TableCell className="font-medium">
                          {new Date(openingHour.date).toLocaleDateString(
                            'hu-HU'
                          )}
                        </TableCell>
                        <TableCell>{openingHour.openingHour}</TableCell>
                        <TableCell>{openingHour.closingHour}</TableCell>
                        <TableCell>
                          {openingHour.isOpen ? (
                            <Badge>
                              <CalendarCheck className="mr-1" size={16} />{' '}
                              Nyitva
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <CalendarX className="mr-1" size={16} /> Zárva
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="link"
                              onClick={() =>
                                setSelectedSpecialOpeningHour(openingHour)
                              }
                            >
                              <Trash2 className="text-destructive" size={16} />
                            </Button>
                          </AlertDialogTrigger>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        <div className="mx-auto flex w-full items-center justify-center gap-2 py-4">
                          <Clock className="size-16 text-muted-foreground md:size-20" />
                          <span className="text-xl">
                            {specialView.hasFilters
                              ? 'Nincs találat'
                              : 'Nincs speciális nyitvatartás'}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}

            <AlertDialogContent className="dark text-foreground">
              <AlertDialogHeader>
                <AlertDialogTitle>Teljesen biztos benne?</AlertDialogTitle>
                <AlertDialogDescription>
                  Ez a művelet nem visszafordítható! A speciális nyitvatartás
                  végleg törlésre kerül.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Mégse</AlertDialogCancel>
                <Button
                  variant="destructive"
                  isLoading={isDeleteLoading}
                  disabled={isDeleteLoading}
                  onClick={() =>
                    deleteSpecialOpeningHourByDate(
                      selectedSpecialOpeningHour!.date
                    )
                  }
                >
                  Törlés
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <CollectionPagination view={specialView} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default OpeningHoursContainer
