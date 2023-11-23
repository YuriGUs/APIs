import { authRouter } from "modules/Auth/router";
import { resetPasswordRouter } from "modules/ResetPassword/router";
import { userRouter } from "modules/User/router";
import { userClientRouter } from "modules/UserClient/router";

export const router = [
  userRouter,
  authRouter,
  resetPasswordRouter,
  userClientRouter,
];
