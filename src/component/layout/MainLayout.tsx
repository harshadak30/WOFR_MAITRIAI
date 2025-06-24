import React, { ReactNode } from "react";
import Header from "../Shared/Header";
import Footer from "../Shared/Footer";


interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;
