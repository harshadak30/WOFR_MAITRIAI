import React from "react";

export const Badge: React.FC<{
    children: React.ReactNode;
    variant?: "blue" | "green" | "purple" | "orange" | "indigo" | "white";
    size?: "sm" | "md";
  }> = React.memo(({ children, variant = "blue", size = "sm" }) => {
    const variantClasses = {
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      purple: "bg-purple-100 text-purple-800",
      orange: "bg-orange-100 text-orange-800",
      indigo: "bg-indigo-100 text-indigo-800",
      white :"bg-white text-800"
    };
  
    const sizeClasses = {
      sm: "px-2.5 py-0.5 text-xs",
      md: "px-3 py-1 text-sm",
    };
  
    return (
      <span
        className={`inline-flex items-center rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]}`}
      >
        {children}
      </span>
    );
  });