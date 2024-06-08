"use client";

import { Button } from "@/components/Button";
import Image from "next/image";

type HairdresserFormProps = {
  choosenHairdresser: "Timi" | "nem_Timi" | null;
  chooseHairdresser: (hairdresser: "Timi" | "nem_Timi") => void;
  incrementActiveStep: () => void;
  decrementActiveStep: () => void;
};

const HairdresserForm = ({
  chooseHairdresser,
  choosenHairdresser,
  decrementActiveStep,
  incrementActiveStep,
}: HairdresserFormProps) => {
  return (
    <div>
      <p>Válassz fodrászt</p>

      <div className="mb-12 flex items-start justify-center gap-8">
        <label
          className={`${
            choosenHairdresser === "Timi" ? "border-2" : ""
          } p-2 cursor-pointer`}
        >
          <input
            type="radio"
            className="hidden"
            name="hairdresser"
            value="Timi"
            checked={choosenHairdresser === "Timi"}
            onChange={() => chooseHairdresser("Timi")}
          />
          <p>Timi</p>
          <Image
            src="/timi.png"
            alt="Timi"
            className="max-h-[240px] object-cover"
            width={240}
            height={240}
          />
        </label>

        <label
          className={`${
            choosenHairdresser === "nem_Timi" ? "border-2" : ""
          } p-2 cursor-pointer`}
        >
          <input
            type="radio"
            className="hidden"
            name="hairdresser"
            value="nem_Timi"
            checked={choosenHairdresser === "nem_Timi"}
            onChange={() => chooseHairdresser("nem_Timi")}
          />
          <p>nem_Timi</p>
          <Image
            src="/timi.png"
            alt="Timi"
            className="max-h-[240px] object-cover"
            width={240}
            height={240}
          />
        </label>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="secondary" onClick={decrementActiveStep}>
          Previous
        </Button>
        <Button
          disabled={choosenHairdresser === null}
          onClick={incrementActiveStep}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default HairdresserForm;
