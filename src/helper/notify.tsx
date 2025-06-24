import Swal from "sweetalert2";

export const notify = (
  type: "success" | "error" | "warning" | "info",
  message: string
): void => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: type,
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      container: "swal-container",
      popup: "swal-popup-responsive",
    },
  });
};
