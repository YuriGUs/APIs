import nodemailer from "nodemailer";

export class UtilsSendMail {
  public static async send(email: string, secret: number) {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SEND_EMAIL,
        pass: process.env.SEND_EMAIL_PASSWORD,
      },
    });

    // envia o codigo atravez do email do proprietario para o usuario que deseja
    // resetar a senha
    const mailOptions = {
      from: process.env.SEND_MAIL,
      to: email,
      subject: "[Código de segurança] Resete sua senha",
      text: `Código de segurança gerado para resetar a senha do email (${email}): ${secret} Se não foi você quem solicitou este código, por favor entre em contato com o suporte e troque sua senha imediatamente.`,
    };

    await transporter.sendMail(mailOptions);
  }
}

//configurado apenas para SMTP do gmail
