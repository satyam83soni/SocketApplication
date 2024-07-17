
import express from "express"
import dotenv from "dotenv";
const server = express();
import cors from "cors"
dotenv.config()
import mongoose  from "mongoose"; 
import UserRouter from "./routes/User.js"
import cookieParser from "cookie-parser"
import AuthRouter  from "./routes/Auth.js";
import User from "./model/User.js"
import PostRouter from "./routes/Post.js"
import jwt from "jsonwebtoken"
import { createUser } from "./controller/Auth.js";

//middleware
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

// const isAuth = async (req, res, next) => {
//   const token = cookieExtractor(req);
//   console.log("cokkies" , token)
//   try {
//     if (!token) {
//       return res
//         .status(401)
//         .json({ msg: "you are unauthorised login and come again" });
//     }
//     var decoded = jwt.verify(token, process.env.SECRET);
//     if (decoded.username) {
//       const user = User.findOne({ username: decoded.username }).select(
//         "-password"
//       );
//       req.user = user;
//       console.log("current", req.user);
//       next();
//     } else {
//       res
//         .status(401)
//         .json({ msg: "you are unauthorised login and come again" });
//     }
//   } catch (err) {
//     res.status(201).json({ msg: "you are uautorised" });
//   }
// };
const isAuth = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		if (!token) return res.status(401).json({ message: "Unauthorized" });

		const decoded = jwt.verify(token, process.env.SECRET);

		const user = await User.findOne({username : decoded.username}).select("-password");

		req.user = user;
    console.log( "current in protected", user);
		next();
	} catch (err) {
		res.status(500).json({ message: err.message });
		console.log("Error in signupUser: ", err.message);
	}
};


server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());


server.use("/auth"  ,AuthRouter);
server.use("/user", isAuth, UserRouter);
server.use("/post", isAuth, PostRouter);

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://localhost:27017/Thread");
  console.log("database connected");
}

server.listen(8080, () => {
  console.log("server started");
});
