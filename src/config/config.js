

 require("dotenv").config();

const config = {
    mongo_url: process.env.MONGO_URL,
    persistence: process.env.PERSISTENCE //|| "mongo"
    //Mongo es la opción por defecto
};

module.exports = config;  





