const { User } = require("../model/User");
const bcrypt = require("bcrypt");

exports.getUser = async (req, res) => {
  const { id } = req.params;
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

exports.followUnfollowUser = async (req, res) => {
  const id  = req.params.id;
  const currentUser = await User.findById(req.user.id);
  try {
    const user = await User.findById(id);
    if (toString(currentUser.id) === id) {
      return res.status(400).json({ msg: "you cannot follow youself" });
    }

    if (!user || !currentUser) {
      return res.status(400).json({ msg: "user not found" });
    }

    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      await User.findByIdAndUpdate(currentUser.id, {
        $pull: { following: id },
      });
      await User.findByIdAndUpdate(id, {
        $pull: { followers: currentUser.id },
      });
      res.status(201).json({ msg: "unfollowed succesfully" });
    } else {
      await User.findByIdAndUpdate(currentUser.id, {
        $push: { following: req.params.id },
      });
      await User.findByIdAndUpdate(req.params.id, {
        $push: { followers: currentUser.id },
      });
      res.status(201).json({ msg: "followed succesfully" });
    }
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.updateUser = async (req, res) => {
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
