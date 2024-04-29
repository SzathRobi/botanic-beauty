import { services } from "../constants/services.constants";
import ServiceCard from "./ServiceCard";

type ServiceFormProps = {
  addChoosenService: (service: any) => void;
  removeChoosenService: (service: any) => void;
  choosenServices: any[];
};

const ServicesForm = ({
  addChoosenService,
  removeChoosenService,
  choosenServices,
}: ServiceFormProps) => {
  return (
    <div>
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
  );
};

export default ServicesForm;
