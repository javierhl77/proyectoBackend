

/* const mongoose = require("mongoose");

//conectar con base de datos
mongoose.connect("mongodb+srv://javier1977:coderhouse@cluster0.mryvwa7.mongodb.net/E-commerce?retryWrites=true&w=majority&appName=Cluster0 ")
  .then(() => console.log("coneccion exitosa"))
  .catch( () => console.log("error en la coneccion"));  */ 


  const config = require("./config/config.js");
  const {mongo_url} = config;
  const mongoose = require("mongoose");

//conectar con base de datos
mongoose.connect(mongo_url)
  .then(() => console.log("coneccion exitosa"))
  .catch( () => console.log("error en la coneccion"));  

