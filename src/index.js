const express = require("express");
// const bodyParser = require("body-parser");
const app = express();
const apiRouter = require("./api.js");

//converts requests from client into readable language for express
app.use(express.json());
//necessary if using <form> in html; parses data on request body into readable language for express
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.get("/healthcheck", (req, res) => {
  res.send({ hello: "world" });
});

//global error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(400).send("Whoops, global error handler caught ya!");
});

app.listen(3001, (err) => {
  if (err) console.log("Whoops, error on port 3001!", err);
  console.log("surveys-api running on port 3001");
});
