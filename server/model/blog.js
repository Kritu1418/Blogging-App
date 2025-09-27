import mongoose from "mongoose";

const { Schema, model } = mongoose;

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true }, // Ye zaroori hai naye dashboard ke liye
    image: { type: String, required: true },   // Aapka image field bhi rakha hai
    content: { type: String, required: true },
    // NOTE: Ref ko "Usermodel" kar diya hai, taaki User.js se match ho
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Usermodel", required: true },
  },
  { timestamps: true }
);

export default model("Blog", BlogSchema);