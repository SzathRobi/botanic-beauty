import { HOME_ROUTE } from "@/constants/routes.constants";
import { TService } from "@prisma/client";
import { User, Scissors, Calendar } from "lucide-react";
import Link from "next/link";
import { IoColorPaletteOutline } from "react-icons/io5";
import { PiHairDryer, PiScissors } from "react-icons/pi";

type SummaryFormProps = {
  selectedService: TService;
  selectedExtraService: TService | null;
  selectedHairdresser: "Timi" | "nem_Timi" | null;
  selectedDate: Date;
  selectedTimeSlot: string | null;
};

const ICON_SIZE = 48;

const SummaryForm = ({
  selectedHairdresser,
  selectedService,
  selectedExtraService,
  selectedDate,
  selectedTimeSlot,
}: SummaryFormProps) => {
  const geServiceIconByCategory = (category: string) => {
    if (category === "Hajvágás" || category === "extra") {
      return <PiScissors size={ICON_SIZE} className="min-w-10" />;
    }

    if (category === "Festések") {
      return <IoColorPaletteOutline size={ICON_SIZE} className="min-w-10" />;
    }

    return <PiHairDryer size={ICON_SIZE} className="min-w-10" />;
  };

  return (
    <div>
      <p className="text-2xl text-center mb-16">
        Az időpontodat sikeresen felvettük!
      </p>

      <div className="mb-24 flex flex-col md:flex-row items-start justify-evenly gap-8">
        <div>
          <div className="flex gap-4 mb-4">
            {geServiceIconByCategory(selectedService.category)}
            <div>
              <p>Szolgáltatás:</p>
              <p className="mb-2 font-medium text-lg max-w-xs">
                {selectedService.name} ({selectedService.duration} perc)
              </p>
            </div>
          </div>

          {selectedExtraService && (
            <div className="flex gap-4">
              {geServiceIconByCategory(selectedExtraService.category)}
              <div>
                <p>Extra Szolgáltatás:</p>
                <p className="mb-2 font-medium text-lg max-w-xs">
                  {selectedExtraService.name} ({selectedExtraService.duration}{" "}
                  perc)
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <User size={48} className="min-w-10" />
          <div>
            <p>Fordrász:</p>
            <p className="font-medium text-lg">{selectedHairdresser}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Calendar size={48} className="min-w-10" />
          <div>
            <p>Időpont:</p>
            <p className="font-medium text-lg">
              {selectedDate.toLocaleDateString()} {selectedTimeSlot}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 justify-center items-center mb-24">
        <p className="text-center">
          Email címedre kiküldtünk egy visszaigazoló levelet.
        </p>
        <p className="font-medium">
          Ha mégse lenne jó az időpont, kérlek időben jelezd ezen az
          elérhetőségen:
        </p>
        <p>+364206869</p>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Link href={HOME_ROUTE}>Vissza a főoldalra</Link>
      </div>
    </div>
  );
};

export default SummaryForm;
