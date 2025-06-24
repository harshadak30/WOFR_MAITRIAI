import React from "react";
import { LuEyeClosed } from "react-icons/lu";
import { FaEye } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useResetPassword } from "../../hooks/useResetPassword";

// Move query helper outside to keep component clean
const useQuery = () => new URLSearchParams(useLocation().search);

const ResetPasswordModal: React.FC = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const email = query.get("email") || "";

  const {
    showPassword,
    showConfirmPassword,
    isSubmitting,
    form,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    onSubmit,
  } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = form;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
          onClick={() => navigate("/login")}
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4">Reset Your Password</h2>

        <form onSubmit={handleSubmit((data) => onSubmit(data, email))}>
          {/* Password */}
          <label className="block text-base font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              autoComplete="new-password"
              className={`w-full border p-2 rounded pr-10 focus:outline-none focus:ring-2 focus:ring-[#FC8503]/30 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              {...register("password", { required: "Password is required" })}
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-2.5 text-gray-500 cursor-pointer text-lg"
            >
              {showPassword ? <FaEye /> : <LuEyeClosed />}
            </span>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mb-2">
              {errors.password.message}
            </p>
          )}

          {/* Confirm Password */}
          <label className="block text-base font-medium text-gray-700 mb-1 mt-5">
            Confirm Password
          </label>
          <div className="relative mb-4">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              autoComplete="new-password"
              className={`w-full border p-2 rounded pr-10 focus:outline-none focus:ring-2 focus:ring-[#FC8503]/30 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              {...register("confirmPassword", {
                required: "Confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
            <span
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-3 top-2.5 text-gray-500 cursor-pointer text-lg"
            >
              {showConfirmPassword ? <FaEye /> : <LuEyeClosed />}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mb-4">
              {errors.confirmPassword.message}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
