const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");

const mongoUri = require("./db/connection");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));

mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.redirect("/students");
});

app.use("/students", studentRoutes);

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
