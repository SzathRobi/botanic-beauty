"use client";

import { useEffect } from "react";
import { steps } from "../constants/steps.constants";

type StepperProps = {
  activeStep: number;
};

const Stepper = ({ activeStep }: StepperProps) => {
  const activeColor = "text-green-600 dark:text-green-500";
  const inactiveColor = "text-gray-500 dark:text-gray-400";

  const activeBorderColor = "border-green-600 dark:border-green-500";
  const inactiveBorderColor = "border-gray-300 dark:border-gray-600";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeStep]);

  return (
    <div className="mb-24">
      <ol className="mb-4 items-start justify-center flex space-x-4 sm:space-x-6">
        {steps.map(({ title }, index) => (
          <li
            key={title}
            className={`flex items-center flex-col lg:flex-row gap-2 lg:gap-0 ${
              activeStep === index ? activeColor : inactiveColor
            } space-x-2.5 rtl:space-x-reverse`}
          >
            <span
              className={`${
                activeStep === index ? activeBorderColor : inactiveBorderColor
              } flex items-center justify-center w-8 h-8 border rounded-full shrink-0`}
            >
              {index + 1}
            </span>
            <span className="hidden sm:inline">
              <h3 className="font-medium leading-tight">{title}</h3>
              {/* <p className="text-sm">Step details here</p> */}
            </span>
          </li>
        ))}
      </ol>

      <div className="sm:hidden">
        <p className="text-center">{steps[activeStep].title}</p>
      </div>
    </div>
  );
};

export default Stepper;
