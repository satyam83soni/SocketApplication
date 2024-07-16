import express from "express"

const router = express.Router();

import  { createUser, loginUser } from "../controller/Auth.js";

router.post("/signup", createUser).post("/login", loginUser);

export default router;
