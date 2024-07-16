import Post from "../model/Post.js"


export const createPost = async (req, res) => {
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

export const getAllPostById = async (req, res) => {
  const { userId } = req.params;
  if(userId != req.user.id) return res.status(400).json({msg : "do your work only"})
  try {
    const doc = await Post.find({ userId: userId }).exec();
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

export const deletePostById = async (req, res) => {
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

export const likeUnlikePost = async (req, res) => {
	try {
		const { id: postId } = req.params;
		const userId = req.user._id;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			res.status(200).json({ message: "Post unliked successfully" });
		} else {
			// Like post
			post.likes.push(userId);
			await post.save();
			res.status(200).json({ message: "Post liked successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const comment = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;
		const userProfilePic = req.user.profilePic;
		const username = req.user.username;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const reply = { userId, text, userProfilePic, username };

		post.replies.push(reply);
		await post.save();

		res.status(200).json(reply);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getFeedPost =async  (req  , res ) => {
    const id = req.user.id;
    const  following = req.user.following;

    try {
        const posts = await  Post.find({userId : {$in:following}}).sort({createdAt : -1});
        res.status(200).json({posts});
    } catch (err) {
        res.status(401).json({msg : err.message})
    }    

    
}
