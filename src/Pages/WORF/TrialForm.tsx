import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const TrialForm: React.FC = () => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-2 text-center">
        Start your free trial
      </h2>
      <p className="text-gray-700 mb-8 text-center">
        Join thousands of companies growing with our platform
      </p>

      <form className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name Field */}
          <div className="relative">
            <label className="absolute -top-2.5 left-2 bg-white px-1 text-sm font-medium text-gray-700">
              First name
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Last Name Field */}
          <div className="relative">
            <label className="absolute -top-2.5 left-2 bg-white px-1 text-sm font-medium text-gray-700">
              Last name
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="relative">
          <label className="absolute -top-2.5 left-2 bg-white px-1 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Phone Number Field */}
        <div className="relative">
          <label className="absolute -top-2.5 left-2 bg-white px-1 text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Company Number Field */}
        <div className="relative">
          <label className="absolute -top-2.5 left-2 bg-white px-1 text-sm font-medium text-gray-700">
            Company Number
          </label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* App Name Field */}
        <div className="relative">
          <label className="absolute -top-2.5 left-2 bg-white px-1 text-sm font-medium text-gray-700">
            App Name (option)
          </label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="terms"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
            I agree to the{" "}
            <a href="#" className="text-blue-600 hover:underline">
              terms of use
            </a>
            ,{" "}
            <a href="#" className="text-blue-600 hover:underline">
              privacy notice
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              offer details
            </a>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="submit"
            className="flex justify-center items-center px-5 py-2 text-base bg-[#008F98] text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 min-w-[230px]"
          >
            Start 7-Day Free Trial
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
          <Link
            to="/register"
            type="button"
            className="flex justify-center items-center px-5 py-2 text-base border border-black text-black rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 min-w-[230px]"
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default TrialForm;
