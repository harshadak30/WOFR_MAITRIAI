
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { useState, useEffect, useRef } from "react";

// const apps = [
//   {
//     name: "WOFR Lease Manager",
//     image: "/icons/lease.png",
//     left_image: "/background/carouselOne.png",
//   },
//   {
//     name: "WOFR ESOP Manager",
//     image: "/icons/esop.png",
//     left_image: "/background/carouselTwo.png",
//   },
//   {
//     name: "WOFR Consol TB Generator",
//     image: "/icons/tb.png",
//     left_image: "/background/carouselThree.png",
//   },
//   {
//     name: "WOFR EIR Calculator",
//     image: "/icons/eir.png",
//     left_image: "/background/carouselFour.png",
//   },
// ];

// export default function Carousel() {
//   // Create an extended array with duplicates to allow continuous scrolling
//   const extendedApps = [...apps, ...apps, ...apps];
//   const [currentIndex, setCurrentIndex] = useState(apps.length); // Start in the middle set
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const [phoneImage, setPhoneImage] = useState(apps[0].left_image);
//   const carouselRef = useRef(null);

//   // Calculate the active app index in the original array
//   const activeAppIndex = currentIndex % apps.length;

//   // Update phone image when active app changes
//   useEffect(() => {
//     setPhoneImage(apps[activeAppIndex].left_image);
//   }, [activeAppIndex]);

//   // Function to handle next slide (FIXED)
//   const handleNext = () => {
//     if (isTransitioning) return;

//     setIsTransitioning(true);
//     const newIndex = currentIndex + 1;
//     setCurrentIndex(newIndex);

//     // If we're at the end of the extended array, reset after transition
//     if (newIndex >= extendedApps.length - apps.length) {
//       setTimeout(() => {
//         setCurrentIndex(apps.length); // Reset to middle set without animation
//         setIsTransitioning(false);
//       }, 500);
//     } else {
//       setTimeout(() => setIsTransitioning(false), 500);
//     }
//   };

//   // Function to handle previous slide (FIXED)
//   const handlePrev = () => {
//     if (isTransitioning) return;

//     setIsTransitioning(true);
//     const newIndex = currentIndex - 1;
//     setCurrentIndex(newIndex);

//     // If we're at the beginning of the extended array, reset after transition
//     if (newIndex < apps.length) {
//       setTimeout(() => {
//         setCurrentIndex(extendedApps.length - apps.length - 1); // Reset to middle set without animation
//         setIsTransitioning(false);
//       }, 500);
//     } else {
//       setTimeout(() => setIsTransitioning(false), 500);
//     }
//   };

//   // Auto-scroll effect
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (!isTransitioning) {
//         handleNext();
//       }
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [isTransitioning, currentIndex]);

//   // Mobile and tablet view
//   const mobileView = (
//     <div className="w-full px-4 md:hidden">
//       {/* Header Section */}
//       <div className="w-full mb-6">
//         <h1 className="text-2xl font-bold text-blue-900 text-center">
//           WOFR Apps
//         </h1>
//         <p className="text-sm text-gray-600 mt-1 text-center">
//           Lorem ipsum dolor sit amet consectetur. Gravida convallis neque
//           pulvinar turpis pharetra erat vulputate.
//         </p>
//       </div>

//       {/* Mobile Content Area */}
//       <div className="bg-teal-600 min-h-[400px] flex flex-col rounded-3xl relative overflow-hidden">
//         {/* Top section with image */}
//         <div className="w-full h-70 relative overflow-hidden">
//           <img
//             src={phoneImage}
//             alt="Mobile phone displaying WOFR app"
//             className="h-70 w-full object-cover transition-opacity duration-500 z-10 rounded-2xl"
//           />
//         </div>

