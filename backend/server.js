const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");

const config = require("./config/index");
const authRouter = require("./routes/auth");
const { video } = require("./internal/controllers/video");

// app.use(cors("http://localhost:3000/"));
app.use(
  cors({ origin: [process.env.ALLOWED_ORIGIN, "http://localhost:3000"] })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", authRouter);

io.on("connection", video);

http.listen(config.port, (err) => {
  if (err) {
    return console.log(`Error ${err}`);
  }
  console.log(
    `Server listening port ${
      config.port
    }, time: ${new Date().toLocaleTimeString()}`
  );
});
