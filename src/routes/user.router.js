

const express = require("express");
const router = express.Router();
const UserController = require ("../controllers/user.controller.js");
const passport = require("passport");
const initializePassport = require("../config/passport.config.js");

const UserModel = require("../models/user.model.js");

const userController = new UserController();






const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");

const UserDTO = require("../dto/user.dto.js");


router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile",passport.authenticate("jwt", { session: false }),  userController.profile);
router.post("/logout", userController.logout.bind(userController));
router.get("/admin",passport.authenticate("jwt", { session: false }), userController.admin);
 


//tercera intregradora:

router.post("/RequestPasswordReset", userController.RequestPasswordReset); // Nueva ruta
router.post('/reset-password', userController.resetPassword);

//Modificamos el usuario para que sea premium: 
router.put("/premium/:uid", userController.cambiarRolPremium);


//cuarta integradora:



//midddleware para multer:

const upload = require("../middleware/multer.js");

router.post("/:uid/documents",upload.fields([{name: "document"}, {name: "products"},
     {name: "profile"}]) ,async(req,res) => {

    const { uid } = req.params;
    const uploadedDocuments = req.files;
    
    try {
        const user = await UserModel.findById(uid);

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        //Ahora vamos a verificar si se suben los documentos y se actualiza el usuario: 

        if (uploadedDocuments) {
            if (uploadedDocuments.document) {
                user.documents = user.documents.concat(uploadedDocuments.document.map(doc => ({
                    name: doc.originalname,
                    reference: doc.path
                })))
            }

            if (uploadedDocuments.products) {
                user.documents = user.documents.concat(uploadedDocuments.products.map(doc => ({
                    name: doc.originalname,
                    reference: doc.path
                })))
            }

            if (uploadedDocuments.profile) {
                user.documents = user.documents.concat(uploadedDocuments.profile.map(doc => ({
                    name: doc.originalname,
                    reference: doc.path
                })))
            }
        }

        //Guardamos los cambios en la base de datos: 

        await user.save();

        res.status(200).send("Documentos cargados exitosamente");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error interno del servidor, los mosquitos seran cada vez mas grandes");
    }

})



//eliminar usuario segun su actividad de coneccion :
router.delete("/:uid", userController.eliminarUsuario);


router.get("/", userController.listarUsuarios);
  

module.exports = router;