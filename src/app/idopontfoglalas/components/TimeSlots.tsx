'use client'

type TimeSlotsProps = {
  timeSlots: string[]
  selectedTimeSlot: string | null
  setSelectedTimeSlot: (timeSlot: string) => void
}

const TimeSlots = ({
  timeSlots,
  selectedTimeSlot,
  setSelectedTimeSlot,
}: TimeSlotsProps) => (
  <div>
    <div className="mb-2 h-6 opacity-0" />
    {timeSlots.length === 0 ? (
      <p role="status" className="max-w-sm p-4 text-center">
        Ezen a napon nincs elérhető időpont a kiválasztott szolgáltatáshoz.
        Kérlek válassz másik napot.
      </p>
    ) : (
      <div className="time-slots-container grid grid-cols-3 gap-4">
        {timeSlots.map((timeSlot) => (
          <button
            type="button"
            key={timeSlot}
            onClick={() => setSelectedTimeSlot(timeSlot)}
            className={
              'p-2 transition ' +
              (selectedTimeSlot === timeSlot
                ? 'bg-emerald-600/40'
                : 'bg-black/50')
            }
          >
            {timeSlot}
          </button>
        ))}
      </div>
    )}
  </div>
)

export default TimeSlots
