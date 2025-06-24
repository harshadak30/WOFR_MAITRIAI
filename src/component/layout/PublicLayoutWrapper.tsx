import { Outlet } from "react-router-dom";
import MainLayout from "./MainLayout";

const PublicLayoutWrapper = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

export default PublicLayoutWrapper;
