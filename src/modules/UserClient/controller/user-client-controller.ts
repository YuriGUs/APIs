import { EZod } from "enum/zod.enum";
import { Request, Response } from "express";
import { string, z } from "zod";
import { userClientService } from "../service/user-client-service";

class UserClientController {
  public async create(req: Request, res: Response) {
    const { name, email, phone } = req.body;
    const tokenUserId = req.tokenUserId;

    try {
      const zClientSchema = z.string().min(1, `Nome ${EZod.REQUIRED}`);
      zClientSchema.parse(name);
    } catch (err: any) {
      return res.status(400).json({
        message: EZod.E400,
        error: err.errors,
      });
    }

    try {
      return res.json({
        message: EZod.CREATE,
        data: await userClientService.create(tokenUserId, name, email, phone),
      });
    } catch (err: any) {
      return res.status(404).json({
        message: err.message,
      });
    }
  }

  public async read(req: Request, res: Response) {
    const paramsId = req.params.id;
    const tokenUserId = req.tokenUserId;

    try {
      const zClientSchema = z
        .string()
        .min(30, { message: `ID ${EZod.REQUIRED}` });

      zClientSchema.parse(paramsId);
    } catch (err: any) {
      return res.status(400).json({
        message: EZod.E400,
        error: err.errors,
      });
    }

    try {
      return res.json({
        message: EZod.READ,
        data: await userClientService.read(paramsId, tokenUserId),
      });
    } catch (err: any) {
      return res.status(404).json({
        error: err.message,
      });
    }
  }

  // paginação
  public async listAll(req: Request, res: Response) {
    const tokenUserId = req.tokenUserId;
    let page = Number(req.query.page);
    const search = req.query.search ? String(req.query.search) : undefined;

    if (!page || page <= 0 || isNaN(page)) {
      page = 1;
    }

    try {
      return res.json({
        message: EZod.READ,
        data: await userClientService.listAll(tokenUserId, page, search),
      });
    } catch (err: any) {
      return res.status(404).json({
        error: err.errors,
      });
    }
  }

  public async update(req: Request, res: Response) {
    const { name, email, phone } = req.body;
    const paramsId = req.params.body;
    const tokenUserId = req.tokenUserId;

    try {
      const zClientSchema = z.object({
        name: z.string().min(1, { message: `Nome ${EZod.REQUIRED}` }),
        paramsId: z.string().min(30, { message: `ID ${EZod.REQUIRED}` }),
      });

      zClientSchema.parse({ name, paramsId });
    } catch (err: any) {
      return res.status(400).json({
        message: EZod.E400,
        error: err.errors,
      });
    }

    try {
      return res.json({
        message: EZod.UPDATE,
        data: await userClientService.update(
          name,
          email,
          phone,
          paramsId,
          tokenUserId
        ),
      });
    } catch (err: any) {
      return res.status(404).json({
        error: err.message,
      });
    }
  }

  public async delete(req: Request, res: Response) {
    const paramsId = req.params.id;
    const tokenUserId = req.tokenUserId;

    try {
      const zClientSchema = z
        .string()
        .min(30, { message: `Id ${EZod.REQUIRED}` });
      zClientSchema.parse(paramsId);
    } catch (err: any) {
      return res.status(400).json({
        message: EZod.E400,
        error: err.errors,
      });
    }

    try {
      await userClientService.delete(paramsId, tokenUserId);

      return res.json({
        message: EZod.DELETE,
      });
    } catch (err: any) {
      return res.status(404).json({
        error: err.message,
      });
    }
  }
}

export const userClientController = new UserClientController();
