const express = require("express");
const {
  deletePostById,
  getAllPostById,
  likeUnlikePost,
  createPost,
  comment,
  getFeedPost,
} = require("../controller/Post");

const router = express.Router();

router
  .get("/getUser/:id", getAllPostById)
  .delete("/delete/:id", deletePostById)
  .patch("/likeUnlike/:id", likeUnlikePost)
  .post("/create", createPost)
  .patch('/comment/:id' , comment)
  .get('feed'  , getFeedPost);

exports.router = router;
