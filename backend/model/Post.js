const mongoose = require("mongoose");

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String },
    image: { type: String },
    likes: { type: [Schema.Types.ObjectId] , ref: "User", default:[]  },

    comments: [
      {
        commenterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        username: { type: String, required: true },
        text: { type: String, required: true },
        commenterImage: { type: String },
        
      },
    ],
  },
  {
    timestamps: true,
  }
);

const virtual = postSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
postSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Post = mongoose.model("Post", postSchema);
