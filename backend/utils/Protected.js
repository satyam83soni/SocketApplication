const {User } = require('../model/User')


exports.cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

// exports.isAuth = async (req, res, next) => {
//   const token = cookieExtractor(req);
//   try {
//     if (!token) {
//       return res
//         .status(401)
//         .json({ msg: "you are unauthorised login and come again" });
//     }
//     var decoded = jwt.verify(token, process.env.SECRET);
//     if (decoded.username) {
//       const user = User.findOne({ username: decoded.username }).select(
//         "-password"
//       );
//       req.user = user;
//       next();
//     } else {
//       res
//         .status(401)
//         .json({ msg: "you are unauthorised login and come again" });
//     }
//   } catch (er) {
//     res.status(201).json({ msg: "you are uautorised" });
//   }
// };
