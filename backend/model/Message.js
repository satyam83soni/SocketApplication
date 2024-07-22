import mongoose from "mongoose"
const {Schema} = mongoose;

const messageSchema = new Schema({
    converstationId : { type: Schema.Types.ObjectId , ref : "Conversation"},
    meassage : {type : String},
    sender : { type: Schema.Types.ObjectId , ref : "User"}

} , {timestamps:true})

const virtual = messageSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
messageSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Message = mongoose.model("Message", meassageSchema);
export default Message;