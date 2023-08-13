const app = require("./startup/express").default();

const config = require("./config/environment");

require("./startup/routes").default(app);

const mongoConnect = require("./startup/mongoConnect");
mongoConnect.connect().catch((e) => {
  console.log(e);
});


const portNumber = process.env.PORT ||config.PORT;
const server = app.listen(portNumber, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Listening on port ${portNumber}`);
  }
});
module.exports = server;