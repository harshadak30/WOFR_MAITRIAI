import React from "react";
import { Link } from "react-router-dom";
import backgroundImages from "../../../public/background";

export default function HeroSection() {
  return (
    <section className="px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 max-w-screen-2xl mx-auto">
      <div className="flex flex-col-reverse lg:flex-row items-center gap-6 sm:gap-8 md:gap-10">
        {/* Left Side: Text Content */}
        <div className="w-full lg:w-1/2 lg:pr-4 xl:pr-8 mt-6 sm:mt-8 lg:mt-0">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-blue-800 mb-3 sm:mb-4 md:mb-6 leading-tight lg:text-left text-center">
            Automate today, lead tomorrow: Where financial excellence meets
            efficiency
          </h1>
          <p className="text-gray-600 mb-6 sm:mb-8 md:mb-10 text-sm xs:text-base sm:text-lg w-full sm:w-[95%] md:w-[90%] lg:text-left text-center">
            Never at water me might. On formed merits hunted unable merely by mr
            whence or. Possession the unpleasing simplicity her uncommonly.
          </p>
          <div className="w-full flex lg:justify-start justify-center">
            <Link
              to="/free-trial"
              className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 sm:py-2.5 md:py-3 px-4 sm:px-5 md:px-6 rounded transition duration-300 text-sm sm:text-base"
            >
              Explore our Universe for free
            </Link>
          </div>
        </div>

        {/* Right Side: Image Content */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src={backgroundImages.landingBackgroundTwo}
            alt="Hero Visual"
            className="max-w-full h-auto object-contain"
            width="600"
            height="450"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}
