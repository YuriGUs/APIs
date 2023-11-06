import jwt from "jsonwebtoken";
import { EZod } from "enum/zod.enum";
import bcrypt from "bcrypt";
import { prismaConnect } from "prismaConn";
import { UtilsTokenAuth } from "../utils/token-utils";

class AuthService {
  public async login(email: string, password: string) {
    // busca usuario com o email do BD
    const findUser = await prismaConnect.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!findUser) {
      throw new Error(EZod.E404);
    }

    // compara a senha do bcrypt com o usuario no BD
    if (!bcrypt.compareSync(password, findUser.password)) {
      throw new Error(EZod.E401);
    }

    return UtilsTokenAuth.jwtGenerate(findUser);
  }

  // sobre TOKEN REFRESH
  public async token(refresherToken: string) {
    // verificamos se o refreshToken gerado é igual ao refresh token ORIGINAL
    try {
      await jwt.verify(
        refresherToken,
        `${process.env.JWT_REFRESH_TOKEN_SECRET}`
      );
    } catch (error) {
      console.log("CAIU CATCH ERROR");
      throw new Error(EZod.E401);
    }

    /* Returns the decoded payload without verifying if the signature is valid */
    const decode = await (
      jwt.decode(refresherToken) as { payload: { id: string } }
    ).payload; // passou o decode COMO payload id: string

    // procuramos o usuario com o ID utilizado em DECODE
    const findUser = await prismaConnect.user.findUnique({
      where: {
        id: decode.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!findUser) {
      throw new Error(EZod.E404);
    }

    return UtilsTokenAuth.jwtGenerate(findUser);
  }
}

export const authService = new AuthService();
