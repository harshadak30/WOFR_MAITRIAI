import React, { memo } from "react";
import backgroundImages from "../../../public/background";
import { useOTP } from "../../hooks/useOtp";

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerify: (otp: string) => void;
}

const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  isOpen,
  onClose,
  email,
  onVerify,
}) => {
  const {
    otpDigits,
    remainingTime,
    canResendOtp,
    otpInputRefs,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpResend,
    submitOtpVerification,
  } = useOTP(isOpen);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitOtpVerification(email, onVerify);
  };

  const handleResend = () => handleOtpResend(email);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 backdrop-blur-sm bg-black/10">
      <div className="relative w-full max-w-md p-4 sm:p-6 bg-white rounded-lg shadow-xl">
        <CloseButton onClose={onClose} />
        <ModalHeader email={email} />
        <OTPForm
          otpDigits={otpDigits}
          otpInputRefs={otpInputRefs}
          handleOtpChange={handleOtpChange}
          handleOtpKeyDown={handleOtpKeyDown}
          handleSubmit={handleSubmit}
        />
        <ResendOTPSection
          canResendOtp={canResendOtp}
          remainingTime={remainingTime}
          handleResend={handleResend}
        />
      </div>
    </div>
  );
};

const CloseButton = memo(({ onClose }: { onClose: () => void }) => (
  <button
    onClick={onClose}
    aria-label="Close"
    className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 sm:h-6 sm:w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
));

const ModalHeader = memo(({ email }: { email: string }) => (
  <div className="flex flex-col items-center mb-4 sm:mb-6">
    <div className="mb-3 sm:mb-4 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
      <img
        src={backgroundImages.otpVerification}
        alt="Email verification"
        className="w-16 h-16 sm:w-20 sm:h-20"
      />
    </div>
    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
      Email Verification
    </h2>
    <p className="mt-1 sm:mt-2 text-sm sm:text-base text-[#AAADB2] text-center">
      We have sent a verification code to
    </p>
    <p className="text-sm sm:text-base font-medium text-gray-800">{email}</p>
  </div>
));

interface OTPFormProps {
  otpDigits: string[];
  otpInputRefs: React.RefObject<HTMLInputElement | null>[];
  handleOtpChange: (index: number, value: string) => void;
  handleOtpKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const OTPForm = memo(
  ({
    otpDigits,
    otpInputRefs,
    handleOtpChange,
    handleOtpKeyDown,
    handleSubmit,
  }: OTPFormProps) => (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
        {otpDigits.map((digit, index) => (
          <input
            key={index}
            ref={otpInputRefs[index]}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
            aria-label={`OTP digit ${index + 1}`}
            className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        ))}
      </div>
      <button
        type="submit"
        className="w-full sm:w-1/2 block mx-auto bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl focus:outline-none transition duration-300 text-base sm:text-lg mb-3 sm:mb-4"
      >
        Submit
      </button>
    </form>
  )
);

interface ResendOTPSectionProps {
  canResendOtp: boolean;
  remainingTime: number;
  handleResend: () => void;
}

const ResendOTPSection = memo(
  ({ canResendOtp, remainingTime, handleResend }: ResendOTPSectionProps) => (
    <div className="text-center">
      <button
        onClick={handleResend}
        disabled={!canResendOtp}
        className={`text-[#3474fd] font-bold text-sm sm:text-base ${
          !canResendOtp ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Resend OTP
      </button>
      {!canResendOtp && (
        <p className="mt-1 text-xs sm:text-sm text-gray-500">
          Resend available in {remainingTime} seconds
        </p>
      )}
    </div>
  )
);

export default memo(OTPVerificationModal);
