import fs from "node:fs";
import path from "node:path";

// quando chamar essa class ela cria uma pasta para um ID de user especifico
export class UtilsFileUser {
  private static _userPath = ["assets", "files"]; // path armazenado para reutilizar

  // valida se há uma pasta com esse userId // validação privada
  private static _validateFolder(userId: string) {
    return fs.existsSync(path.resolve(...this._userPath, userId));
  }

  // SE NÃO EXISTIR UMA PASTA COM ESSE USERID, CRIAMOS UMA
  public static createFolderUser(userId: string) {
    if (!this._validateFolder(userId)) {
      fs.mkdirSync(path.resolve(...this._userPath, userId)); // cria nesse path a pasta para o user
    }
  }

  public static deleteFolderUser(userId: string) {
    if (this._validateFolder(userId)) {
      return fs.rmSync(path.resolve(...this._userPath, userId), {
        recursive: true,
      });
    }

    throw new Error();
  }
}
