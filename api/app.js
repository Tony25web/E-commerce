const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const connect = require("./config/database").connect;
const { ApiError } = require("./utils/ApiError");
const MountRoutes = require("./routes/index");
const { errorHandler } = require("./middlewares/errorHandler");
require("dotenv").config({ path: "config.env" });
// express app
const app = express();

const cors = require("cors");
const compression = require("compression");
//MiddleWares
// Cross Origin Resource Sharing configuration
app.use(cors());
//compress all response
app.use(compression());
app.options("*", cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// express Routes

MountRoutes(app);
app.all("*", (req, res, next) => {
  next(
    new ApiError(
      `couldn't find the route you are looking for:${req.originalUrl} please provide a valid route`,
      400
    )
  );
});
/* this middleware handle any error that
 express produce but errors like database
 connection or rejected Promises will not
 be handled by this middleware*/
app.use(errorHandler);
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, console.log(`listening to port ${PORT}`));
connect(process.env.MONGO_URI);

/* we are going to use the events in nodejs 
  to handle errors that can't be handled by express
  */
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Errors:${err.name}| ${err.message} `);
  /*
   when we have pending requests or active requests that are in the server
   we are going to wait the server to finish them and then we are going
    to close the server and finally we exit the process 
   =>*/
  server.close(() => {
    console.log("the server is shutting down....");
    process.exit(1);
  });
});
