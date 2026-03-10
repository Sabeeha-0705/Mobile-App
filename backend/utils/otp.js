const otpGenerator = require('otp-generator');

/**
 * Generate a 6-digit OTP
 */
const generateOTP = () => {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true
  });
};

/**
 * Get OTP expiry time (default 10 minutes from now)
 */
const getOTPExpiry = (minutes = 10) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

module.exports = {
  generateOTP,
  getOTPExpiry
};
