const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

exports.connect = () => {
    //connecting to database
    mongoose
        .connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("Connected to the database");
        })
        .catch((error) => {
            console.log("Database connection failed");
            console.error(error);
            process.exit(1);    
        });
};