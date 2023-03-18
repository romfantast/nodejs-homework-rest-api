const express = require("express");
const controllers = require("../../controller/auth");
const { ctrlWrapper } = require("../../helpers/index");
const { validateBody, authenticate } = require("../../middlewares");
const upload = require("../../middlewares/upload");
const {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
} = require("../../schema/contacts");

const router = express.Router();

router.post(
  "/register",
  validateBody(registerSchema),
  ctrlWrapper(controllers.register)
);

router.get("/verify/:verificationToken", controllers.verify);

router.post(
  "/verify",
  validateBody(verifyEmailSchema),
  controllers.resendEmail
);

router.post(
  "/login",
  validateBody(loginSchema),
  ctrlWrapper(controllers.login)
);

router.post("/logout", authenticate, ctrlWrapper(controllers.logout));

router.get("/current", authenticate, ctrlWrapper(controllers.getCurrent));

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrlWrapper(controllers.updateAvatar)
);

module.exports = router;
