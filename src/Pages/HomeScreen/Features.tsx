import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import icons from "../../../public/icons";
import backgroundImages from "../../../public/background";

export default function Features() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full">
      <div className="w">
        <div className="flex  max-w-screen-xl flex-col md:flex-row justify-between items-start px-2 sm:px-2 md:px-4 lg:px-6 mx-auto w-full mb-8 sm:mb-10 md:mb-14 lg:mb-16 mt-4 lg:mt-6 gap-4 md:gap-8">
          <div className="w-full md:w-2/5 mb-4 md:mb-0 ">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
              Why Use WOFR Apps?
            </h1>
          </div>
          <div className="w-full md:w-1/2 text-gray-600 text-base sm:text-lg">
            <p>
              WOFR apps are built to streamline your business operations,
              enhance productivity, and ensure compliance across all key
              functions. Whether you're managing teams, finances, or safety
              protocols, our apps provide seamless solutions tailored to your
              needs.
            </p>
          </div>
        </div>

        <div className="relative mb-16 p-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div
              className="rounded-2xl shadow-2xl shadow-dark p-8  md:pl-5 w-full md:w-1/3 h-100 flex flex-col justify-start items-start"
              style={{
                transform: isDesktop
                  ? "perspective(600px) rotateY(20deg)"
                  : "none",
              }}
            >
              <div className="text-purple-600 mb-6">
                <img src={icons.supportAgent} alt="Support Icon" />
              </div>

              <h3 className="text-2xl font-bold rounded-lg p-4 text-black mb-2 lg:text-3xl">
                Support System
              </h3>

              <p className="text-black rounded-lg p-4 text-sm leading-relaxed lg:text-xl">
             Reliable assistance to ensure smooth financial operations and user satisfaction.
              </p>
            </div>

            <div
              className="relative rounded-2xl shadow-xl w-full md:w-1/3 h-100 text-white flex flex-col items-center justify-center overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #00BCD4, #3F51B5, #673AB7)",
              }}
            >
              <img
                src={backgroundImages.cardHighlightOne}
                alt="rectangleimage"
                className="absolute top-0 left-0"
              />

              <img
                src={backgroundImages.cardHighlightTwo}
                alt="rectangleimage"
                className="absolute bottom-0 right-0"
              />

              <div className="w-20 h-20 flex items-center justify-center mb-6">
                <img
                  src={icons.accountBalanceWallet}
                  alt="Wallet Icon"
                  className="w-20 h-20"
                />
              </div>

              <h3 className="text-3xl font-bold mb-2 text-center md:text-xl lg:text-3xl">
                Financial Management
              </h3>
              <p className="text-white/90 text-lg  md:text-sm p-10 text-center w-90 lg:text-xl">
               Financial management module for accounting, invoicing, expense tracking, 
               budgeting, and financial reporting
              </p>
            </div>

            <div
              className="rounded-2xl shadow-2xl shadow-dark p-8 w-full md:w-1/3 h-100 flex flex-col justify-start items-end"
              style={{
                transform: isDesktop
                  ? "perspective(900px) rotateY(-25deg)"
                  : "none",
              }}
            >
              <div className="text-purple-600 mb-6">
                <img src={icons.adminPanelSettings} alt="Admin Icon" />
              </div>
              <h3 className="text-2xl font-bold rounded-lg p-4 text-black mb-2 lg:text-3xl">
                Safety Compliance
              </h3>

              <p className="text-black rounded-lg py-4 pl-22 md:pl-5 text-sm leading-relaxed lg:text-xl">
               Adhering to financial regulations and security standards for complete compliance.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-12 cursor-pointer">
          <Link
            to="/free-trial"
            className="bg-teal-500 hover:bg-blue-700 hover:pr-2 text-white font-medium py-3 px-8 rounded-md flex items-center gap-2 transition-all cursor-pointer"
          >
            Try WOFR Apps for Free
            <img src={icons.arrow} alt="Arrow Icon" className="pl-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}
