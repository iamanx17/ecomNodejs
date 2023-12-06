const path = require("path");

const express = require("express");
const session = require("express-session");
const mongodbSession = require("connect-mongodb-session")(session);
const nunjucks = require("nunjucks");

const error = require("./controllers/error");
const connectDB = require("./utils/mongodb");

const app = express();
const mongodbUrl = "mongodb://localhost:27017/ecommerceShop";
const port = process.env.PORT || 3000;

app.set("view engine", "njk");

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

const store = new mongodbSession({
  uri: mongodbUrl,
  collection: "session",
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "gxdp8-kygcw-m4fgh-pqp3d-brdjg",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(require(path.join(__dirname, "./routes/shop")));
app.use(require(path.join(__dirname, "./routes/admin")));

app.use(error.error404);

app.listen(port, () => {
  connectDB(mongodbUrl);
  console.log("server started successfully");
});
