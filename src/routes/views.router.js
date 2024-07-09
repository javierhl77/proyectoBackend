

const express = require("express");
const router = express.Router();
const cartModel = require("../models/cart.model.js");
const UserModel = require("../models/user.model.js");



const ViewsController = require("../controllers/views.controller.js");
const viewsController = new(ViewsController);

const userRepository = require("../repositories/user.repository.js");
const UserRepository = new userRepository();

const checkUserRole = require("../middleware/checkrole.js");

const passport = require("passport");



router.get("/products",checkUserRole(['user','premium']), passport.authenticate('jwt', { session: false }), viewsController.renderProductos );
 



router.get("/carts/:cid", async (req, res) => {
   const cartId = req.params.cid;
   
   try {
      const carrito = await cartModel.findById(cartId)//.populate("products");
      console.log(JSON.stringify(carrito, null, 2));
      if (!carrito) {
         console.log("No existe ese carrito con el id");
         return res.status(404).json({ error: "Carrito no encontrado" });
      }
      let totalCompra = 0;
      const productosEnCarrito = carrito.products.map(item => {
        const product = item.product.toObject();
        const quantity = item.quantity;
        const totalPrice = product.price * quantity;
        totalCompra += totalPrice;
        return {
         product: { ...product, totalPrice},
         quantity,
         cartId
        };
         
      }
   );



      res.render("carts", { productos : productosEnCarrito, totalCompra, cartId });
   } catch (error) {
      console.error("Error al obtener el carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
   }
});



router.get("/realtimeproducts", checkUserRole(['admin', 'premium']), passport.authenticate('jwt', { session: false }), (req,res) => {
      const usuario = req.user;
      res.render("realtimeproducts", {role: usuario.role, email: usuario.email});
   })



router.get("/Usuarios", viewsController.renderUsuarios);



router.get("/reset-password", (req,res) => {
   res.render("password-reset")
})
router.get("/Password",(req,res) => {
   res.render("password-cambio")
})

router.get("/confirmacion", (req,res) => {
   res.render("ConfirmacionDeEnvio")
})



router.get("/", async(req,res) => {
    res.render("home");
})

module.exports = router;