import { EZod } from "enum/zod.enum";
import fs from "node:fs";
import path from "node:path";

// quando chamar essa class ela cria uma pasta para um ID de user especifico
export class UtilsFileUser {
  private static _userPath = ["assets", "files"]; // path armazenado para reutilizar

  // valida se há uma pasta com esse userId // validação privada
  private static _validateFolder(pathArray: string | Array<string>) {
    if (Array.isArray(pathArray)) {
      return fs.existsSync(path.resolve(...this._userPath, ...pathArray));
    }

    return fs.existsSync(path.resolve(...this._userPath, pathArray));
  }

  // SE NÃO EXISTIR UMA PASTA COM ESSE USERID, CRIAMOS UMA
  public static createFolderUser(pathArray: string | Array<string>) {
    if (!this._validateFolder(pathArray)) {
      if (Array.isArray(pathArray)) {
        // "..." desestrutura um array ou objeto
        return fs.mkdirSync(path.resolve(...this._userPath, ...pathArray)); // cria nesse path a pasta para o user
      }
      return fs.mkdirSync(path.resolve(...this._userPath, pathArray));
    }
  }

  public static deleteFolderUser(pathArray: string | Array<string>) {
    if (this._validateFolder(pathArray)) {
      if (Array.isArray(pathArray)) {
        return fs.rmSync(path.resolve(...this._userPath, ...pathArray), {
          recursive: true,
        });
      }
      return fs.rmSync(path.resolve(...this._userPath, pathArray), {
        recursive: true,
      });
    }

    throw new Error(EZod.E404);
  }
}
