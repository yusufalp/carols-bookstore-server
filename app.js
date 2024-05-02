require("dotenv").config();
require("./config/connection");
require("./config/authStrategy");

const express = require("express");
const path = require("path");

const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const passport = require("passport");

const session = require("express-session");

const booksRoutes = require("./routes/booksRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan("dev"));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + "/public")));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/books", booksRoutes);
app.use("/", authRoutes);

app.get("/", (request, response, next) => {
  response.send(
    `
      <!DOCTYPE html>
      <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <p>Netlify testing</p>
        </body>
      </html>
    `
  );
});

app.listen(PORT);
console.log(`The server is listening on port ${PORT}`);
