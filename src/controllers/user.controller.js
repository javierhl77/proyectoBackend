

const UserModel = require("../models/user.model.js");

const CartModel = require("../models/cart.model.js");

const userRepository = require("../repositories/user.repository.js");
const UserRepository = new userRepository();

const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");
const UserDTO = require("../dto/user.dto.js");


const emailManager = require("../services/email-manager.js");
const EmailManager = new emailManager();

const { generarResetToken } = require("../utils/tokenreset.js");


class UserController {
    
    async register(req, res) {
       const {first_name,last_name,email,password,age} = req.body;

        try {

            const user = await UserModel.findOne({email});
            if(user) return res.status(400).send("usuario ya existe");

            const nuevoCarrito = new CartModel();
            await nuevoCarrito.save();

            const nuevoUsuario = new UserModel({
                first_name,
                last_name,
                email,
                password: createHash(password),
                age,
                cart : nuevoCarrito._id
              })
            await nuevoUsuario.save();
            //res.json(nuevoUsuario);
              
            res.send("usuario registrado correctamente");
        } 
        catch (error) {
            res.status(500).send("error")
        } 
        
             //const nuevoUsuario = await userRepository.RegisterUser({first_name, last_name, email, password, age})
            
   
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const usuarioEncontrado = await UserModel.findOne({ email });

            if (!usuarioEncontrado) {
                return res.status(401).send("Usuario no válido");
            } 

       

            const esValido = isValidPassword(password, usuarioEncontrado);
            if (!esValido) {
                return res.status(401).send("Contraseña incorrecta");
            }

             const token = jwt.sign({ user: usuarioEncontrado }, "coderhouse", {
                expiresIn: "1h"
            });

            usuarioEncontrado.last_connection = new Date();
            await usuarioEncontrado.save();

            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            }); 

            res.redirect("/api/users/profile"); 
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor");
        }
       
    }

    async profile(req, res) {
        //Con DTO: 
        /* const user = req.user;
        const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);
        const isAdmin = user.role === 'admin';
        res.render("profile", { user: userDto, isAdmin }); */

        try {
            const isPremium = req.user.role === 'premium';
            const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);
            const isAdmin = req.user.role === 'admin';

            res.render("profile", { user: userDto, isPremium, isAdmin });
        } catch (error) {
            res.status(500).send('Error interno del servidor');
        }
    }

    async logout(req, res) {

        if (req.user){
          try {
            req.user.last_connection = new Date();
            await req.user.save();
          } catch (error) {
            console.log(error);
            res.status(500).send("error interno del servidor, fallo el logout")
            return;
          }
        }


        res.clearCookie("coderCookieToken");
        res.redirect("/login");
    }

    async admin(req, res) {
        if (user.role !== "admin") {
            return res.status(403).send("Acceso denegado");
        }
        res.render("admin");
    }


 // 3er integradora
    async RequestPasswordReset(req,res) {
        const { email } = req.body;
        try {
            //buscar usuario por el correo
            const user = await UserModel.findOne({ email });
            if(!user){
                //si no hay usuario error
                return res.status(404).send("usuario no encontrado");
            }
            // sia hay usuario ,genero token:

            const token = generarResetToken(); //funcion que se encuentra en la carpeta utils
           //guardamos el token en el usuario(user):
            user.resetToken = {
            token: token,
            expireAt: new Date(Date.now() + 360000) //1 hr de duracion   
           };
           await user.save();

           //enviar un email con el enlace para reestablecer contraseña:
           await EmailManager.restablecerContraseña(email, user.first_name, token);

           res.redirect("/confirmacion");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor");
        }
    }

    async resetPassword(req,res) {
        const {email, password, token} = req.body;
        try {
            //buscar usuario:
            const user = await UserModel.findOne({ email });
            if(!user){
                //si no hay usuario error
                return res.render("password-cambio", {error:"usuario no encontrado"});
            }
            //obtener el token y lo verificamos:
            const resetToken = user.resetToken;
            if(!resetToken || resetToken.token !== token){
                return res.render("password-reset", {error: "el token es invalido"})
            }
            //verificar si el token expiro:
            const ahora = new Date();
            if (ahora > resetToken.expireAt) {
                return res.render("password-reset", {error: "el token es invalido"});
            }
            //verificamos si la contraseña nueva es igual a la anterior:
            if (isValidPassword(password, user)) {
                return res.render("password-cambio", {error: "la nueva contraseña no puede ser igual a la anterior"});

            }
            //actualizar la contraseña:
            user.password = createHash(password);
            //marcamos como usado a ese token:
            user.resetToken = undefined;
            await user.save();

            return res.redirect("/login");

        } catch (error) {
            return res.status(500).render("password-reset", {error: "error interno del servidor"})
        }
    }
    async cambiarRolPremium(req, res) {
        const { uid } = req.params;
        try {
            const user = await UserModel.findById(uid);

            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }

            // Verificamos si el usuario tiene la documentacion requerida: 
            const documentacionRequerida = ["Identificacion", "Comprobante de domicilio", "Comprobante de estado de cuenta"];

            const userDocuments = user.documents.map(doc => doc.name);

            const tieneDocumentacion = documentacionRequerida.every(doc => userDocuments.includes(doc));

            if (!tieneDocumentacion) {
                return res.status(400).send("El usuario tiene que completar toda la documentacion requerida");
            } 

            const nuevoRol = user.role === "user" ? "premium" : "user";

            res.send(nuevoRol); 

        } catch (error) {
            res.status(500).send("Error del servidor");
        }


       
    }

    async listarUsuarios (req,res) {
        const {limit, page, sort, query} = req.query;
        try {
            const usuarios = await UserRepository.getUsers({limit, page, sort, query});
            res.status(200).send(usuarios);
        } catch (error) {
            res.status(500).send("error")
        }
    }

    async eliminarUsuario (req,res) {

        const { uid } = req.params;
  
    try {
      const user = await UserModel.findById(uid);
  
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      const lastConnection = new Date(user.last_connection);
      const now = new Date();
      const thirtyMinutes = 1 * 60 * 1000; // 30 minutos en milisegundos
  
      if (now - lastConnection > thirtyMinutes) {
        await UserModel.findByIdAndDelete(uid);
        res.status(200).json({ message: "Usuario eliminado exitosamente" });

        await EmailManager.eliminacionDeUsuario(user.email, user.first_name);
      } else {
        res.status(400).json({ message: "El usuario se ha conectado en los últimos 30 minutos, no se puede eliminar" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
    }

    
    



}

module.exports = UserController;