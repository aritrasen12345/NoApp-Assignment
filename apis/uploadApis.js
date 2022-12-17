import express from "express";
import { body } from "express-validator";
import { errorHandler } from "../utils/errorHandler.js";
import {
  uploadCSVController,
  upload,
} from "../controllers/uploadCSVController.js";
import { isAuthenticated } from "../middlewares/isAuth.js";

const router = express.Router();

router.post(
  "/create",
  upload.single("csvFile"),
  errorHandler,
  isAuthenticated,
  uploadCSVController
);

export default router;
