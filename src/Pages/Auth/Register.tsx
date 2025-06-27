import React, { useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import backgroundImages from "../../../public/background";
import { useRegister } from "../../hooks/useRegistration";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import OTPVerificationPopup from "./OtpVerificationPopup";

interface RegistrationProps {
  email?: string;
}

const ErrorMessage = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-xs text-red-500">{message}</p> : null;

const Registration: React.FC<RegistrationProps> = () => {
  const {
    isVerifyingEmail,
    isEmailVerified,
    isOtpVerified,
    isOtpModalVisible,
    isPasswordVisible,
    isConfirmPasswordVisible,
    form,
    setValue,
    verifyEmail,
    handleRegistrationSubmit,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    setIsOtpModalVisible,
    setIsOtpVerified,
  } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = form;

  useEffect(() => {
    const img = new Image();
    img.src = "/background/landingHeroImage.png";
  }, []);

  useEffect(() => {
    register("phoneNumber", {
      required: "Phone number is required",
      pattern: {
        value: /^[+]?[0-9]{10,15}$/,
        message: "Please enter a valid phone number",
      },
    });
  }, [register]);

  const renderInput = (
    id: string,
    label: string,
    required: boolean,
    placeholder: string,
    error?: string,
    rest: any = {}
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        placeholder={placeholder}
        className={`w-full px-4 py-4 bg-gray-200 border ${
          error ? "border-red-500" : "border-gray-200"
        } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
        {...rest}
      />
      <ErrorMessage message={error} />
    </div>
  );

  const renderPasswordField = (
    id: "password" | "confirmPassword",
    label: string,
    isVisible: boolean,
    toggleVisibility: () => void,
    error?: string,
    validation?: any
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          type={isVisible ? "text" : "password"}
          id={id}
          placeholder="******"
          className={`w-full px-4 py-4 bg-gray-200 border ${
            error ? "border-red-500" : "border-gray-200"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
          {...register(id, validation)}
        />
        <button
          type="button"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
          onClick={toggleVisibility}
          aria-label={isVisible ? `Hide ${id}` : `Show ${id}`}
        >
          {isVisible ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      <ErrorMessage message={error} />
    </div>
  );

  return (
    <>
      <div
        className="bg-[url('/background/landingHeroImage.png')] bg-cover bg-center flex items-center justify-center px-4 "
        style={{
          backgroundImage: 'url("/background/landingHeroImage.png")',
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 sm:gap-8 w-full max-w-7xl px-4 sm:px-6 py-8 lg:py-12">
          {/* Left Section */}
          <div className="flex-1 flex flex-col items-center lg:items-start space-y-6 md:space-y-8 mb-6 lg:mb-0 w-full">
            <div className="w-full flex justify-center lg:justify-start">
              <img
                src={backgroundImages.companyLogo}
                alt="Logo"
                className="w-32 md:w-40 mb-2 md:mb-4"
                loading="eager"
              />
            </div>
            <h1 className="text-3xl md:text-4xl xl:text-5xl text-white font-bold text-center lg:text-left leading-tight">
              Secure Your Financial
              <br />
              Future Today
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-white leading-relaxed max-w-xl text-center lg:text-left">
              Access your portfolio, track investments, and manage your wealth with our advanced financial platform.
            </p>
          </div>

          {/* Right Section */}
          <div className="flex-1 w-full max-w-3xl">
            <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 lg:p-8 xl:p-10">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-800 text-center mb-6">
                Register Your Account
              </h2>

              <form onSubmit={handleSubmit(handleRegistrationSubmit)} className="space-y-6" noValidate>
                {/* Email Field with Verification */}
                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email ID <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                    <input
                      type="email"
                      id="email"
                      placeholder="example@gmail.com"
                      disabled={isEmailVerified}
                      className={`w-full px-4 py-4 bg-gray-200 border ${
                        errors.email ? "border-red-500" : "border-gray-200"
                      } ${
                        isEmailVerified
                          ? "rounded-t-md sm:rounded-l-md"
                          : "rounded-t-md sm:rounded-l-md"
                      } focus:outline-none focus:ring-2 focus:ring-teal-500`}
                      {...register("email", {
                        required: "Email is required",
                        // pattern: {
                        //   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.(com|org|net)$/i,
                        //   message: "Invalid email address",
                        // },
                      })}
                    />
                    <button
                      type="button"
                      onClick={verifyEmail}
                      disabled={isVerifyingEmail || isEmailVerified}
                      className={`px-4 py-2 sm:py-0 sm:w-2/5 w-full text-white ${
                        isEmailVerified
                          ? "bg-green-600"
                          : isVerifyingEmail
                          ? "bg-gray-500"
                          : "bg-teal-600 hover:bg-teal-700"
                      } ${
                        isEmailVerified
                          ? "rounded-b-md sm:rounded-r-md"
                          : "rounded-b-md sm:rounded-r-md"
                      } transition`}
                    >
                      {isVerifyingEmail
                        ? "Verifying..."
                        : isEmailVerified
                        ? "Verified"
                        : "Verify"}
                    </button>
                  </div>
                  <ErrorMessage message={errors.email?.message} />
                </div>

                {/* Name */}
                {renderInput("name", "Name", true, "Enter your name", errors.name?.message, {
                  ...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters long",
                    },
                  }),
                })}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full h-[72px]">
                      <PhoneInput
                        country="in"
                        value={getValues("phoneNumber")}
                        placeholder="Phone number"
                        onChange={(phone) => setValue("phoneNumber", phone)}
                        inputProps={{ name: "phoneNumber", required: true }}
                        inputClass={`w-full !bg-gray-200 !px-4 !py-4 !border ${
                          errors.phoneNumber ? "!border-red-500" : "!border-gray-200"
                        } !rounded-md !focus:outline-none`}
                        containerClass="w-full"
                        inputStyle={{ width: "100%", height: "110%" }}
                      />
                    </div>
                    <ErrorMessage message={errors.phoneNumber?.message} />

                    {/* Future implementation */}
                    {/* <PhoneInput
                      country={'in'}
                      value={''}
                      onChange={phone => console.log(phone)}
                      inputClass={`...`}
                      containerClass="w-full"
                      inputProps={{ name: 'phoneNumber', required: true }}
                    /> */}
                  </div>

                  {/* Organization */}
                  {renderInput("organization", "Organization", false, "xyz", "", {
                    ...register("organization"),
                  })}

                  {/* Password */}
                  {renderPasswordField(
                    "password",
                    "Password",
                    isPasswordVisible,
                    togglePasswordVisibility,
                    errors.password?.message,
                    {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters long",
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                        message:
                          "Password must contain uppercase, lowercase, number, and special character",
                      },
                    }
                  )}

                  {/* Confirm Password */}
                  {renderPasswordField(
                    "confirmPassword",
                    "Confirm Password",
                    isConfirmPasswordVisible,
                    toggleConfirmPasswordVisibility,
                    errors.confirmPassword?.message,
                    {
                      required: "Please confirm your password",
                      validate: (value: string) =>
                        value === getValues("password") || "Passwords do not match",
                    }
                  )}
                </div>

                {/* Submit */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className={`w-full sm:w-[70%] mx-auto block ${
                      isEmailVerified && isOtpVerified
                        ? "bg-teal-600 hover:bg-teal-700"
                        : "bg-gray-400"
                    } text-white font-medium py-2 px-6 rounded-md transition text-base sm:text-lg`}
                    disabled={!isEmailVerified || !isOtpVerified}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Verification */}
      <OTPVerificationPopup
        isOpen={isOtpModalVisible}
        onClose={() => setIsOtpModalVisible(false)}
        email={getValues("email")}
        onVerify={() => {
          setIsOtpVerified(true);
          setIsOtpModalVisible(false);
        }}
      />
    </>
  );
};

export default Registration;
