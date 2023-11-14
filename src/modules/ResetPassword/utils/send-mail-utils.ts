import nodemailer from "nodemailer";

export class UtilsSendMail {
  public static async send(email: string, secret: string) {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "gustavo000y@gmail.com",
        pass: "",
      },
    });
  }
}

//configurado apenas para SMTP do gmail
