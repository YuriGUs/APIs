import { EZod } from "enum/zod.enum";
import { prismaConnect } from "prismaConn";
import { UtilsSendMail } from "../utils/send-mail-utils";
import bcrypt from "bcrypt";

class ResetPasswordService {
  public async validateUser(email: string) {
    // busca usuario no BD e vê se ele tem um secret do password atrelado à ele
    const findUser = await prismaConnect.user.findUnique({
      where: {
        email,
      },
      include: {
        resetPasswordSecret: true,
      },
    });

    if (!findUser) {
      throw new Error(EZod.E404);
    }

    // se reset secret n existir, criamos uma
    if (!findUser.resetPasswordSecret) {
      const generateSecret = Number(
        Array.from({ length: 6 }, () => Math.floor(Math.random() * 9)).join("")
        // retorna um numero inteiro(pede um numero aleatório do array que vai até 9)
        // join() transforma em em string, mas o Number() do começo já transforma em Number
      );

      // utiliza o generate e traz ele pra cá criando uma secret
      const { secret } = await prismaConnect.resetPasswordSecret.create({
        data: {
          secret: generateSecret,
          userId: findUser.id,
        },
        select: {
          secret: true,
        },
      });

      UtilsSendMail.send(email, secret); // função que envia o código para o email solicitado
      // retorna o email e a secret gerada para o data do controller
      return { email, secret };
    }

    UtilsSendMail.send(email, findUser.resetPasswordSecret.secret);
    // return caso a secret já exista
    return { email, secret: findUser.resetPasswordSecret.secret };
  }
  public async validateSecurityCode(email: string, secret: number) {
    // busca o usuario no BD e pega o reset secret atrelado a esse usuario
    const findUser = await prismaConnect.user.findUnique({
      where: {
        email,
      },
      include: {
        resetPasswordSecret: true,
      },
    });

    if (
      !findUser ||
      !findUser.resetPasswordSecret ||
      findUser.resetPasswordSecret.secret !== secret
    ) {
      throw new Error(EZod.E404);
    }

    return { email, secret };
  }
  public async resetPassword(
    email: string,
    secret: number,
    newPassword: string
  ) {
    const findUser = await prismaConnect.user.findUnique({
      where: {
        email,
      },
      include: {
        resetPasswordSecret: true,
      },
    });

    if (
      !findUser ||
      !findUser.resetPasswordSecret ||
      findUser.resetPasswordSecret.secret !== secret
    ) {
      throw new Error(EZod.E404);
    }

    const update = await prismaConnect.user.update({
      where: {
        email,
      },
      data: {
        password: bcrypt.hashSync(newPassword, 6),
      },
      select: {
        name: true,
        email: true,
      },
    });

    await prismaConnect.resetPasswordSecret.delete({
      where: {
        userId: findUser.id,
      },
    });

    return update;
  }
}

export const resetPasswordService = new ResetPasswordService();
