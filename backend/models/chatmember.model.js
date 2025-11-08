import mongoose from "mongoose";
const { Schema } = mongoose;

const chatMemberSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// optional: compound index for performance
chatMemberSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

export default mongoose.models.Chatmembers ||
  mongoose.model("Chatmembers", chatMemberSchema);
