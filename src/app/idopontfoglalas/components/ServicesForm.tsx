import { Button } from "@/components/Button";
import ServiceCard from "./ServiceCard";
import { Service } from "@prisma/client";
import { SERVICES } from "@/constants/services.constants";

type ServiceFormProps = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  selectedTimeSlot: string | null;
  setSelectedTimeSlot: (time: string | null) => void;
  selectService: (service: Service) => void;
  selectedService: Service | null;
  incrementActiveStep: () => void;
};

const ServicesForm = ({
  selectedDate,
  setSelectedDate,
  selectedTimeSlot,
  setSelectedTimeSlot,
  selectService,
  selectedService,
  incrementActiveStep,
}: ServiceFormProps) => {
  return (
    <div className="flex-1 flex flex-col">
      <div className="mb-12 flex-1">
        {SERVICES.map((service, index) => (
          <ServiceCard
            key={service.name}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTimeSlot={selectedTimeSlot}
            setSelectedTimeSlot={setSelectedTimeSlot}
            service={service}
            index={index}
            selectService={selectService}
            selectedService={selectedService}
          />
        ))}
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button disabled={!selectedService} onClick={incrementActiveStep}>
          Tovább
        </Button>
      </div>
    </div>
  );
};

export default ServicesForm;
