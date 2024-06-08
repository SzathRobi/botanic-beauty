import { Button } from "@/components/Button";
import { services } from "../constants/services.constants";
import ServiceCard from "./ServiceCard";
import { TService } from "@prisma/client";

type ServiceFormProps = {
  activeStep: number;
  addChoosenService: (service: TService) => void;
  removeChoosenService: (service: TService) => void;
  choosenServices: TService[];
  incrementActiveStep: () => void;
  decrementActiveStep: () => void;
};

const ServicesForm = ({
  addChoosenService,
  removeChoosenService,
  choosenServices,
  incrementActiveStep,
}: ServiceFormProps) => {
  return (
    <div className="flex-1 flex flex-col">
      <div className="mb-12 flex-1">
        {services.map((service, index) => (
          <ServiceCard
            key={service.name}
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
          disabled={choosenServices.length === 0}
          onClick={incrementActiveStep}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ServicesForm;
