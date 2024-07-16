const { Post } = require("../model/Post");

exports.createPost = async (req, res) => {
  const post = new Post(req.body);
  if (!post.text && !post.image)
    return res.status(400).json({ msg: "cannot post empty post " });
  try {
    if(req.user.id != post.userId) return res.status(400).json({msg : "mind you own buisiness"});
    const doc = await post.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.getAllPostById = async (req, res) => {
  const { userId } = req.params;
  if(userId != req.user.id) return res.status(400).json({msg : "do your work only"})
  try {
    const doc = await Post.find({ userId: userId }).exec();
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.deletePostById = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (post.userId !== user.id)
      return res.status(400).json({ msg: " very very bad request" });
    const doc = await Post.findByIdAndDelete(id);
    console.log(doc);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.likeUnlikePost = async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    const isLike = post.likes.includes(user.id);
    if (isLike) {
      const doc = await Post.findByIdAndUpdate(id, {
        $pull: { likes: user.id },
      });
      res.status(200).json({ msg: "unliked succesfully" });
    } else {
      const doc = await Post.findByIdAndUpdate(id, {
        $push: { likes: user.id },
      });
      res.status(200).json({ msg: "liked succesfully" });
    }
  } catch (err) {
    res.status(400).json({ msg: err.msg });
  }
};

exports.comment = async (req, res) => {
    const postId =  req.params.id;
    const commenterId = req.user.id;
    const text = req.body.text;

    if(!text) return res.status(400).json({msg : "empty comment"})
    const username = req.user.username;
    const commenterImage = req.user.profilePic;
    try {
        const comment = {commenterId , username , text , commenterImage};
        const post =await Post.findById(postId);
        if(!post)return  res.status(400).json({msg : "post not found"});
        post.comments.push(comment);
        const doc = await post.save();
        res.status(200).json({msg :"commented successfully"})

    } catch (err) {
        res.json(401).json({msg : err.message})
    }
};

exports.getFeedPost =async  (req  , res ) => {
    const id = req.user.id;
    const  following = req.user.following;

    try {
        const posts = await  Post.find({userId : {$in:following}}).sort({createdAt : -1});
        res.status(200).json({posts});
    } catch (err) {
        res.status(401).json({msg : err.message})
    }    

    
}
