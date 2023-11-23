import { EZod } from "enum/zod.enum";
import { Request, Response } from "express";
import { z } from "zod";
import { resetPasswordService } from "../service/reset-password-service";

class ResetPasswordController {
  public async validateUser(req: Request, res: Response) {
    const email = req.body.email;

    try {
      const zUserSchema = z.string().email({ message: `${EZod.REQUIRED}` });

      zUserSchema.parse(email);
    } catch (err: any) {
      return res.status(400).json({
        message: EZod.E400,
        error: err.errors,
      });
    }

    // valida se o usuario existe
    try {
      return res.json({
        message: "Código enviado para o seu email.",
        data: await resetPasswordService.validateUser(email),
      });
    } catch (err: any) {
      return res.status(404).json({
        message: err.message,
      });
    }
  }

  public async validateSecurityCode(req: Request, res: Response) {
    const { email, secret } = req.body;

    try {
      const zUserSchema = z.object({
        email: z.string().email({ message: `Email ${EZod.REQUIRED}` }),
        secret: z
          .string()
          .min(6, { message: `Código Secreto ${EZod.REQUIRED}` }),
      });

      zUserSchema.parse({ email, secret });
    } catch (err: any) {
      return res.status(400).json({
        message: EZod.E400,
        error: err.errors,
      });
    }

    try {
      return res.json({
        message: EZod.READ,
        data: await resetPasswordService.validateSecurityCode(
          email,
          Number(secret)
        ),
      });
    } catch (err: any) {
      return res.status(404).json({
        message: err.message,
      });
    }
  }

  public async resetPassword(req: Request, res: Response) {
    const { email, secret, newPassword } = req.body;

    try {
      const zUserSchema = z.object({
        email: z.string().email({ message: `Email ${EZod.REQUIRED}` }),
        secret: z
          .string()
          .min(6, { message: `Código Secreto ${EZod.REQUIRED}` }),
        newPassword: z
          .string()
          .min(8, { message: `Nova senha ${EZod.REQUIRED}` }),
      });

      zUserSchema.parse({ email, secret, newPassword });
    } catch (err: any) {
      return res.status(400).json({
        message: EZod.E400,
        error: err.errors,
      });
    }

    try {
      return res.json({
        message: EZod.READ,
        data: await resetPasswordService.resetPassword(
          email,
          Number(secret),
          newPassword
        ),
      });
    } catch (err: any) {
      return res.status(404).json({
        message: err.message,
      });
    }
  }
}

export const resetPasswordController = new ResetPasswordController();
