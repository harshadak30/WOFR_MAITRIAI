// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useForm, UseFormReturn } from "react-hook-form";
// import Swal from "sweetalert2";
// import axios from "../helper/axios";

// interface RegistrationFormData {
//   email: string;
//   name: string;
//   phoneNumber: string;
//   organization: string;
//   password: string;
//   confirmPassword: string;
// }

// interface UseRegisterReturn {
//   isVerifyingEmail: boolean;
//   isEmailVerified: boolean;
//   isOtpVerified: boolean;
//   isOtpModalVisible: boolean;
//   isPasswordVisible: boolean;
//   isConfirmPasswordVisible: boolean;
//   form: UseFormReturn<RegistrationFormData>;
//   setValue: UseFormReturn<RegistrationFormData>["setValue"];
//   verifyEmail: () => Promise<void>;
//   submitRegistration: () => Promise<void>;
//   onSubmit: (data: RegistrationFormData) => void;
//   handleRegistrationSubmit: () => void;
//   togglePasswordVisibility: () => void;
//   toggleConfirmPasswordVisibility: () => void;
//   displayNotification: (
//     type: "success" | "error" | "warning" | "info",
//     message: string
//   ) => void;
//   setIsOtpModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
//   setIsOtpVerified: React.Dispatch<React.SetStateAction<boolean>>;
// }

// export const useRegister = (): UseRegisterReturn => {
//   const navigate = useNavigate();

//   const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
//   const [isEmailVerified, setIsEmailVerified] = useState(false);
//   const [isOtpVerified, setIsOtpVerified] = useState(false);
//   const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
//   const [isPasswordVisible, setIsPasswordVisible] = useState(false);
//   const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

//   const form = useForm<RegistrationFormData>({
//     defaultValues: {
//       email: "",
//       name: "",
//       phoneNumber: "",
//       organization: "",
//       password: "",
//       confirmPassword: "",
//     },
//     mode: "onChange",
//   });

//   const Toast = Swal.mixin({
//     toast: true,
//     position: "top-end",
//     showConfirmButton: false,
//     timer: 3000,
//     timerProgressBar: true,
//     didOpen: (toast) => {
//       toast.addEventListener("mouseenter", Swal.stopTimer);
//       toast.addEventListener("mouseleave", Swal.resumeTimer);
//     },
//   });

//   const displayNotification = (
//     type: "success" | "error" | "warning" | "info",
//     message: string
//   ) => {
//     Toast.fire({ icon: type, title: message });
//   };

//   const verifyEmail = async () => {
//     const email = form.getValues("email");

//     if (!email) {
//       displayNotification("error", "Please enter a valid email first");
//       return;
//     }

//   const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.(com|org|net)$/i;
// if (!emailRegex.test(email)) {
//   displayNotification("error", "Email must end with .com, .org, or .net");
//   return;
// }

//     setIsVerifyingEmail(true);

//     try {
//       const response = await axios.post(
//         `/api/auth/v1/pre-register/email-verification?email=${encodeURIComponent(email)}`,
//         null,
//         { headers: { accept: "application/json" } }
//       );

//       setIsEmailVerified(true);
//       setIsOtpModalVisible(true);
//       displayNotification("success", response.data.msg || "OTP sent to your email");
//     } catch (error: any) {
//       const errorMessage =
//         error?.response?.data?.detail || "Failed to send OTP";
//       displayNotification("error", errorMessage);
//     } finally {
//       setIsVerifyingEmail(false);
//     }
//   };

//   const submitRegistration = async () => {
//     const formData = form.getValues();

//     const { email, name, phoneNumber, password, confirmPassword, organization } = formData;

//     if (!email || !name || !phoneNumber || !password) {
//       displayNotification("error", "Please fill all required fields");
//       return;
//     }

//     try {
//       const phoneWithCode = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`;

