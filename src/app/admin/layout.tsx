import { ReactNode } from "react";
import AdminNav from "./components/AdminNav";
import "react-day-picker/dist/style.css";

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="flex flex-row pt-20">
      <AdminNav />
      <div className="flex-1 px-8 pt-4">{children}</div>
    </div>
  );
};

export default AdminLayout;
