// import Swal from "sweetalert2";

// export const notify = (
//   type: "success" | "error" | "warning" | "info",
//   message: string
// ): void => {
//   Swal.fire({
//     toast: true,
//     position: "top-end",
//     icon: type,
//     title: message,
//     showConfirmButton: false,
//     timer: 3000,
//     timerProgressBar: true,
//     customClass: {
//       container: "swal-container",
//       popup: "swal-popup-responsive",
//     },
//   });
// };


import Swal from "sweetalert2";


export const notify = (
  type: "success" | "error" | "warning" | "info",
  message: string
) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    customClass: {
      container: 'z-[9999]',
    },
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });


  Toast.fire({
    icon: type,
    title: message,
  });
};