//         {/* Bottom section with active card */}
//         <div className="flex-1 flex flex-col justify-center items-center py-8 px-4 relative z-10">
//           <div className="bg-white shadow-xl p-6 flex flex-col items-center rounded-xl mx-auto max-w-xs">
//             <div className="text-teal-500 mb-4">
//               <img
//                 className="w-16 h-16"
//                 src={apps[activeAppIndex].image}
//                 alt={apps[activeAppIndex].name}
//               />
//             </div>
//             <h2 className="text-blue-900 font-bold text-center text-xl">
//               {apps[activeAppIndex].name}
//             </h2>
//             <button className="border-2 border-teal-600 text-blue-800 mt-6 px-4 py-2 rounded-3xl 
//                            cursor-pointer hover:bg-teal-50 transition-colors">
//               KNOW MORE
//             </button>
//           </div>

//           {/* Navigation buttons */}
//           <div className="flex justify-center mt-6">
//             <button
//               onClick={handlePrev}
//               disabled={isTransitioning}
//               className="bg-white rounded-full p-2 mx-2 shadow-md hover:bg-gray-100 
//                      transition-colors cursor-pointer disabled:opacity-50"
//               aria-label="Previous app"
//             >
//               <ChevronLeft className="w-5 h-5 text-blue-900" />
//             </button>
//             <button
//               onClick={handleNext}
//               disabled={isTransitioning}
//               className="bg-white rounded-full p-2 mx-2 shadow-md hover:bg-gray-100 
//                      transition-colors cursor-pointer disabled:opacity-50"
//               aria-label="Next app"
//             >
//               <ChevronRight className="w-5 h-5 text-blue-900" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Desktop view with fixed navigation
//   const desktopView = (
//     <div className="w-full hidden md:block">
//       {/* Header Section */}
//       <div className="w-full mb-6">
//         <h1 className="text-3xl font-bold text-blue-900 text-center">
//           WOFR Apps
//         </h1>
//         <p className="text-gray-600 mt-1 text-center text-lg">
//           Lorem ipsum dolor sit amet consectetur. Gravida convallis neque
//           pulvinar turpis pharetra erat vulputate.
//         </p>
//       </div>

//       {/* Main Content Area with dark background */}
//       <div className="bg-teal-600 h-[650px] flex justify-between md:flex-row flex-col rounded-3xl relative overflow-hidden">
//         {/* Left section with phone image */}
//         <div className="w-full lg:w-1/3 md:w-2/5 h-[650px] relative overflow-hidden
//                  lg:rounded-l-3xl md:rounded-l-3xl">
//           <img
//             src={phoneImage}
//             alt="Mobile phone displaying WOFR app"
//             className="h-full w-full object-cover transition-opacity duration-500 z-10"
//           />
//         </div>
//         <div className="lg:h-100 lg:w-90 md:h-100 md:w-80 bg-white relative right-20 top-20 rounded-2xl"></div>

//         {/* Right section with dynamic cards */}
//         <div className="lg:w-3/4 md:w-3/4 flex flex-col justify-center lg:-ml-20 lg:-mr-50 md:-ml-35 md:-mr-32 relative lg:right-70 md:right-50 z-10">
//           <div className="relative lg:h-64 md:h-60 sm:h-80 overflow-hidden flex items-center">
//             <div
//               ref={carouselRef}
//               className="flex absolute transition-transform duration-500 ease-in-out"
//               style={{
//                 transform: `translateX(${-280 * (currentIndex - apps.length)}px)`,
//                 transition: isTransitioning ? "transform 0.5s ease-in-out" : "none",
//               }}
//             >
//               {extendedApps.map((app, index) => {
//                 const isActive = index === currentIndex;

//                 return (
//                   <div
//                     key={`${app.name}-${index}`}
//                     className="mx-4 relative right-15"
//                   >
//                     <div
//                       className={`bg-white relative right-50 shadow-2xl p-6 flex flex-col items-center rounded-xl transition-all duration-300 
//                         ${
//                           isActive
//                             ? "lg:h-52 md:h-45 w-70 shadow-2xl z-20"
//                             : "h-52 w-60"
//                         }`}
//                     >
//                       <div className="text-teal-500 mb-4">
//                         <img
//                           className="w-20 h-20"
//                           src={app.image}
//                           alt={app.name}
//                         />
//                       </div>

