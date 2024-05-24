"use client";

import Button from "@/components/Button";
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

      <div className="flex items-start justify-center gap-8">
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
        <Button
          type="button"
          className="disabled:cursor-not-allowed disabled:opacity-80 rounded text-green-600 px-4 py-2 font-bold hover:text-green-700 border border-green-600 hover:border-green-700"
          onClick={decrementActiveStep}
        >
          Previous
        </Button>
        <Button
          disabled={choosenHairdresser === null}
          className="disabled:cursor-not-allowed disabled:opacity-80 rounded bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700"
          onClick={incrementActiveStep}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default HairdresserForm;
