

const productRepository = require("../repositories/product.repository.js");
const ProductRepository = new productRepository();

class productController {

    async agregarProducto (req,res) {
        const {title, description, price, img, code, stock, category, thumbnails, owner} = req.body;
        try {
            const nuevoProducto = await ProductRepository.addProduct({title, description, price, img, code, stock, category, thumbnails, owner});
            res.status(200).send("producto agregado con exito");
        } catch (error) {
            res.status(500).send("error")
        }

    }
    async listarProductos (req,res) {
        const {limit, page, sort, query} = req.query;
        try {
            const productos = await ProductRepository.getAll({limit, page, sort, query});
            res.status(200).send(productos);
        } catch (error) {
            res.status(500).send("error")
        }
    }
    async listarProductosPorId (req,res) {
        const id = req.params.pid;
        try {
            const producto = await ProductRepository.getById(id);
            if(!producto){
                return res.json({error: "producto no encontrado"})
            }
            res.json(producto)
        } catch (error) {
            res.status(500).send("error")
        }
    }
    async actualizarProducto (req,res) {
        const id = req.params.pid;
        const productoActualizado = req.body;
        try {
            const productoA = await ProductRepository.updateProducts(id,productoActualizado);
            res.json(productoA);
        } catch (error) {
            res.status(500).send("error al actualizar producto");
        }
    }
    async eliminarProducto (req,res) {
        const id = req.params.pid;
        try {
            const productoE = await ProductRepository.deleteProd(id);
            res.json(productoE,"producto eliminado")
        } catch (error) {
            res.status(500).send("error al eliminar producto")
        }
    }
}

module.exports = productController;