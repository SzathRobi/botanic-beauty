"use client";

import { Button } from "@/components/Button";
import Image from "next/image";

type HairdresserFormProps = {
  selectedHairdresser: "Timi" | "nem_Timi" | null;
  selectHairdresser: (hairdresser: "Timi" | "nem_Timi") => void;
  incrementActiveStep: () => void;
  decrementActiveStep: () => void;
};

const HairdresserForm = ({
  selectHairdresser,
  selectedHairdresser,
  decrementActiveStep,
  incrementActiveStep,
}: HairdresserFormProps) => {
  return (
    <div>
      <p className="text-lg mb-8">Elérhető fodrászok</p>

      <div className="mb-12 flex items-start justify-center gap-8 w-full">
        <label
          className={`${
            selectedHairdresser === "Timi" ? "border-2" : ""
          } p-2 cursor-pointer w-full rounded-lg`}
        >
          <input
            type="radio"
            className="hidden"
            name="hairdresser"
            value="Timi"
            checked={selectedHairdresser === "Timi"}
            onChange={() => selectHairdresser("Timi")}
          />
          <div className="flex w-full items-center justify-start gap-8">
            <Image
              src="/timi.png"
              alt="Botanic Beauty fodrász: Timi"
              className="size-[120px] object-cover rounded-lg"
              width={120}
              height={120}
            />
            <p className="text-xl">Timi</p>
          </div>
        </label>

        {/* <label
          className={`${
            selectedHairdresser === "nem_Timi" ? "border-2" : ""
          } p-2 cursor-pointer`}
        >
          <input
            type="radio"
            className="hidden"
            name="hairdresser"
            value="nem_Timi"
            checked={selectedHairdresser === "nem_Timi"}
            onChange={() => selectHairdresser("nem_Timi")}
          />
          <p>nem_Timi</p>
          <Image
            src="/timi.png"
            alt="Timi"
            className="max-h-[240px] object-cover"
            width={240}
            height={240}
          />
        </label> */}
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="secondary" onClick={decrementActiveStep}>
          Vissza
        </Button>
        <Button
          disabled={selectedHairdresser === null}
          onClick={incrementActiveStep}
        >
          Tovább
        </Button>
      </div>
    </div>
  );
};

export default HairdresserForm;
