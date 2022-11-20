const mongoose = require("mongoose");
const connect = (connectionString) => {
  return mongoose
    .connect(connectionString)
    .then(() => {
      return console.log("Connected to Database");
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};
module.exports = { connect };