//                       <h2
//                         className={`text-blue-900 font-bold text-center ${
//                           isActive ? "text-xl" : "text-lg"
//                         }`}
//                       >
//                         {app.name}
//                       </h2>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Navigation buttons */}
//           <div className="flex lg:justify-center md:justify-end sm:justify-center mt-6">
//             <button
//               onClick={handlePrev}
//               disabled={isTransitioning}
//               className="bg-white rounded-full p-2 mx-2 shadow-md hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
//               aria-label="Previous app"
//             >
//               <ChevronLeft className="w-5 h-5 text-blue-900" />
//             </button>
//             <button
//               onClick={handleNext}
//               disabled={isTransitioning}
//               className="bg-white rounded-full p-2 mx-2 shadow-md hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
//               aria-label="Next app"
//             >
//               <ChevronRight className="w-5 h-5 text-blue-900" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       {mobileView}
//       {desktopView}
//     </>
//   );
// }

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const apps = [
  {
    name: "WOFR Lease Manager",
    image: "/icons/lease.png",
    left_image: "/background/carouselOne.png",
    // color: "from-blue-500 to-purple-600",
    // accent: "bg-gradient-to-r from-blue-400 to-purple-500"
  },
  {
    name: "WOFR ESOP Manager",
    image: "/icons/esop.png",
    left_image: "/background/carouselTwo.png",
    // color: "from-emerald-500 to-teal-600",
    // accent: "bg-gradient-to-r from-emerald-400 to-teal-500"
  },
  {
    name: "WOFR Consol TB Generator",
    image: "/icons/tb.png",
    left_image: "/background/carouselThree.png",
  //   color: "from-orange-500 to-red-600",
  //   accent: "bg-gradient-to-r from-orange-400 to-red-500"
   },
  {
    name: "WOFR EIR Calculator",
    image: "/icons/eir.png",
    left_image: "/background/carouselFour.png",
    // color: "from-indigo-500 to-blue-600",
    // accent: "bg-gradient-to-r from-indigo-400 to-blue-500"
  },
];

