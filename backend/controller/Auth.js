const { User } = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  const user = new User(req.body);
  const token = jwt.sign({ username: req.body.username }, process.env.SECRET, {
    expiresIn: "15d",
  });
  const hashed = bcrypt.hashSync(user.password, 10);
  user.password = hashed;
  user.token = token;
  try {
    const doc = await user.save();
    res
      .cookie("jwt", token, {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        samesite: "strict",
      })
      .status(201)
      .json({
        name: doc.name,
        username: doc.username,
        token: token,
      });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(401).json({ msg: "Please create an account" });
  }

  try {
    const isAuth = bcrypt.compareSync(req.body.password, user.password);
    if (isAuth) {
      const token = jwt.sign({ username: user.username }, process.env.SECRET, {
        expiresIn: "15d",
      });
      res
        .cookie("jwt", token, {
          expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          httpOnly: true,
          samesite: "strict",
        })
        .status(201)
        .json({ name: user.name, username: user.username, token: token });
    } else {
      res.status(401).json({ message: "unauthorised" });
    }
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};
