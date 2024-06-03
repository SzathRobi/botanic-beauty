"use client";

import { formatDuration } from "@/lib/utils";
import { TService } from "@prisma/client";
import { format } from "date-fns";
import { ChangeEvent, useState } from "react";
import { BsScissors } from "react-icons/bs";
import { PiPaintBrushHouseholdFill } from "react-icons/pi";

type ServiceCardProps = {
  service: TService;
  index: number;
  addChoosenService: (service: TService) => void;
  removeChoosenService: (service: TService) => void;
  choosenServices: TService[];
};

const ICON_SIZE = 32;
const ServiceCard = ({
  service,
  index,
  addChoosenService,
  removeChoosenService,
  choosenServices,
}: ServiceCardProps) => {
  // const [isMainServiceChecked, setIsMainServiceChecked] = useState(false);
  const [isMainServiceChecked, setIsMainServiceChecked] = useState(
    choosenServices.some(
      (choosenService) => choosenService.name === service.name
    )
  );
  // const [isSubServiceChecked, setIsSubServiceChecked] = useState(false);

  const getServiceIcon = (name: string) => {
    if (name === "Hajvágás") {
      return <BsScissors size={ICON_SIZE} />;
    }

    return <PiPaintBrushHouseholdFill size={ICON_SIZE} />;
  };

  const handleMainCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      addChoosenService(service);
      setIsMainServiceChecked(true);
    } else {
      removeChoosenService(service);
      setIsMainServiceChecked(false);
    }
  };

  return (
    <div className="mb-4">
      <label
        key={index}
        className="cursor-pointer flex bg-black/30 px-4 py-2 rounded-md items-center mb-2 gap-4"
      >
        <div className="p-2 bg-green-600 rounded-full">
          {getServiceIcon(service.name)}
        </div>
        <div className="flex-1">
          <h3>{service.name}</h3>
          <p className="text-sm text-gray-400">
            {formatDuration(service.duration)}
          </p>
        </div>
        <input
          type="checkbox"
          checked={isMainServiceChecked}
          onChange={handleMainCheckboxChange}
          className="w-4 h-4 accent-green-600"
        />
      </label>
      {/* {isMainServiceChecked && service.extraServices.length > 0 && (
        <ul className="pl-16">
          {service.extraServices.map((extraService, index) => (
            <label
              key={index}
              className="cursor-pointer flex bg-black/30 px-4 py-2 rounded-md items-center mb-4 gap-4"
            >
              <div className="p-2 bg-green-600 rounded-full">
                {getServiceIcon(extraService.title)}
              </div>
              <div className="flex-1">
                <h3>{extraService.title}</h3>
                <p className="text-sm text-gray-400">
                  {extraService.duration} perc
                </p>
              </div>
              <input
                type="checkbox"
                checked={isSubServiceChecked}
                onChange={() => setIsSubServiceChecked(!isSubServiceChecked)}
                className="w-4 h-4 accent-green-600"
              />
            </label>
          ))}
        </ul>
      )} */}
    </div>
  );
};

export default ServiceCard;
