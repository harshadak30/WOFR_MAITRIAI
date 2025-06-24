import React from "react";
import { Link } from "react-router-dom";
import backgroundImages from "../../../public/background";


const WofrLeaseIntro: React.FC = () => {
  return (
    <>
      <div className="w-full  flex items-center">
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          {/* Flex container with responsive layout */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16">
            {/* Left Section - Text Content */}
            <div className="w-full lg:w-1/2 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#0049AC] leading-tight">
                Streamline Your Lease Management with WOFR
              </h1>
             
              <p className="text-gray-600 mt-4 sm:mt-6 text-base sm:text-lg md:text-xl">
                Simplify property management, automate rent collection, and
                maintain complete oversight of your lease portfolio with our
                comprehensive lease management solution.
              </p>
             
              <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="bg-[#008F98] text-white px-5 py-3 rounded text-center font-medium hover:bg-[#007a82] transition-colors duration-300 flex justify-center items-center"
                >
                  Already user? Sign in
                </Link>
               
                <Link
                  to="/free-trial"
                  className="bg-white border border-gray-300 text-gray-700 px-5 py-3 rounded text-center font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors duration-300 flex justify-center items-center"
                >
                  Try WOFR Apps for Free
                </Link>
              </div>
            </div>
           
            {/* Right Section - Image */}
            <div className="w-full lg:w-1/2 flex justify-center items-center mt-8 lg:mt-0">
              <img
                src={backgroundImages.leaseIntroPage}
                alt="Lease Management Dashboard"
                className="w-full h-auto object-contain max-w-lg lg:max-w-xl xl:max-w-2xl"
                style={{
                  filter: "drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.1))",
                  maxHeight: "600px"
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


export default WofrLeaseIntro;
