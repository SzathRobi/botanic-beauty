"use client";

import Image from "next/image";

type HairdresserFormProps = {
  choosenHairdresser: "Timi" | "nem Timi" | null;
  chooseHairdresser: (hairdresser: "Timi" | "nem Timi") => void;
};

const HairdresserForm = ({
  chooseHairdresser,
  choosenHairdresser,
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
            choosenHairdresser === "nem Timi" ? "border-2" : ""
          } p-2 cursor-pointer`}
        >
          <input
            type="radio"
            className="hidden"
            name="hairdresser"
            value="nem Timi"
            checked={choosenHairdresser === "nem Timi"}
            onChange={() => chooseHairdresser("nem Timi")}
          />
          <p>nem Timi</p>
          <Image
            src="/timi.png"
            alt="Timi"
            className="max-h-[240px] object-cover"
            width={240}
            height={240}
          />
        </label>
      </div>
    </div>
  );
};

export default HairdresserForm;
