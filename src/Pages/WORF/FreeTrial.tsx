import React from "react";
import TrialForm from "./TrialForm";

const dashboardImage = "/background/freeTrialBanner.png";
const backgroundImage = "/background/arrowVector.png";

const FreeTrial: React.FC = () => {
  return (
    <>
      <div className="w-full bg-white">
        <div className="relative">
          {/* Background with adjusted height for better mobile experience */}
          <div
            className="absolute inset-0 h-[150px] sm:h-[180px] md:h-[200px] lg:h-[220px] bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundPosition: "center 20%",
            }}
          >
            <div className="absolute inset-0"></div>
          </div>

          {/* Content container with improved responsive padding */}
          <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-10 pb-8 sm:pb-10">
            {/* Title with better responsive text sizing */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 md:mb-10 lg:mb-12 text-black text-center animate-fade-in">
              Start a 7 day trial for free
            </h1>

            {/* Main content section with improved responsive layout */}
            <div className="flex flex-col-reverse lg:flex-row lg:items-start lg:justify-between mt-8 sm:mt-12 md:mt-16 lg:mt-20">
              {/* Form container with responsive width and spacing */}
              <div className="w-full sm:w-4/5 md:w-3/4 lg:w-2/5 mx-auto lg:mx-0 mt-8 lg:mt-0 animate-fade-in">
                <div className="lg:max-w-xl">
                  <TrialForm />
                </div>
              </div>

              {/* Image container with improved responsive sizing */}
              <div className="w-full lg:w-3/5 flex justify-center items-center mb-6 lg:mb-0">
                <img
                  src={dashboardImage}
                  alt="Dashboard preview"
                  className="w-full h-auto object-contain sm:items-center"
                  style={{
                    maxHeight: "500px",
                    maxWidth: "100%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FreeTrial;
