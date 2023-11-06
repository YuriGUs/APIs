import { Request, Response } from "express";
import { z } from "zod"; // lib pra ajudar nas validations
import { userService } from "../service/user-service";
import { EZod } from "enum/zod.enum";

class UserController {
  public async create(req: Request, res: Response) {
    const { name, email, password } = req.body;
    // ** INICIO
    // VALIDA COM A LIB ZOD
    try {
      const ZUserSchema = z.object({
        name: z.string().optional(), // NAME TIPO STRING E OPCIONAL
        email: z.string().email({ message: `Email ${EZod.REQUIRED}` }), // EMAIL, STRING, COM MENSAGEM
        password: z.string().min(8, { message: `Senha ${EZod.REQUIRED}` }), // SENHA, STRING, COM MENSAGEM
      });
      ZUserSchema.parse({ name, email, password });
    } catch (err: any) {
      return res.status(400).json({
        message: "Dados inválidos",
        error: err.errors,
      });
    }
    //
    // FIM

    /* esse TRY CATCH CHAMA O CREATE DE USER
    SERVICE QUANDO UM NOVO USUARIO É CRIADO
     */
    try {
      return res.json({
        // RETURN PARA UMA CHAMADA COMO NO INSOMNIA
        message: "Criado com sucesso",
        data: await userService.create(name, email, password),
      });
    } catch (err: any) {
      return res.status(409).json({
        message: err.message, // retorna o erro caso o create dê errado
      });
    }
  }

  // PARTE DO READ
  public async read(req: Request, res: Response) {
    const paramsId = req.params.id;

    try {
      const ZUserSchema = z.string().min(30, { message: "ID obrigatório" });
      ZUserSchema.parse(paramsId);
    } catch (err: any) {
      return res.status(400).json({
        message: "Dados invalidos",
        error: err.errors,
      });
    }

    try {
      return res.json({
        message: "Usuário encontrado com sucesso",
        data: await userService.read(paramsId),
      });
    } catch (err: any) {
      return res.status(404).json({
        error: err.message,
      });
    }
  }
  // FIM DO READ

  // INICIO UPDATE
  public async update(req: Request, res: Response) {
    const paramsId = req.params.id;
    const { name } = req.body;

    try {
      const ZUserSchema = z.object({
        paramsId: z.string().min(30, { message: "ID obrigatório" }),
        name: z.string().min(1, { message: "Nome obrigatório" }),
      }); //object sempre usado quando vamos usar/validar mais de 1 coisa
      ZUserSchema.parse({ paramsId, name });
    } catch (err: any) {
      return res.status(400).json({
        message: "Dados invalidos",
        error: err.erros,
      });
    }

    try {
      return res.json({
        message: "Atualizado com sucesso!",
        data: await userService.update(paramsId, name),
      });
    } catch (err: any) {
      return res.status(404).json({
        message: "Dados inválidos",
        error: err.errors,
      });
    } // FIM UPDATE
  }

  // INICIO DELETE
  public async delete(req: Request, res: Response) {
    const paramsId = req.params.id;

    try {
      const ZUserSchema = z.string().min(30, { message: "ID é obrigatório" });
      ZUserSchema.parse(paramsId);
    } catch (err: any) {
      return res.status(400).json({
        message: "Dados inválidos",
        error: err.errors,
      });
    }

    try {
      await userService.delete(paramsId);
      return res.json({
        message: "Deletado com sucesso",
      });
    } catch (err: any) {
      return res.status(404).json({
        error: err.message,
      });
    }
  } // FIM DELETE
}
// CAMADA CONTROLLER TRATA DAS RESPOSTAS

export const userController = new UserController();
