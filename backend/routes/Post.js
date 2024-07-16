import express from "express"
import  {
  deletePostById,
  getAllPostById,
  likeUnlikePost,
  createPost,
  comment,
  getFeedPost,
} from "../controller/Post.js";

const router = express.Router();

router
  .get("/getUser/:id", getAllPostById)
  .delete("/delete/:id", deletePostById)
  .patch("/likeUnlike/:id", likeUnlikePost)
  .post("/create", createPost)
  .patch('/comment/:id' , comment)
  .get('feed'  , getFeedPost);

export default router;
