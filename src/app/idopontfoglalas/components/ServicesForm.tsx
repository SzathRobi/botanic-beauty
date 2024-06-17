import { Button } from "@/components/Button";
import ServiceCard from "./ServiceCard";
import { Service } from "@prisma/client";
import { SERVICES } from "@/constants/services.constants";

type ServiceFormProps = {
  activeStep: number;
  addChoosenService: (service: Service) => void;
  removeChoosenService: (service: Service) => void;
  choosenServices: Service[];
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
        {SERVICES.map((service, index) => (
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
          Tovább
        </Button>
      </div>
    </div>
  );
};

export default ServicesForm;
