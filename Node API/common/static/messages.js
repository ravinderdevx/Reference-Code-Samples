const MESSAGES = {};

MESSAGES.ERROR_MESSAGES = {
    INVALID_EMAIL: "Email is not valid",
    EMAIL_EXISTS: "Email already exists",
    PASSWORD_MINLENGTH: "Password length should be greater than equal to 8",
    PHONE_MINLENGTH: "Phone length should be 10 digit"
};

MESSAGES.SUCCESS_MESSAGES = {
    EMAIL_VERIFCATION: "Please verify your email. Email verification link is sent to your email.",
    ENROLL_MESSAGE: "Your enrollment request submitted successfully.",
    EMAIL_FORGOT_PASSWORD: "Reset Password link has been sent to email successfully.",
    EMAIL_VERIFIED: "Email verification successful. Please login",
    RESET_PASSWORD: "Password reset successfully",
    CONTACT_MESSAGE: "Thank you for contacting us. Your request has been submitted successfully."
};

module.exports = MESSAGES;