import mongoose from "mongoose"
const {Schema} = mongoose;

const conversationSchema = new Schema({
    converstationId : { type: Schema.Types.ObjectId , ref : "Conversation"},
    meassage : {type : String},
    sender : { type: Schema.Types.ObjectId , ref : "User"}

} , {timestamps:true})

const virtual = converstionSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
converationSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Message = mongoose.model("Message", postSchema);
export default Message;