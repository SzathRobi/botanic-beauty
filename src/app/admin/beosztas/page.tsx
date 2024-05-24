import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Schedules from "./components/Schedules";
import { getSchedule } from "@/actions/schedule";

const AdminHairdresserSchedulePage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/bejelentkezes");
  }

  const schedule = await getSchedule();

  return (
    <div className="w-full min-h-screen pt-14">
      <Schedules schedule={schedule} />
    </div>
  );
};

export default AdminHairdresserSchedulePage;
