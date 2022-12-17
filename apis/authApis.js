import express from "express";
import { body } from "express-validator";
import { errorHandler } from "../utils/errorHandler.js";
import {
  signupController,
  passwordChangeController,
  loginUserController,
} from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/isAuth.js";

const router = express.Router();

router.post(
  "/signup",
  [
    body("email").normalizeEmail().isEmail().withMessage("Invalid Email!"),
    body("password").isStrongPassword().withMessage("Password is Weak!"),
  ],
  errorHandler,
  signupController
);
router.post(
  "/login",
  [
    body("email").normalizeEmail().isEmail().withMessage("INVALID EMAIL"),
    body("password").isStrongPassword().withMessage("INVALID PASSWORD"),
  ],
  errorHandler,
  loginUserController
);

router.post(
  "/password_change",
  [
    body("password").isStrongPassword().withMessage("PASSWORD IS WEAK"),
    body("newPassword").isStrongPassword().withMessage("NEW PASSWORD IS WEAK"),
  ],
  errorHandler,
  isAuthenticated,
  passwordChangeController
);

export default router;
