import React from "react";
import { Link } from "react-router-dom";
import { FaCircleArrowRight } from "react-icons/fa6";
import {
  FaFileContract,
  FaUsers,
  FaTable,
  FaCalculator,
  FaBox,
  FaFileAlt,
  FaChartLine,
  FaFileInvoice,
  FaTasks,
} from "react-icons/fa";
import backgroundImages from "../../../public/background";

const appData = [
  {
    title: "Lease Manager",
    description:
      "Streamline lease management and compliance with automated solutions",
    icon: <FaFileContract />,
    path: "/wofr/lease-intro",
  },
  {
    title: "ESOP Manager",
    description: "Efficiently manage employee stock ownership programs",
    icon: <FaUsers />,
    path: "/",
  },
  {
    title: "Consol TB Generator",
    description: "Generate consolidated trial balances with ease",
    icon: <FaTable />,
    path: "/",
  },
  {
    title: "EIR Calculator",
    description: "Calculate effective interest rates accurately",
    icon: <FaCalculator />,
    path: "/",
  },
  {
    title: "Asset Manager",
    description: "Comprehensive asset management and tracking solution",
    icon: <FaBox />,
    path: "/",
  },
  {
    title: "Disclosure Maker",
    description: "Generate compliant financial disclosures automatically",
    icon: <FaFileAlt />,
    path: "/",
  },
  {
    title: "MIS Dashboard",
    description: "Create custom management information system dashboards",
    icon: <FaChartLine />,
    path: "/",
  },
  {
    title: "FS Preparer",
    description: "Streamline financial statement preparation process",
    icon: <FaFileInvoice />,
    path: "/",
  },
  {
    title: "Pre Accounting",
    description: "Simplify pre-accounting processes and workflows",
    icon: <FaTasks />,
    path: "/",
  },
];


const AppSolutions: React.FC = () => {
  return (
    <>
      <div className="w-full">
        {/* Hero Section with Responsive Spacing */}
        <section className="flex flex-col items-center justify-center px-4 py-8 md:py-12 lg:py-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#003061] mt-4">
            Explore Our App Solutions
          </h1>
         
          {/* Image with reduced vertical spacing on mobile */}
          <div className="my-6 md:my-8 lg:my-10 max-w-full">
            <img
              src={backgroundImages.moreToDiscoverBanner}
              alt="WOFR Apps"
              className="w-auto max-w-full h-auto"
              style={{ maxHeight: "40vh" }}
            />
          </div>
         
          <p className="text-gray-600 text-lg md:text-xl lg:text-2xl mt-4 lg:mt-6 max-w-3xl mx-auto text-center">
            Embark on a journey through the WOFR Apps Universe. Uncover
            powerful tools and intuitive interfaces crafted to enhance your
            daily tasks and connect you in new ways.
          </p>
        </section>


        {/* App Cards with better spacing */}
        <section className="px-4 sm:px-6 lg:px-8 xl:px-12 py-6 md:py-8 lg:py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-screen-xl mx-auto">
            {appData.map((app, index) => (
              <Link
                to={app.path}
                key={index}
                className="w-full h-full"
              >
                <div className="flex flex-col justify-between h-full p-4 md:p-5 bg-white rounded-lg shadow-md hover:shadow-lg border border-gray-100 hover:border-[#008F98] transition-all duration-300">
                  <div className="flex items-start">
                    <div className="bg-blue-50 p-2 rounded-lg mr-3 flex-shrink-0">
                      <div className="text-xl text-[#003061]">
                        {app.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-base md:text-lg text-[#003061] mb-1">
                        {app.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {app.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>


        {/* Call-to-Action Buttons with improved spacing */}
        <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-4 sm:space-y-0 py-6 md:py-8 lg:py-10 px-4 mt-2 md:mt-4 mb-8">
          <Link
            to="/login"
            className="flex items-center justify-center w-full sm:w-auto px-5 md:px-6 py-3 rounded text-white bg-[#008F98] hover:bg-[#007a82] transition-colors"
          >
            Already a user? Sign In
            <FaCircleArrowRight className="text-white rounded-full ml-2 text-lg p-1 w-6 h-6" />
          </Link>


          <Link
            to="/free-trial"
            className="flex items-center justify-center w-full sm:w-auto bg-[#008F98] text-white px-5 md:px-6 py-3 rounded hover:bg-[#007a82] transition-colors"
          >
            Try WOFR Apps for Free
            <FaCircleArrowRight className="text-white rounded-full ml-2 text-lg p-1 w-6 h-6" />
          </Link>
        </div>
      </div>
    </>
  );
};


export default AppSolutions;
