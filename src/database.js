const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();
const constants = require('./constants/index');
// if(!mongoose.Types.ObjectId.isValid(_id));
// console.log(constants.valorFOO);

// Connect Mongodb Atlas
const main = async () => {
    try {
        await mongoose.connect(constants.DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Conectado a MONGODB Atlas");
        app.listen(constants.PORT, () => console.log("El servidor está escuchando por el puerto", constants.PORT));
    } catch(error) {
        console.error(`No se ha podido iniciar el servidor \n${error.message}`);
    }
};

main();


