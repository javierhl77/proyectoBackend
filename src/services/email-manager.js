const nodemailer = require("nodemailer");

class EmailManager {
  constructor() {
    this.transport = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: "tupackatari1977@gmail.com",
        pass: "neog ispu mdlr ddan",
      },
    });
  }
  //*envio de email de confirmacion  de compra */
  async enviarCorreoCompra(email, first_name, ticket) {
    try {
      const mailOptions = {
        from: "Coder Test <coderhouse50015@gmail.com>",
        to: email,
        subject: "Confirmación de compra",
        html: `
                    <h1>Confirmación de compra</h1>
                    <p>Gracias por tu compra, ${first_name}!</p>
                    <p>El número de tu orden es: ${ticket}</p>
                `,
      };

      await this.transport.sendMail(mailOptions);
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
    }
  }
  //*************************************************** */

  async restablecerContraseña(email, first_name, token) {

    try {
        const mailOptions = {
            from: "Coder Test <coderhouse50015@gmail.com>",
            to: email,
            subject: "restablecimiento de contraseña",
            html: `
                        <h1>Restablecimiento de Contraseña</h1>
                        <p>Hola ${first_name}!</p>
                        <p>Pediste restablecer tu cntraseña, Te enviamos el codigo de 
                        confirmacion</p>
                        <strong>${token}</strong>
                        <p>este codigo expira e una hora</p>
                        <a href="http://localhost:8080/Password">Restablecer contraseña </a>
                    `,
          };
    
          await this.transport.sendMail(mailOptions);
        
    } catch (error) {
        console.error("Error al enviar el correo electrónico:", error);
    }
  }

  async eliminacionDeUsuario(email, first_name) {
    try {
      const mailOptions = {
        from: "Coder Test <coderhouse50015@gmail.com>",
        to: email,
        subject: "cuenta eliminada por inactividad",
        html: `
                    <h1>su cuenta ha sido eliminada por inactividad</h1>
                    <p>gracias, ${first_name}!</p>
                    
                `,
      };

      await this.transport.sendMail(mailOptions);
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
    }
  }





}

module.exports = EmailManager;
