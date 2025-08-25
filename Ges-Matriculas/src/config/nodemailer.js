import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

let transporter = nodemailer.createTransport({
  service: "gmail", // o "hotmail"
  host: process.env.HOST_MAIL,
  port: process.env.PORT_MAIL,
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.PASS_MAIL,
  },
});

const sendMailToRegister = (userMail, token) => {
  let mailOptions = {
    from: "admin@gesmatriculas.com",
    to: userMail,
    subject: "Confirmación de Cuenta - GesMatriculas 🎓",
    html: `
      <p>Hola, haz clic en el siguiente enlace para confirmar tu cuenta:</p>
      <a href="${process.env.URL_BACKEND}confirmar/${token}">Confirmar cuenta</a>
      <hr>
      <footer>Equipo GesMatriculas</footer>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("❌ Error al enviar correo: ", error);
    } else {
      console.log("✅ Correo enviado: ", info.messageId);
    }
  });
};

const sendMailToRecoveryPassword = (userMail, token) => {
  let mailOptions = {
    from: "admin@gesmatriculas.com",
    to: userMail,
    subject: "Recuperación de Contraseña - GesMatriculas 🔑",
    html: `
      <h1>GesMatriculas</h1>
      <hr>
      <p>Haz clic en el siguiente enlace para reestablecer tu contraseña:</p>
      <a href="${process.env.URL_BACKEND}recuperarpassword/${token}">Reestablecer contraseña</a>
      <hr>
      <footer>Equipo GesMatriculas</footer>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("❌ Error al enviar correo: ", error);
    } else {
      console.log("✅ Correo enviado: ", info.messageId);
    }
  });
};

export {
  sendMailToRegister,
  sendMailToRecoveryPassword
};
