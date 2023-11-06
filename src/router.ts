import { authRouter } from "modules/Auth/router";
import { userRouter } from "modules/User/router";

export const router = [userRouter, authRouter];
