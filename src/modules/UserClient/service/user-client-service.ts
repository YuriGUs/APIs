import { EZod } from "enum/zod.enum";
import { prismaConnect } from "prismaConn";
import { UtilsFileUser } from "utils/file-utils";

class UserClientSevice {
  public async create(
    tokenUserId: string,
    name: string,
    email: string,
    phone: string
  ) {
    const findUser = await prismaConnect.user.findUnique({
      where: {
        id: tokenUserId,
      },
    });

    if (!findUser) {
      throw new Error(EZod.E404);
    }

    const create = await prismaConnect.userClient.create({
      data: {
        name,
        email,
        phone,
        userId: tokenUserId,
      },
    });

    UtilsFileUser.createFolderUser([create.userId, create.id]);

    return create;
  }

  public async read(paramsId: string, tokenUserId: string) {
    // se der erro, trocar por findFirst
    const findUserClient = await prismaConnect.userClient.findUnique({
      where: {
        id: paramsId,
        userId: tokenUserId,
      },
    });

    if (!findUserClient) {
      throw new Error(EZod.E404);
    }
    return findUserClient;
  }

  public async listAll(
    tokenUserId: string,
    page: number,
    search: string | undefined
  ) {
    const pageSize = 11;
    const skip = (page - 1) * pageSize;
    let findUser;

    if (!search) {
      findUser = await prismaConnect.user.findMany({
        where: {
          id: tokenUserId,
        },
        include: {
          userClient: {
            skip,
            take: pageSize,
          },
        },
      });
    } else {
      findUser = await prismaConnect.user.findMany({
        where: {
          id: tokenUserId,
        },
        include: {
          userClient: {
            skip,
            take: pageSize,
            where: {
              name: {
                startsWith: search,
                mode: "insensitive",
              },
            },
          },
        },
      });
    }

    if (!findUser) {
      throw new Error(EZod.E400);
    }

    const totalCount = await prismaConnect.userClient.count({
      where: {
        userId: tokenUserId,
      },
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      page,
      pageSize,
      totalCount,
      totalPages,
      client: findUser[0].userClient,
    };
  }

  public async update(
    name: string,
    email: string,
    phone: string,
    paramsId: string,
    tokenUserId: string
  ) {
    const findUserClient = await prismaConnect.userClient.findFirst({
      where: {
        id: paramsId,
        userId: tokenUserId,
      },
    });

    if (!findUserClient) {
      throw new Error(EZod.E404);
    }

    const update = await prismaConnect.userClient.update({
      where: {
        id: paramsId,
      },
      data: {
        name,
        email,
        phone,
      },
    });

    return update;
  }

  public async delete(paramsId: string, tokenUserId: string) {
    const findUserClient = await prismaConnect.userClient.findFirst({
      where: {
        id: paramsId,
        userId: tokenUserId,
      },
    });

    if (!findUserClient) {
      throw new Error(EZod.E404);
    }

    const deleteUserClient = await prismaConnect.userClient.delete({
      where: {
        id: paramsId,
      },
    });

    UtilsFileUser.deleteFolderUser([
      deleteUserClient.userId,
      deleteUserClient.id,
    ]);

    return deleteUserClient;
  }
}

export const userClientService = new UserClientSevice();
