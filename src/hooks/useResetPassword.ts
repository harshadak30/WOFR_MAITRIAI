import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, UseFormReturn } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "../helper/axios";

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

interface UseResetPasswordReturn {
  showPassword: boolean;
  showConfirmPassword: boolean;
  isSubmitting: boolean;
  form: UseFormReturn<ResetPasswordFormData>;
  togglePasswordVisibility: () => void;
  toggleConfirmPasswordVisibility: () => void;
  showNotification: (message: string, isSuccess: boolean) => void;
  onSubmit: (data: ResetPasswordFormData, email: string) => Promise<void>;
}

export const useResetPassword = (): UseResetPasswordReturn => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ResetPasswordFormData>();

  const showNotification = (message: string, isSuccess: boolean) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      background: isSuccess ? "#f0fdf4" : "#fef2f2",
      iconColor: isSuccess ? "#22c55e" : "#ef4444",
      customClass: {
        popup: "w-auto text-sm px-4 py-2 shadow-md rounded-md",
        title: isSuccess
          ? "text-green-700 font-medium"
          : "text-red-700 font-medium",
      },
    });

    Toast.fire({
      icon: isSuccess ? "success" : "error",
      title: message,
    });
  };

  const onSubmit = async (data: ResetPasswordFormData, email: string) => {
    if (data.password !== data.confirmPassword) {
      return showNotification("Passwords do not match", false);
    }

    setIsSubmitting(true);

    try {
      await axios.post("/api/auth/v1/forgot-password", {
        email,
        new_password: data.password,
        confirm_password: data.confirmPassword,
      });

      showNotification("Password reset successfully", true);

      setTimeout(() => navigate("/login"), 1500);
    } catch (error: any) {
      console.error("Reset password error:", error);
      const errorMessage =
        error?.response?.data?.detail || "Failed to reset password";
      showNotification(errorMessage, false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  return {
    showPassword,
    showConfirmPassword,
    isSubmitting,
    form,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    showNotification,
    onSubmit,
  };
};
