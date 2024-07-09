const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/product.controller.js");
const productController = new ProductController();


router.post("/", productController.agregarProducto);
router.get("/", productController.listarProductos);
router.get("/:pid", productController.listarProductosPorId);
router.put("/:pid", productController.actualizarProducto);
router.delete("/:pid", productController.eliminarProducto);

module.exports = router;