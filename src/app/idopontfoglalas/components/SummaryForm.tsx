type SummaryFormProps = {
  choosenServices: any[];
  choosenHairdresser: "Timi" | "nem_Timi" | null;
  selectedDate: Date;
  selectedTimeSlot: string | null;
  contactInfo: any;
};

const SummaryForm = ({
  choosenHairdresser,
  choosenServices,
  contactInfo,
  selectedDate,
  selectedTimeSlot,
}: SummaryFormProps) => {
  return (
    <div>
      <p className="text-xl text-center mb-8">
        Az időpontodat sikeresen felvettük!
      </p>

      <div>
        <p className="font-medium">Szolgáltatások:</p>
        <div>
          {choosenServices.map((service) => (
            <p key={service.title}>
              {service.title} ({service.duration} perc)
            </p>
          ))}
        </div>
      </div>

      <div>
        <p className="font-medium">Fordrász:</p>
        <p>{choosenHairdresser}</p>
      </div>

      <div>
        <p className="font-medium">Időpont:</p>
        <p>
          {selectedDate.toLocaleDateString()} {selectedTimeSlot}
        </p>
      </div>

      <div>
        <p className="font-medium">Elérhetőség:</p>
        <p>{contactInfo.name}</p>
        <p>{contactInfo.email}</p>
        <p>{contactInfo.phone}</p>
        {contactInfo.otherInfo && <p>{contactInfo.otherInfo}</p>}
      </div>
    </div>
  );
};

export default SummaryForm;
