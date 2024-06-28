"use client";

import { formatDuration } from "@/lib/utils";
import { TService } from "@prisma/client";
import { ChangeEvent } from "react";
import { PiHairDryer, PiScissors } from "react-icons/pi";
import { IoColorPaletteOutline } from "react-icons/io5";
import ExtraServiceCard from "./ExtraServiceCard";

type ServiceCardProps = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  selectedTimeSlot: string | null;
  setSelectedTimeSlot: (time: string | null) => void;
  service: TService;
  index: number;
  selectService: (service: TService) => void;
  selectedService: TService | null;
  selectExtraService: (service: TService | null) => void;
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
  selectExtraService,
}: ServiceCardProps) => {
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

  const isSelected = selectedService?.name === service.name;

  return (
    <div
      className={`${
        isSelected ? "bg-green-600/30" : "bg-black/30"
      } mb-4 rounded-md transition-colors`}
    >
      <label
        key={index}
        className="cursor-pointer flex px-4 py-2 rounded-md items-center mb-2 gap-4"
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
          checked={isSelected}
          onChange={handleRadioChange}
          className="w-4 h-4 accent-green-600"
        />
      </label>

      {isSelected && service.category === "Festések" && (
        <ExtraServiceCard selectExtraService={selectExtraService} />
      )}
    </div>
  );
};

export default ServiceCard;
