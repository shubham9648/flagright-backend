const mongoose = require("mongoose");
const mongoConfig = require("../config/mongo");

module.exports.connect = () => {
  return new Promise((resolve, reject) => {
    let mongoUrl = process.env.NODE_ENV == "production" ? mongoConfig.mongoUrl : mongoConfig.mongoUrl;
    mongoose
      .connect(mongoUrl, mongoConfig.mongoOptions.options)
      .then((connection) => {
        console.log(`Mongo connected`);
        return resolve(connection);
      })
      .catch((err) => {
        return reject(err);
      });
    mongoose.connection.on("error", (err) => {
      console.log(`Error in mongoose conection - ${err.message}`);
    });
  });
};

module.exports.close = () => {
  return mongoose.disconnect();
};
