const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: Number },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    token: { type: String },
    following: { type: [Schema.Types.ObjectId], deafault: [] },
    followers: { type: [Schema.Types.ObjectId], deafault: [] },
    profilePic: { type: String, default: "" },
    bio: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const virtual = userSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

// exports.User = mongoose.model('User', userSchema);
exports.User = mongoose.model("User", userSchema);
