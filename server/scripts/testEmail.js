require("dotenv").config();

const transporter = require("../config/emailConfig");

const testEmail = async () => {
  try {
    await transporter.verify();
    console.log("Email server connected successfully!");
  } catch (error) {
    console.error("Email connection failed:", error.message);
  }
};

testEmail();