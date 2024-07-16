const express = require("express");
const isAuth = require('../utils/Protected')
const router = express.Router();

const {
  getUser,
  followUnfollowUser,
  updateUser,
} = require("../controller/User");

router
  .get("/getUser/:id", getUser)
  .post("/follow/:id", followUnfollowUser)
  .patch("/update/:id", updateUser);

exports.router = router;
