import { Router } from "express";
import { resetPasswordController } from "./controller/reset-password-controller";

const router = Router();
const baseUrl = "/reset-password";

router.post(`${baseUrl}`, resetPasswordController.validateUser);
router.patch(`${baseUrl}`, resetPasswordController.resetPassword);
router.post(
  `${baseUrl}/validate`,
  resetPasswordController.validateSecurityCode
);

export const resetPasswordRouter = router;
