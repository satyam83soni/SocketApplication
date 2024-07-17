import  User  from "../model/User.js";
import bcrypt from "bcrypt"
export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id)
      .select("-password")
      .select("-updatedAt");
    if (!user) return res.status(400).json({ msg: "user not found" });
    res
      .status(201)
      .json({
        name: user.name,
        username: user.username,
        profilePic: user.profilePic,
        followers: user.followers,
        following: user.following,
        bio  :user.bio,
      });
  } catch (error) {
    res.status(400).json({ msg: "user not found" });
  }
};

export const followUnfollowUser = async (req, res) => {
	try {
		const { id } = req.params;
		const userToModify = await User.findById(id);
    console.log(userToModify);
		const currentUser = req.user;
		if (id === toString(req.user._id))
			return res.status(400).json({ error: "You cannot follow/unfollow yourself" });

		if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });
    console.log (id);
		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			// Unfollow user
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
			res.status(200).json({ message: "User unfollowed successfully" });
		} else {
			// Follow user
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
			res.status(200).json({ message: "User followed successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in followUnFollowUser: ", err.message);
	}
};


export const updateUser  = async (req, res) => {
  const { email, name, password, bio, profilePic, username } = req.body;
  if (req.params.id !== req.user.id.toString())
    return res.status(201).json({ msg: "bad request" });
  try {
    let user = await User.findById(req.user.id);
    if (password) {
      const newPassword = bcrypt.hashSync(password, 10);
      user.password = newPassword;
    }
    user.username = username || user.username;
    user.email = email || user.email;
    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.profilePic = profilePic || user.profilePic;
    const doc = await user.save();
    res.status(201).json({
      email: doc.email,
      name: doc.name,
      bio: doc.bio,
      profilePic: doc.profilePic,
      username: doc.username,
    });
  } catch (err) {
    res.status(400).json({ msg: err.msg });
  }
};
