import { prismaConnect } from "prismaConn";
import bcrypt from "bcrypt";
import { UtilsFileUser } from "../utils/file-utils";
import { error } from "console";
import { throws } from "assert";

class UserService {
  public async create(name: string, email: string, password: string) {
    // ** inicio findUser
    // FIND USER BUSCA SE HÁ UM USUARIO EXISTENTE NO BANCO
    const findUser = await prismaConnect.user.findUnique({
      where: {
        email,
      },
    });
    // Se existir o usuario, lançamos um ERRO
    if (findUser) {
      throw new Error("Dados já existentes.");
    }
    // ** FIM FINDUSER **

    // ** INICIO
    // ** Se o usuario n existir, criamos UM
    const create = await prismaConnect.user.create({
      data: {
        name,
        email,
        password: bcrypt.hashSync(password, 6),
      },
      select: {
        // APENAS OS DADOS DE SELECT SÃO PASSADOS NO RETURN
        id: true,
        name: true,
        email: true,
      },
    });

    UtilsFileUser.createFolderUser(create.id); // cria a pasta para o user com seu ID

    return create;
    // ** FIM CRIAÇÃO DE NOVO USUARIO
  }

  // busca usuario pelo ID
  public async read(paramsId: string) {
    const findUser = await prismaConnect.user.findUnique({
      where: {
        id: paramsId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!findUser) {
      throw new Error("Dados não encontrados");
    }

    return findUser;
  }

  // Inicio UPDATE
  public async update(paramsId: string, name: string) {
    const findUser = await prismaConnect.user.findUnique({
      where: {
        id: paramsId,
      },
    });

    if (!findUser) {
      throw new Error("Dados não encontrados");
    }

    const update = await prismaConnect.user.update({
      where: {
        id: paramsId,
      },
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return update;
  } //FIM UPDATE

  public async delete(paramsId: string) {
    try {
      UtilsFileUser.deleteFolderUser(paramsId);
      return await prismaConnect.user.delete({
        where: {
          id: paramsId,
        },
      });
    } catch (err: any) {
      throw new Error("Dados não encontrados");
    }
  }
}

export const userService = new UserService();

// BANCO DE DADOS // CAMADA DE SERVICE // TRATA A PARTE DE ARMAZENAMENTO DE DADOS
