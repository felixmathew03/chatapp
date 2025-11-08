import mongoose from "mongoose";
import User from "../models/user.model.js";
import ChatMember from "../models/chatmember.model.js";
import Message from "../models/message.model.js";

/* ===========================================================
   🟢 NAVBAR — Fetch logged-in user info
   =========================================================== */
export async function nav(req, res) {
  try {
    const _id = req.user.userId;
    const user = await User.findById(_id).select("-password");
    if (!user) return res.status(403).json({ msg: "Login to continue" });

    return res.status(200).json({ user });
  } catch (error) {
    console.error("nav() error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}

/* ===========================================================
   🟣 HOME — Chat list, last message, unread count
   =========================================================== */
export async function home(req, res) {
  try {
    const _id = new mongoose.Types.ObjectId(req.user.userId);

    // Ensure user exists
    const user = await User.findById(_id);
    if (!user) return res.status(403).json({ msg: "Login to continue" });

    // Aggregate chats with last message & unread counts
    const chatmembers = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: _id }, { receiverId: _id }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$senderId", _id] }, "$receiverId", "$senderId"],
          },
          lastMessage: { $first: "$message" },
          lastMessageAt: { $first: "$createdAt" },
          lastMessageSeen: { $first: "$seen" },
          lastMessageSender: { $first: "$senderId" },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$receiverId", _id] }, { $eq: ["$seen", false] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          user: { _id: 1, username: 1, profile: 1 },
          lastMessage: 1,
          lastMessageAt: 1,
          lastMessageSeen: 1,
          lastMessageSender: 1,
          unreadCount: 1,
        },
      },
      { $sort: { lastMessageAt: -1 } },
    ]);

    return res.status(200).json({ chatmembers });
  } catch (error) {
    console.error("home() error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}

/* ===========================================================
   🟠 PROFILE — Fetch current user profile
   =========================================================== */
export async function profile(req, res) {
  try {
    const _id = req.user.userId;
    const user = await User.findById(_id).select("-password");
    if (!user) return res.status(403).json({ msg: "Login to continue" });

    return res.status(200).json(user);
  } catch (error) {
    console.error("profile() error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}

/* ===========================================================
   🟢 EDIT DETAILS — Update user info
   =========================================================== */
export async function editDetails(req, res) {
  try {
    const _id = req.user.userId;
    const updates = req.body;

    await User.updateOne({ _id }, { $set: updates });
    return res.status(200).json({ msg: "Profile updated successfully" });
  } catch (error) {
    console.error("editDetails() error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}

/* ===========================================================
   🔵 LIST PEOPLE — All users except logged-in
   =========================================================== */
export async function listPeople(req, res) {
  try {
    const _id = req.user.userId;
    const user = await User.findById(_id);
    if (!user) return res.status(403).json({ msg: "Login to continue" });

    const people = await User.find({ _id: { $ne: _id } }).select("-password");
    return res.status(200).json({ people });
  } catch (error) {
    console.error("listPeople() error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}

/* ===========================================================
   🟣 USER PROFILE — View another user’s profile
   =========================================================== */
export async function userProfile(req, res) {
  try {
    const _id = req.user.userId;
    const { id } = req.params;

    const currentUser = await User.findById(_id);
    if (!currentUser) return res.status(403).json({ msg: "Login to continue" });

    const userp = await User.findById(id).select("-password");
    if (!userp) return res.status(404).json({ msg: "User not found" });

    return res.status(200).json(userp);
  } catch (error) {
    console.error("userProfile() error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}
