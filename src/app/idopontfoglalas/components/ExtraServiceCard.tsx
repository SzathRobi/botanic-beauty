"use client";

import { formatDuration } from "@/lib/utils";
import { TService } from "@prisma/client";
import { ChangeEvent, useState } from "react";
import { PiScissors } from "react-icons/pi";
import { EXTRA_SERVICE } from "@/constants/services.constants";

type ExtraServiceCardProps = {
  selectExtraService: (service: TService | null) => void;
};

const ICON_SIZE = 32;

const ExtraServiceCard = ({ selectExtraService }: ExtraServiceCardProps) => {
  const [isExtraServiceSelected, setIsExtraServiceSelected] = useState(false);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsExtraServiceSelected(event.target.checked);

    if (event.target.checked) {
      selectExtraService(EXTRA_SERVICE);
      return;
    }

    selectExtraService(null);
  };

  return (
    <div
      className={`${
        isExtraServiceSelected ? "bg-green-600/10" : "bg-black/30"
      } mb-4 rounded-md transition-colors`}
    >
      <label className="cursor-pointer flex px-4 pl-16 py-2 rounded-md items-center mb-2 gap-4">
        <div className="p-2 bg-green-600 rounded-full">
          <PiScissors size={ICON_SIZE / 2} />
        </div>
        <div className="flex-1">
          <h3>{EXTRA_SERVICE.name}</h3>
          <p className="text-sm text-gray-400">{formatDuration(30)}</p>
        </div>
        <input
          type="checkbox"
          checked={isExtraServiceSelected}
          onChange={handleCheckboxChange}
          className="w-4 h-4 accent-green-600"
        />
      </label>
    </div>
  );
};

export default ExtraServiceCard;
