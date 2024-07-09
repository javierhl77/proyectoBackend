
const socket = require("socket.io");
const MessageModel = require("../models/message.model.js");

//const productRepository = require("../repositories/product.repository.js");
//const ProductRepository = new productRepository();

const productFactory = require("../dao/product.Factory");
const ProductService = new productFactory();

class SocketManager{
  
    constructor(httpServer) {
        this.io = socket(httpServer);
        this.initSocketEvents();
    }
    async initSocketEvents() {
        this.io.on("connection", async (socket) => {
            console.log("Un cliente se conectó");
            
            socket.emit("productos", await ProductService.getProducts() );

            socket.on("eliminarProducto", async (id) => {
                await ProductService.deleteProduct(id);
                this.emitUpdatedProducts(socket);
            });

            socket.on("agregarProducto", async (producto) => {
                await  ProductService.addProduct(producto);
                this.emitUpdatedProducts(socket);
            });

            socket.on("message", async (data) => {
                await MessageModel.create(data);
                const messages = await MessageModel.find();
                socket.emit("message", messages);
            });
        });
    }

    async emitUpdatedProducts(socket) {
        socket.emit("productos", await ProductService.getProducts() );
    }
}


module.exports = SocketManager;