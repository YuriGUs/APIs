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
        error: err.erros,
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

  public async validateSecurityCode(req: Request, res: Response) {}

  public async resetPassword(req: Request, res: Response) {}
}

export const resetPasswordController = new ResetPasswordController();
