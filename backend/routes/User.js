import express from "express";
const router = express.Router();

import  {
  getUser,
  followUnfollowUser,
  updateUser,
}  from "../controller/User.js";

router
  .get("/getUser/:id", getUser)
  .post("/follow/:id", followUnfollowUser)
  .patch("/update/:id", updateUser);

export default router;