export default function Carousel() {
  const extendedApps = [...apps, ...apps, ...apps];
  const [currentIndex, setCurrentIndex] = useState(apps.length);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [phoneImage, setPhoneImage] = useState(apps[0].left_image);
  const [isContentAnimating, setIsContentAnimating] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const carouselRef = useRef(null);

  const activeAppIndex = currentIndex % apps.length;

  useEffect(() => {
    setPhoneImage(apps[activeAppIndex].left_image);
  }, [activeAppIndex]);

  const handleNext = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setIsContentAnimating(true);

    setTimeout(() => {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);

      if (newIndex >= extendedApps.length - apps.length) {
        setTimeout(() => {
          setCurrentIndex(apps.length);
          setTimeout(() => {
            setIsTransitioning(false);
            setIsContentAnimating(false);
          }, 50);
        }, 600);
      } else {
        setTimeout(() => {
          setIsTransitioning(false);
          setIsContentAnimating(false);
        }, 600);
      }
    }, 250);
  };

  const handlePrev = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setIsContentAnimating(true);

    setTimeout(() => {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);

      if (newIndex < apps.length) {
        setTimeout(() => {
          setCurrentIndex(extendedApps.length - apps.length - 1);
          setTimeout(() => {
            setIsTransitioning(false);
            setIsContentAnimating(false);
          }, 50);
        }, 600);
      } else {
        setTimeout(() => {
          setIsTransitioning(false);
          setIsContentAnimating(false);
        }, 600);
      }
    }, 250);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        handleNext();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isTransitioning, currentIndex]);

  // Mobile and tablet view with enhanced animations
  const mobileView = (
    <div className="w-full px-4 md:hidden">
      {/* Animated Header Section */}
      <div className="w-full mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-black  text-center mb-2">
          WOFR Apps
        </h1>
        <p className="text-sm text-gray-600 text-center opacity-80">
          Lorem ipsum dolor sit amet consectetur. Gravida convallis neque
          pulvinar turpis pharetra erat vulputate.
        </p>
      </div>

      {/* Enhanced Mobile Content Area */}
      <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-700 min-h-[450px] flex flex-col rounded-3xl relative overflow-hidden shadow-2xl">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Top section with image and floating elements */}
        <div className="w-full h-72 relative overflow-hidden">
          <img
            src={phoneImage}
            alt="Mobile phone displaying WOFR app"
            className="h-72 w-full object-cover transition-all duration-700 ease-out z-10 rounded-2xl transform hover:scale-105"
            style={{
              filter: 'brightness(1.1) contrast(1.1)',
              transform: isContentAnimating ? 'scale(0.95) rotateY(10deg)' : 'scale(1) rotateY(0deg)'
            }}
          />
          {/* Floating particles */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
          <div className="absolute top-12 right-8 w-1 h-1 bg-cyan-200/80 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-8 left-12 w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Bottom section with enhanced active card */}
        <div className="flex-1 flex flex-col justify-center items-center py-8 px-4 relative z-10">
          <div
            className={`bg-white/95 backdrop-blur-md shadow-2xl p-8 flex flex-col items-center rounded-2xl mx-auto max-w-xs transition-all duration-700 ease-out transform ${isContentAnimating
                ? 'opacity-0 scale-90 rotate-3 translate-y-8'
                : 'opacity-100 scale-100 rotate-0 translate-y-0'
              } hover:scale-105 hover:shadow-3xl`}
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            }}
          >
            {/* Enhanced icon with glow effect */}
            <div className={`relative mb-6 transition-all duration-700 ease-out ${isContentAnimating ? 'opacity-0 scale-75 rotate-180' : 'opacity-100 scale-100 rotate-0'
              }`}>
              <div className={`absolute inset-0  rounded-2xl blur-xl opacity-30 animate-pulse`}></div>
              <div className="relative bg-gradient-to-br from-white to-gray-50 p-4 rounded-2xl shadow-lg">
                <img
                  className="w-16 h-16 transition-transform duration-500 hover:scale-110 hover:rotate-12"
                  src={apps[activeAppIndex].image}
                  alt={apps[activeAppIndex].name}
                />
              </div>
            </div>

            <h2 className={`text-blue-900 font-bold text-center text-xl mb-6 transition-all duration-700 ease-out ${isContentAnimating ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'
              }`}>
              {apps[activeAppIndex].name}
            </h2>

            <button className={`${apps[activeAppIndex].accent} text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-110 hover:shadow-lg transform active:scale-95 ${isContentAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}>
              KNOW MORE
            </button>
          </div>

          {/* Enhanced Navigation buttons */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={handlePrev}
              disabled={isTransitioning}
              className="bg-white/90 backdrop-blur-md rounded-full p-3 shadow-xl hover:bg-white transition-all duration-300 cursor-pointer disabled:opacity-50 hover:scale-110 hover:shadow-2xl active:scale-95"
              aria-label="Previous app"
            >
              <ChevronLeft className="w-6 h-6 text-blue-900" />
            </button>
            <button
              onClick={handleNext}
              disabled={isTransitioning}
              className="bg-white/90 backdrop-blur-md rounded-full p-3 shadow-xl hover:bg-white transition-all duration-300 cursor-pointer disabled:opacity-50 hover:scale-110 hover:shadow-2xl active:scale-95"
              aria-label="Next app"
            >
              <ChevronRight className="w-6 h-6 text-blue-900" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced Desktop view with advanced animations
  const desktopView = (
    <div className="w-full hidden md:block">
      {/* Enhanced Header Section */}
      <div className="w-full mb-10 text-center">
        <h1 className="text-4xl font-bold text-black  mb-4">
          WOFR Apps
        </h1>
        <p className="text-gray-600 text-lg opacity-80 max-w-2xl mx-auto">
          Lorem ipsum dolor sit amet consectetur. Gravida convallis neque
          pulvinar turpis pharetra erat vulputate.
        </p>
      </div>

      {/* Enhanced Main Content Area */}
      <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-700 h-[650px] flex justify-between md:flex-row flex-col rounded-3xl relative overflow-hidden shadow-2xl">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-32 w-64 h-64 bg-cyan-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-32 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Left section with enhanced phone image */}
        <div className="w-full lg:w-1/3 md:w-2/5 h-[650px] relative overflow-hidden lg:rounded-l-3xl md:rounded-l-3xl">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
          <img
            src={phoneImage}
            alt="Mobile phone displaying WOFR app"
            className="h-full w-full object-cover transition-all duration-1000 ease-out z-0"
            style={{
              filter: 'brightness(1.1) contrast(1.1) saturate(1.1)',
              transform: isContentAnimating ? 'scale(0.95) rotateY(15deg)' : 'scale(1) rotateY(0deg)'
            }}
          />

        </div>

        {/* Enhanced Main display card */}
        <div className="lg:h-96 lg:w-80 md:h-96 md:w-72 bg-white/95 backdrop-blur-md relative right-20 top-20 rounded-3xl z-15 shadow-2xl flex flex-col items-center justify-center p-10 overflow-hidden">
          {/* Gradient background overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${apps[activeAppIndex].color} opacity-5 transition-all duration-1000`}></div>

          {/* Enhanced animated content container */}
          <div
            className={`relative z-10 transition-all duration-800 ease-in transform flex flex-col items-center ${isContentAnimating
                ? 'opacity-0 scale-90  translate-y-8'
                : 'opacity-100 scale-100 rotate-0 translate-y-0'
              }`}
          >
            {/* Enhanced icon with complex animation */}
            <div
              className={`relative mb-8 transition-all duration-1000 ease-out transform  ${isContentAnimating
                  ? 'opacity-0 translate-x-32 scale-50 rotate-0'
                  : 'opacity-100 translate-x-0 scale-100 rotate-0'
                }`}
              style={{ transitionDelay: isContentAnimating ? '0ms' : '200ms' }}
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 ${apps[activeAppIndex].accent} rounded-3xl blur-2xl opacity-40 animate-pulse scale-150`}></div>
              <div className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 p-6 rounded-3xl shadow-xl">
                <img
                  className="w-20 h-20 mx-auto transition-all duration-700 hover:scale-125 hover:rotate-12 drop-shadow-lg"
                  src={extendedApps[currentIndex].image}
                  alt={extendedApps[currentIndex].name}
                />
              </div>
            </div>

            {/* Enhanced title with stagger animation */}
            <h2
              className={`text-blue-900 font-bold text-center text-2xl mb-6 transition-all duration-1000 ease-out transform ${isContentAnimating
                  ? 'opacity-0 translate-x-32 scale-75'
                  : 'opacity-100 translate-x-0 scale-100'
                }`}
              style={{ transitionDelay: isContentAnimating ? '0ms' : '300ms' }}
            >
              {extendedApps[currentIndex].name}
            </h2>

            {/* Enhanced action button */}
            {/* <button
              className={`${apps[activeAppIndex].accent} text-white px-8 py-3 rounded-full font-semibold transition-all duration-700 ease-out transform hover:scale-110 hover:shadow-xl active:scale-95 ${isContentAnimating
                  ? 'opacity-0 translate-y-8 scale-75'
                  : 'opacity-100 translate-y-0 scale-100'
                }`}
              style={{ transitionDelay: isContentAnimating ? '0ms' : '400ms' }}
            >
              EXPLORE NOW
            </button> */}
          </div>
        </div>

        {/* Enhanced Right section with dynamic cards */}
        <div className="lg:w-3/4 md:w-3/4 flex flex-col justify-center lg:-ml-20 lg:-mr-50 md:-ml-35 md:-mr-32 relative lg:-right-0 md:right-50 z-10">
          <div className="relative lg:h-64 md:h-60 sm:h-80 overflow-hidden flex items-center">
            <div
              ref={carouselRef}
              className="flex absolute transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(${-280 * (currentIndex - apps.length)}px)`,
                transition: isTransitioning ? "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
              }}
            >
              {extendedApps.map((app, index) => {
                const isActive = index === currentIndex;
                const appIndex = index % apps.length;

                return (
                  <div
                    key={`${app.name}-${index}`}
                    className="mx-4 relative right-15"
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div
                      className={`bg-white/95 backdrop-blur-md relative right-50 shadow-2xl p-8 flex flex-col items-center rounded-2xl transition-all duration-700 ease-out transform
                        ${isActive
                          ? "lg:h-52 md:h-45 w-60 shadow-2xl z-20 scale-110 border-2 border-white/50"
                          : "lg:h-52 md:h-45 w-60 shadow-xl z-10 hover:scale-105 hover:shadow-2xl"
                        }
                        ${hoveredCard === index ? 'rotate-2 scale-105' : 'rotate-0'}
                      `}
                      style={{
                        background: isActive
                          ? `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)`
                          : 'rgba(255,255,255,0.95)'
                      }}
                    >
                      {/* Enhanced icon with transfer animation */}
                      <div
                        className={`relative mb-6 transition-all duration-800 ease-out ${isActive && isContentAnimating
                            ? 'opacity-20 scale-50 translate-y-4 rotate-45'
                            : 'opacity-100 scale-100 translate-y-0 rotate-0'
                          }`}
                      >
                        {/* Individual glow for each card */}
                        <div className={`absolute inset-0 ${apps[appIndex].accent} rounded-2xl blur-xl opacity-30 scale-125 transition-opacity duration-500 ${hoveredCard === index ? 'opacity-50' : ''}`}></div>
                        <div className="relative bg-gradient-to-br from-white to-gray-50 p-4 rounded-2xl shadow-lg">
                          <img
                            className={`w-16 h-16 transition-all duration-500 ${hoveredCard === index ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}`}
                            src={app.image}
                            alt={app.name}
                          />
                        </div>
                      </div>

                      {/* Enhanced title with transfer animation */}
                      <h2
                        className={`text-blue-900 font-bold text-center text-sm transition-all duration-800 ease-out ${isActive && isContentAnimating
                            ? 'opacity-20 translate-y-4 scale-75'
                            : 'opacity-100 translate-y-0 scale-100'
                          }`}
                      >
                        {app.name}
                      </h2>

                      {/* Hover effect indicator */}
                      <div className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-0.5 ${apps[appIndex].accent} rounded-full transition-all duration-300 ${hoveredCard === index ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enhanced Navigation buttons */}
          <div className="flex lg:justify-start md:justify-end sm:justify-center mt-8 space-x-4">
            <button
              onClick={handlePrev}
              disabled={isTransitioning}
              className="bg-white/90 backdrop-blur-md rounded-full p-3 shadow-xl hover:bg-white transition-all duration-300 cursor-pointer disabled:opacity-50 hover:scale-125 hover:shadow-2xl active:scale-95 hover:-rotate-12"
              aria-label="Previous app"
            >
              <ChevronLeft className="w-6 h-6 text-blue-900" />
            </button>
            <button
              onClick={handleNext}
              disabled={isTransitioning}
              className="bg-white/90 backdrop-blur-md rounded-full p-3 shadow-xl hover:bg-white transition-all duration-300 cursor-pointer disabled:opacity-50 hover:scale-125 hover:shadow-2xl active:scale-95 hover:rotate-12"
              aria-label="Next app"
            >
              <ChevronRight className="w-6 h-6 text-blue-900" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-8">
      {mobileView}
      {desktopView}
    </div>
  );
}