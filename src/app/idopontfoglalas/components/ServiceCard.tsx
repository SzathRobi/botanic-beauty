"use client";

import { formatDuration } from "@/lib/utils";
import { Service } from "@prisma/client";
import { ChangeEvent } from "react";
import { PiHairDryer, PiScissors } from "react-icons/pi";
import { IoColorPaletteOutline } from "react-icons/io5";

type ServiceCardProps = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  selectedTimeSlot: string | null;
  setSelectedTimeSlot: (time: string | null) => void;
  service: Service;
  index: number;
  selectService: (service: Service) => void;
  selectedService: Service | null;
};

const ICON_SIZE = 32;
const ServiceCard = ({
  selectedDate,
  setSelectedDate,
  selectedTimeSlot,
  setSelectedTimeSlot,
  service,
  index,
  selectService,
  selectedService,
}: ServiceCardProps) => {
  // const [isMainServiceChecked, setIsMainServiceChecked] = useState(false);

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      selectService(service);

      if (selectedDate || selectedTimeSlot) {
        setSelectedTimeSlot(null);
        setSelectedDate(new Date(Date.now()));
      }
    }
  };

  const geServiceIcon = (category: string) => {
    if (category === "Hajvágás") {
      return <PiScissors size={ICON_SIZE} />;
    }

    if (category === "Festések") {
      return <IoColorPaletteOutline size={ICON_SIZE} />;
    }

    return <PiHairDryer size={ICON_SIZE} />;
  };

  return (
    <div className="mb-4">
      <label
        key={index}
        className="cursor-pointer flex bg-black/30 px-4 py-2 rounded-md items-center mb-2 gap-4"
      >
        <div className="p-2 bg-green-600 rounded-full">
          {geServiceIcon(service.category)}
        </div>
        <div className="flex-1">
          <h3>{service.name}</h3>
          <p className="text-sm text-gray-400">
            {formatDuration(service.duration)}
          </p>
        </div>
        <input
          type="radio"
          name="service"
          checked={selectedService?.name === service.name}
          onChange={handleRadioChange}
          className="w-4 h-4 accent-green-600"
        />
      </label>
    </div>
  );
};

export default ServiceCard;
