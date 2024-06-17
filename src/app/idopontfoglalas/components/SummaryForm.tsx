import { Button } from "@/components/Button";
import { HOME_ROUTE } from "@/constants/routes.constants";
import { ContactInfo, Service } from "@prisma/client";
import { User, Scissors, Calendar } from "lucide-react";
import Link from "next/link";

type SummaryFormProps = {
  choosenServices: Service[];
  choosenHairdresser: "Timi" | "nem_Timi" | null;
  selectedDate: Date;
  selectedTimeSlot: string | null;
  contactInfo: ContactInfo;
};

const SummaryForm = ({
  choosenHairdresser,
  choosenServices,
  contactInfo,
  selectedDate,
  selectedTimeSlot,
}: SummaryFormProps) => {
  return (
    <div>
      <p className="text-2xl text-center mb-16">
        Az időpontodat sikeresen felvettük!
      </p>

      <div className="mb-24 flex flex-col md:flex-row items-start justify-evenly gap-8">
        <div className="flex gap-4">
          <Scissors size={48} className="min-w-10" />
          <div>
            <p>Szolgáltatások:</p>
            <div>
              {choosenServices.map((service) => (
                <p key={service.name} className="font-medium text-lg max-w-xs">
                  {service.name} ({service.duration} perc)
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <User size={48} className="min-w-10" />
          <div>
            <p>Fordrász:</p>
            <p className="font-medium text-lg">{choosenHairdresser}</p>
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
