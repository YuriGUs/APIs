import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";

// Enum
import { EZod } from "enum/zod.enum";

export class MiddlewareAuth {
  public static async authenticate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const token = req.headers["authorization"] || "";
    try {
      const ZAuthSchema = z
        .string()
        .min(25, { message: `Token ${EZod.REQUIRED}` });

      ZAuthSchema.parse(token);
    } catch (err: any) {
      console.log(err);
      return res.status(400).json({
        message: EZod.E400,
        erros: err.erros,
      });
    }

    // bloco de function token verification
    async function verifyToken(token: string) {
      try {
        await jwt.verify(token, `${process.env.JWT_SECRET}`);
        console.log("passei aq");
      } catch (error) {
        console.log("estou no catch do verify");
        return res.status(401).json({
          error: EZod.E401,
        });
      }
    }
    verifyToken(token);
    // fim bloco function

    const paramsId = req.params.id;
    const decoded = ((await jwt.decode(token)) as { payload: { id: string } })
      .payload;

    if (paramsId && paramsId !== decoded.id) {
      return res.status(400).json({
        message: EZod.E400,
      });
    }

    next();
  }
}
