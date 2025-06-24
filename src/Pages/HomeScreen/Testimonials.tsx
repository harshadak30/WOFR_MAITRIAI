import { motion } from "framer-motion";
import backgroundImages from "../../../public/background/index";
import icons from "../../../public/icons/index";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

export default function Testimonials() {
  const [flagVisible, setFlagVisible] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    setFlagVisible(true);

    const timer = setTimeout(() => {
      setHeaderVisible(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto px-1 sm:px-4 md:px-2 py-6">
      <header className="text-center mb-10">
        <h1 className="font-bold text-black-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mx-auto max-w-4xl">
          Experience Seamless Financial Management with WOFR
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Lease Management Section */}
        <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 md:p-10">
          <div className="flex items-start">
            <img
              src={icons.phone}
              alt="phone"
              className="w-10 h-10 md:w-14 md:h-14"
            />
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2 md:mb-3 mt-6 md:mt-8">
            Manage Leases with Ease
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-gray-400 mb-6 md:mb-8">
            Gain full control over lease agreements while ensuring compliance.
          </p>

          {/* Hover group - Visa Cards */}
          <div className="relative overflow-hidden cursor-pointer h-52 sm:h-64 md:h-72 lg:h-80">
            <div className="absolute inset-0 group">
              <img
                src={backgroundImages.visaCardFront}
                alt="visaCardFront"
                className="w-40 sm:w-48 md:w-52 lg:w-60 absolute left-1/3 sm:left-1/4 top-16 sm:top-20 md:top-24
                      transition-all duration-[1500ms] ease-out transform z-0
                      group-hover:-translate-y-24 sm:group-hover:-translate-y-32 md:group-hover:-translate-y-40 delay-150"
                style={{
                  transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              />
              <img
                src={backgroundImages.visaCardBack}
                alt="visaCardBack"
                className="w-40 sm:w-48 md:w-52 lg:w-60 absolute left-2/4 sm:left-2/4 top-6 sm:top-8 md:top-10
                      transition-all duration-[1500ms] ease-out transform z-10
                      group-hover:-translate-y-24 sm:group-hover:-translate-y-32 md:group-hover:-translate-y-40"
                style={{
                  transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              />
            </div>
          </div>
        </div>

        {/* ESOP Administration Section */}
        <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 md:p-10">
          <div className="flex items-start">
            <img
              src={icons.graph}
              alt="graph"
              className="w-10 h-10 md:w-14 md:h-14"
            />
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2 md:mb-3 mt-6 md:mt-8">
            Effortless ESOP Administration
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-gray-400 mb-6 md:mb-8">
            Simplify equity distribution and employee stock management.
          </p>
          <div className="relative h-52 sm:h-64 md:h-72 lg:h-80 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center group">
              <img
                src={backgroundImages.featureStepTwo}
                className="w-60 sm:w-64 md:w-72 lg:w-80 transition-all duration-[1500ms] ease-out
                        transform group-hover:translate-y-2 group-hover:translate-x-2"
                alt="featureStepTwo"
              />
              <img
                src={backgroundImages.featureStepOne}
                alt="featureStepOne"
                className="w-40 sm:w-48 md:w-56 lg:w-64 transition-all duration-[1500ms] ease-out
                        transform absolute top-1/3 left-2/3 -translate-x-1/2 -translate-y-1/2
                        group-hover:-translate-x-2 group-hover:translate-y-6"
                style={{
                  transitionTimingFunction: "cubic-bezier(0.74, 1.2, 0.84, 1)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Automated Trial Balance Section */}
      <div className="bg-gray-50 p-6 sm:p-8 md:p-10 rounded-3xl overflow-hidden mb-8">
        <img
          src={icons.dollarIcon}
          alt="Dollar Icon"
          className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 ml-0 sm:ml-4"
        />
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-2/5 lg:pr-4 mt-4 lg:mt-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold">
              Automated Trial Balance Consolidation
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 mt-3 lg:mt-5">
              Streamline financial reporting with accurate TB generation.
            </p>
          </div>

          <div className="w-full lg:w-3/5 relative mt-6 lg:mt-0">
            <img
              src={backgroundImages.mapBackground}
              alt="World map visualization"
              className="w-full h-auto object-cover"
            />

            {/* Mobile-friendly layout for flag and feature header */}
            <div className="flex flex-row justify-between absolute top-0 w-full px-2 sm:px-5">
              {/* Feature header with delayed animation */}
              <div
                className={`w-1/2 transform transition-all duration-700 ease-out ${
                  headerVisible
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-20 opacity-0"
                }`}
              >
                <img
                  src={backgroundImages.featureHeader}
                  alt="Feature Visualization"
                  className="w-4/5 transition-transform duration-300 hover:scale-110"
                />
              </div>

              {/* Flag image with animation */}
              <div
                className={`w-1/3 transform transition-all duration-700 ease-out ${
                  flagVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
              >
                <img
                  src={backgroundImages.flagIcon}
                  alt="Flag Icon"
                  className="w-4/5 h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Hold money in 30+ currencies */}
        <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 relative h-80 sm:h-96 overflow-hidden">
          <img
            src={icons.phone2}
            alt="Phone"
            className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 mb-4"
          />
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4">
            Hold money in 30+ currencies
          </h3>
          <img
            src={backgroundImages.mainBackground}
            alt="Currency Background"
            className="absolute bottom-0 left-0 w-full object-contain"
          />
        </div>

        {/* Subscriptions Section with Animation */}
        <motion.div
          className="bg-gray-50 rounded-3xl p-6 sm:p-8 relative h-80 sm:h-96 overflow-hidden"
          initial={{ y: 0 }}
          whileTap={{ y: -5 }}
        >
          <img
            src={icons.list}
            alt="List Icon"
            className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 mb-4 relative z-10"
          />

          <motion.div
            className="relative z-10"
            initial={{ y: 20 }}
            whileHover={{ y: -10 }}
          >
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
              Subscriptions you control in one place
            </h3>

            <motion.img
              src={backgroundImages.featureStepThree}
              alt="Subscription BG"
              className="absolute bottom-0 left-0 w-full z-0 object-contain"
              initial={{ bottom: "-200px" }}
              whileHover={{
                bottom: "-200px",
                y: -10,
              }}
            />
          </motion.div>
        </motion.div>

        {/* Check more features section */}
        <div className="bg-gray-50 rounded-3xl relative h-80 sm:h-96 overflow-hidden cursor-pointer">
          <img
            src={backgroundImages.featureStepFour}
            alt="Product Features"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-8">
            <h3 className="text-white text-xl sm:text-2xl lg:text-3xl font-semibold mb-4">
              Check our other product features
            </h3>
            <button className="bg-[#008F98] hover:bg-yellow-500 text-white px-4 py-2 rounded-full font-medium transition-transform duration-300 hover:scale-105 inline-flex items-center justify-center gap-2 w-36 sm:w-40">
              <span>View More</span>
              <ArrowRight size={18} className="inline-block" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
