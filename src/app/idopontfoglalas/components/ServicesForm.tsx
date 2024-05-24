import Button from "@/components/Button";
import { services } from "../constants/services.constants";
import ServiceCard from "./ServiceCard";

type ServiceFormProps = {
  activeStep: number;
  addChoosenService: (service: any) => void;
  removeChoosenService: (service: any) => void;
  choosenServices: any[];
  incrementActiveStep: () => void;
  decrementActiveStep: () => void;
};

const ServicesForm = ({
  activeStep,
  addChoosenService,
  removeChoosenService,
  choosenServices,
  incrementActiveStep,
  decrementActiveStep,
}: ServiceFormProps) => {
  return (
    <div>
      <div className="mb-12">
        {services.map((service, index) => (
          <ServiceCard
            key={service.title}
            service={service}
            index={index}
            addChoosenService={addChoosenService}
            removeChoosenService={removeChoosenService}
            choosenServices={choosenServices}
          />
        ))}
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          disabled={activeStep === 0}
          className="disabled:cursor-not-allowed disabled:opacity-80 rounded text-green-600 px-4 py-2 font-bold hover:text-green-700 border border-green-600 hover:border-green-700"
          onClick={decrementActiveStep}
        >
          Previous
        </Button>
        <Button
          disabled={choosenServices.length === 0}
          className="disabled:cursor-not-allowed disabled:opacity-80 rounded bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700"
          onClick={incrementActiveStep}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ServicesForm;
