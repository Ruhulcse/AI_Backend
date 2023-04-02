const express = require("express");
const app = express();
const db = require("./db/db");
const logger = require("morgan");
const helmet = require("helmet");
const routes = require("./routes");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/errors");
const cors = require("cors");
require("./helpers/create_admin");

require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/api", auth.authorize);
app.use(logger("dev"));
app.use(helmet());
app.use(routes);
app.use("/public", express.static("public"));

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.get("/test", function (req, res) {
  res.send("Backend is running successfully.....");
});

app.listen(PORT, () => {
  console.log(`server listening on http://127.0.0.1:${PORT}`);
});

module.exports = app;
