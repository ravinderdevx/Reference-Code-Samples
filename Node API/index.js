const express = require("express");
const cors = require("cors");
const logger = require("morgan");

const CONFIG = require("./config/config");
const routes = require("./routes/app.routes");

require('./db');

const port = CONFIG.port || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

// Handing Cors
app.use(cors());

// Logging API
app.use(logger('dev'));

// Routes
app.use(CONFIG.api_version, routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("error");
});

onListening = () => {
  console.log(
    "App is running at http://localhost:%d in %s mode",
    port,
    CONFIG.environment
  );
  console.log("Press CTRL-C to stop \n");
  console.debug("Server is listening on PORT : " + port);
  console.debug("Go to http://localhost:" + port + "\n");
};

onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;

    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;

    default:
      throw error;
  }
};

app.listen(port, onListening).on("error", onError);
