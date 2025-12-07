import Swal from "sweetalert2";
import './toast.css'
const successAlert = (
  title = "Success!",
  subtitle = "Your action was completed successfully."
) => {
  return Swal.fire({
    title,
    text: subtitle,
    icon: "success",
    confirmButtonText: "OK",
    iconColor: "#22c55e", // soft green
    background: "#ffffff",
    color: "#334155", // secondary
    showCloseButton: false,
    buttonsStyling: false,
    width: 360,
    padding: "2.4rem 2.4rem 1.9rem",
    draggable: true,
    customClass: {
      popup: "scholar-swal-popup",
      title: "scholar-swal-title",
      htmlContainer: "scholar-swal-text",
      confirmButton: "scholar-swal-btn",
    },
  });
};

export default successAlert;
