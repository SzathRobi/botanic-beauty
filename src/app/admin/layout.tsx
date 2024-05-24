import { ReactNode } from "react";
import AdminNav from "./components/AdminNav";
import "react-day-picker/dist/style.css";

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="flex flex-row">
      <AdminNav />
      <div className="flex-1 px-8">{children}</div>
    </div>
  );
};

export default AdminLayout;
