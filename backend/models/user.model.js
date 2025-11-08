import mongoose from "mongoose"; 
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    profile: { type: String },
    phone: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
