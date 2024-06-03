import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Schedules from "./components/Schedules";
import { getSchedule } from "@/actions/schedule";
import BackgroundBlur from "@/components/BackgroundBlur";

const AdminHairdresserSchedulePage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/bejelentkezes");
  }

  const schedule = await getSchedule();

  return (
    <div className="w-full min-h-[calc(100vh-80px)] pt-14">
      <BackgroundBlur className="!max-w-fit mx-auto">
        <Schedules schedule={schedule} />
      </BackgroundBlur>
    </div>
  );
};

export default AdminHairdresserSchedulePage;
