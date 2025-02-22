const bcrypt = require("bcryptjs");
const { User } = require("../../models/user");
const gravatar = require("gravatar");
require("dotenv").config();

const { RequestError } = require("../../helpers");
const { nanoid } = require("nanoid");
const sendEmail = require("../../helpers/sendEmail");
const { BASE_URL } = process.env;

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw RequestError(409, "Email in use");
  }
  const avatarURL = gravatar.url(email);
  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();
  const result = await User.create({
    name,
    email,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const mail = {
    to: email,
    subject: "Verify email bro:))",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click to verify your email</a>`,
  };

  await sendEmail(mail);

  res.status(201).json({
    user: {
      name: result.name,
      email: result.email,
      avatarURL,
    },
  });
};

module.exports = register;
