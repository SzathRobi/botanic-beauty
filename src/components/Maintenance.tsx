type MaintenanceProps = {
  text: string
}

const Maintenance = ({ text }: MaintenanceProps) => {
  return (
    <div className="absolute left-0 top-[4.5rem] flex w-full items-center justify-center bg-red-700 p-2">
      <p className="text-center text-white">{text}</p>
    </div>
  )
}

export default Maintenance
