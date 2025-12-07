import Swal from "sweetalert2";

const errorToast = (error) => {
  const firebaseErrors = {
    // EMAIL/PASSWORD
    "auth/email-already-in-use": "This email is already registered.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/weak-password": "Password is too weak.",
    "auth/missing-password": "Password is required.",
    "auth/missing-email": "Email address is required.",
    "auth/operation-not-allowed": "Email/password accounts are disabled.",
    "auth/invalid-password": "Invalid password format.",

    // POPUP
    "auth/popup-closed-by-user": "Sign-in popup was closed.",
    "auth/popup-blocked": "Popup was blocked by your browser.",
    "auth/cancelled-popup-request": "Another popup was already open.",

    // CREDENTIAL / TOKEN
    "auth/invalid-credential": "Invalid authentication credentials.",
    "auth/credential-already-in-use": "This credential is already linked to another account.",
    "auth/account-exists-with-different-credential":
      "An account already exists with this email using a different sign-in method.",
    "auth/invalid-verification-code": "Invalid verification code.",
    "auth/invalid-verification-id": "Invalid verification ID.",
    "auth/expired-action-code": "The verification link has expired.",
    "auth/invalid-action-code": "Invalid or expired action code.",

    // NETWORK
    "auth/network-request-failed": "Network error. Please check your connection.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/internal-error": "Internal server error occurred.",
    "auth/quota-exceeded": "Firebase quota has been exceeded.",

    // PHONE AUTH
    "auth/missing-phone-number": "Phone number is required.",
    "auth/invalid-phone-number": "Invalid phone number format.",
    "auth/captcha-check-failed": "Captcha verification failed.",
    "auth/missing-app-credential": "Missing app verification credential.",
    "auth/app-not-authorized": "App is not authorized for phone authentication.",

    // MULTI-FACTOR
    "auth/multi-factor-auth-required": "Multi-factor authentication is required.",
    "auth/mfa-info-not-found": "Multi-factor information not found.",
    "auth/mfa-required": "Please complete multi-factor authentication.",
    "auth/missing-multi-factor-info": "Missing multi-factor information.",
    "auth/missing-multi-factor-session": "Missing multi-factor session.",
    "auth/invalid-multi-factor-session": "Invalid authentication session.",
    "auth/unsupported-first-factor": "This first factor is not supported.",
    "auth/unsupported-second-factor": "Unsupported second authentication factor.",

    // CUSTOM TOKEN
    "auth/invalid-custom-token": "Invalid custom token.",
    "auth/custom-token-mismatch": "Custom token does not belong to this project.",

    // APP ERRORS
    "auth/app-deleted": "Firebase app has been deleted.",
    "auth/app-not-authorized": "This app is not authorized.",
    "auth/invalid-api-key": "Invalid API key.",
    "auth/invalid-app-id": "Invalid Firebase APP ID.",
    "auth/project-not-found": "Firebase project was not found.",
  };

  const readableMessage =
    firebaseErrors[error?.code] ||
    error?.message ||
    "Something went wrong. Please try again.";

  return Swal.fire({
    title: "Error!",
    text: readableMessage,
    icon: "error",
    iconColor: "#e63946",
    background: "#ffffff",
    color: "#334155",
    confirmButtonText: "OK",
    buttonsStyling: false,
    width: 360,
    padding: "2.4rem 2.4rem 1.9rem",

    customClass: {
      popup: "scholar-error-popup",
      title: "scholar-error-title",
      htmlContainer: "scholar-error-text",
      confirmButton: "scholar-error-btn",
    },
  });
};

export default errorToast;
