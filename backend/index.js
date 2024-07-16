require("dotenv").config();
const express = require("express");
const server = express();
const cors = require("cors");
const mongoose = require("mongoose");
const UserRouter = require("./routes/User");
const cookieParser = require("cookie-parser");
const AuthRouter = require("./routes/Auth");
const { User } = require("./model/User");
const PostRouter = require("./routes/Post");
const jwt = require("jsonwebtoken");
// const isAuth = require("./utils/Protected")

//middleware
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

const isAuth = async (req, res, next) => {
  const token = cookieExtractor(req);
  try {
    if (!token) {
      return res
        .status(401)
        .json({ msg: "you are unauthorised login and come again" });
    }
    var decoded = jwt.verify(token, process.env.SECRET);
    if (decoded.username) {
      const user = User.findOne({ username: decoded.username }).select(
        "-password"
      );
      req.user = user;
      next();
    } else {
      res
        .status(401)
        .json({ msg: "you are unauthorised login and come again" });
    }
  } catch (err) {
    res.status(201).json({ msg: "you are uautorised" });
  }
};


server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use("/auth", AuthRouter.router);
server.use("/user", isAuth, UserRouter.router);
server.use("/post", isAuth, PostRouter.router);

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("database connected");
}

server.listen(process.env.PORT, () => {
  console.log("server started");
});
