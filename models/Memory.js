import mongoose from "mongoose";

const memorySchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User" 
  },
  username: {type: String},
  title: String,
  message: String,
  tags: {type: Array},
  img: String,
  likes: {type: Array},

},{
    timestamps: true
});

const Memory = mongoose.model("Memory", memorySchema);

export default Memory;
