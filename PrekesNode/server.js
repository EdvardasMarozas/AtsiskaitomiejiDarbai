const express = require("express");
const app = express();
const path = require('path')
app.set("view engine", "ejs");

// app.use(express.static("public"));
app.use('/static', express.static(path.join(__dirname, 'public')))

app.get("/", (req, res) => {
  res.render("index", { text: "World" });
});
const prekesRouter = require("./routes/prekes");

app.use("/prekes", prekesRouter);

// function logger(req, res, next) {
//   console.log(req.originalUrl);
//   next();
// }

app.listen(8080);