//       const formDataUrlEncoded = new URLSearchParams();
//       formDataUrlEncoded.append("user_name", name);
//       formDataUrlEncoded.append("user_email", email);
//       formDataUrlEncoded.append("phone", phoneWithCode);
//       formDataUrlEncoded.append("organization_name", organization || "");
//       formDataUrlEncoded.append("user_password", password);
//       formDataUrlEncoded.append("confirm_password", confirmPassword);

//       await axios.post(
//         "/api/auth/v1/register",
//         formDataUrlEncoded.toString(),
//         {
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//             accept: "application/json",
//           },
//         }
//       );

//       displayNotification("success", "Registration successful! You can now log in.");
//       setTimeout(() => navigate("/login"), 1000);
//     } catch (error: any) {
//       const errorMessage =
//         error?.response?.data?.detail ||
//         error?.response?.data?.message ||
//         "Registration failed";
//       displayNotification("error", errorMessage);
//     }
//   };

//   const onSubmit = () => {
//     if (!isEmailVerified) {
//       displayNotification("warning", "Please verify your email first");
//       return;
//     }

//     if (!isOtpVerified) {
//       displayNotification("warning", "Please verify OTP first");
//       return;
//     }

//     submitRegistration();
//   };

//   const handleRegistrationSubmit = () => {
//     form.handleSubmit(onSubmit)();
//   };

//   const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);
//   const toggleConfirmPasswordVisibility = () =>
//     setIsConfirmPasswordVisible((prev) => !prev);

//   return {
//     isVerifyingEmail,
//     isEmailVerified,
//     isOtpVerified,
//     isOtpModalVisible,
//     isPasswordVisible,
//     isConfirmPasswordVisible,
//     form,
//     setValue: form.setValue,
//     verifyEmail,
//     submitRegistration,
//     onSubmit,
//     handleRegistrationSubmit,
//     togglePasswordVisibility,
//     toggleConfirmPasswordVisibility,
//     displayNotification,
//     setIsOtpModalVisible,
//     setIsOtpVerified,
//   };
// };

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, UseFormReturn } from "react-hook-form";
import Swal from "sweetalert2";
import apiClient from "../helper/axios";

interface RegistrationFormData {
  email: string;
  name: string;
  phoneNumber: string;
  organization: string;
  password: string;
  confirmPassword: string;
}

interface UseRegisterReturn {
  isVerifyingEmail: boolean;
  isEmailVerified: boolean;
  isOtpVerified: boolean;
  isOtpModalVisible: boolean;
  isPasswordVisible: boolean;
  isConfirmPasswordVisible: boolean;
  emailError: string;
  registrationError: string;
  form: UseFormReturn<RegistrationFormData>;
  setValue: UseFormReturn<RegistrationFormData>["setValue"];
  verifyEmail: () => Promise<void>;
  submitRegistration: () => Promise<void>;
  onSubmit: (data: RegistrationFormData) => void;
  handleRegistrationSubmit: () => void;
  togglePasswordVisibility: () => void;
  toggleConfirmPasswordVisibility: () => void;
  displayNotification: (
    type: "success" | "error" | "warning" | "info",
    message: string
  ) => void;
  setIsOtpModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOtpVerified: React.Dispatch<React.SetStateAction<boolean>>;
  clearEmailError: () => void;
  clearRegistrationError: () => void;
}

