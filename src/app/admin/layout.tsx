import { ReactNode } from "react";
import AdminNav from "./components/AdminNav";
import "react-day-picker/dist/style.css";

type AdminLayoutProps = {
  children: ReactNode;
};

// TODO / highest: modify bookings
const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen flex gap-4 sm:gap-0 flex-col-reverse sm:flex-row pt-20">
      <AdminNav />
      <div className="flex-1 px-2 pt-4 lg:pt-16 2xl:pt-10">{children}</div>
    </div>
  );
};

export default AdminLayout;
