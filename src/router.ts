import { authRouter } from "modules/Auth/router";
import { resetPasswordRouter } from "modules/ResetPassword/router";
import { userRouter } from "modules/User/router";

export const router = [userRouter, authRouter, resetPasswordRouter];