export const useRegister = (): UseRegisterReturn => {
  const navigate = useNavigate();

  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  // Line 42-43: Added state for field-specific errors
  const [emailError, setEmailError] = useState("");
  const [registrationError, setRegistrationError] = useState("");

  const form = useForm<RegistrationFormData>({
    defaultValues: {
      email: "",
      name: "",
      phoneNumber: "",
      organization: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const displayNotification = (
    type: "success" | "error" | "warning" | "info",
    message: string
  ) => {
    Toast.fire({ icon: type, title: message });
  };

  // Line 71-73: Added clear error functions
  const clearEmailError = () => setEmailError("");
  const clearRegistrationError = () => setRegistrationError("");

  // const verifyEmail = async () => {
  //   const email = form.getValues("email");
    
  //   // Line 78: Clear previous email error
  //   setEmailError("");

  //   if (!email) {
  //     // Line 82: Set field-specific error instead of notification
  //     setEmailError("Please enter a valid email first");
  //     return;
  //   }

  //   const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.(com|org|net)$/i;
  //   if (!emailRegex.test(email)) {
  //     // Line 89: Set field-specific error instead of notification
  //     setEmailError("Email must end with .com, .org, or .net");
  //     return;
  //   }

  //   setIsVerifyingEmail(true);

  //   try {
  //     const response = await apiClient.post(
  //       `/api/auth/v1/pre-register/email-verification?email=${encodeURIComponent(email)}`,
  //       null,
  //       { headers: { accept: "application/json" } }
  //     );

  //     setIsEmailVerified(true);
  //     setIsOtpModalVisible(true);
  //     displayNotification("success", response.data.msg || "OTP sent to your email");
  //   } catch (error: any) {
  //     const errorMessage =
  //       error?.response?.data?.detail || "Failed to send OTP";
  //     // Line 105: Set field-specific error for email verification
  //     setEmailError(errorMessage);
  //   } finally {
  //     setIsVerifyingEmail(false);
  //   }
  // };
const verifyEmail = async () => {
  const email = form.getValues("email");
  setEmailError(""); // Clear any previous error

  if (!email) {
    setEmailError("Email is required");
    return;
  }

  setIsVerifyingEmail(true);

  try {
    const response = await apiClient.post(
      `/api/auth/v1/pre-register/email-verification?email=${encodeURIComponent(email)}`,
      null,
      { headers: { accept: "application/json" } }
    );

    setIsEmailVerified(true);
    setIsOtpModalVisible(true);
    displayNotification("success", response.data.msg || "OTP sent to your email");
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      "Failed to send OTP";
    setEmailError(errorMessage); // Display backend error under email input
  } finally {
    setIsVerifyingEmail(false);
  }
};

  const submitRegistration = async () => {
    const formData = form.getValues();
    
    // Line 114: Clear previous registration error
    setRegistrationError("");

    const { email, name, phoneNumber, password, confirmPassword, organization } = formData;

    if (!email || !name || !phoneNumber || !password) {
      // Line 120: Set general error instead of notification
      setRegistrationError("Please fill all required fields");
      return;
    }

    try {
      const phoneWithCode = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`;

      const formDataUrlEncoded = new URLSearchParams();
      formDataUrlEncoded.append("user_name", name);
      formDataUrlEncoded.append("user_email", email);
      formDataUrlEncoded.append("phone", phoneWithCode);
      formDataUrlEncoded.append("organization_name", organization || "");
      formDataUrlEncoded.append("user_password", password);
      formDataUrlEncoded.append("confirm_password", confirmPassword);

      await apiClient.post(
        "/api/auth/v1/register",
        formDataUrlEncoded.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            accept: "application/json",
          },
        }
      );

      displayNotification("success", "Registration successful! You can now log in.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Registration failed";
      // Line 149: Set general error instead of notification
      setRegistrationError(errorMessage);
    }
  };

  const onSubmit = () => {
    if (!isEmailVerified) {
      setRegistrationError("Please verify your email first");
      return;
    }

    if (!isOtpVerified) {
      setRegistrationError("Please verify OTP first");
      return;
    }

    submitRegistration();
  };

  const handleRegistrationSubmit = () => {
    form.handleSubmit(onSubmit)();
  };

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible((prev) => !prev);

  return {
    isVerifyingEmail,
    isEmailVerified,
    isOtpVerified,
    isOtpModalVisible,
    isPasswordVisible,
    isConfirmPasswordVisible,
    // Line 176-177: Return new error states and clear functions
    emailError,
    registrationError,
    form,
    setValue: form.setValue,
    verifyEmail,
    submitRegistration,
    onSubmit,
    handleRegistrationSubmit,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    displayNotification,
    setIsOtpModalVisible,
    setIsOtpVerified,
    clearEmailError,
    clearRegistrationError,
  };
};
