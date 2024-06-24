import { ReactNode } from "react";
import AdminNav from "./components/AdminNav";
import "react-day-picker/dist/style.css";

type AdminLayoutProps = {
  children: ReactNode;
};

// TODO / highest: modify and delete bookings
const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen flex gap-4 sm:gap-0 flex-col-reverse sm:flex-row pt-10">
      <AdminNav />
      <div className="flex-1 px-2">{children}</div>
    </div>
  );
};

export default AdminLayout;
