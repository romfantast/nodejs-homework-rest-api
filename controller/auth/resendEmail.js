const { User } = require("../../models/user");
const { RequestError } = require("../../helpers/RequestError");
const sendEmail = require("../../helpers/sendEmail");
require("dotenv").config();
const { BASE_URL } = process.env;

const resendEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.verify) {
    throw RequestError(404);
  }

  const mail = {
    to: email,
    subject: "Verify email bro:))",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click to verify your email</a>`,
  };

  await sendEmail(mail);

  res.json({
    message: "Email was verified successfully",
  });
};

module.exports = resendEmail;
