import userSchema from '../models/user.model.js';
import chatMemberSchema from '../models/chatmember.model.js';
import messageSchema from '../models/message.model.js';

export async function chat(req, res) {
  try {
    const { rid } = req.params;
    const sid = req.user.userId;

    const user = await userSchema.findById(sid);
    if (!user) return res.status(403).send({ msg: "Login to continue" });

    const unseen = await messageSchema.find({ senderId: rid, receiverId: sid, seen: false });
    if (unseen.length > 0) {
      await messageSchema.updateMany({ senderId: rid, receiverId: sid }, { $set: { seen: true } });
    }

    const receiver = await userSchema.findById(rid, { profile: 1, username: 1 });
    const chats = await messageSchema.find({
      $or: [
        { senderId: sid, receiverId: rid },
        { senderId: rid, receiverId: sid }
      ]
    }).sort({ createdAt: 1 }); // chronological order

    return res.status(200).send({ chats, receiver, uid: sid });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: "error" });
  }
}

export async function addMessage(req, res) {
  try {
    const { rid } = req.params;
    const sid = req.user.userId;
    const { message } = req.body;

    // Ensure chat member exists in either direction
    const chatExists = await chatMemberSchema.findOne({
      $or: [
        { senderId: sid, receiverId: rid },
        { senderId: rid, receiverId: sid }
      ]
    });

    if (!chatExists)
      await chatMemberSchema.create({ senderId: sid, receiverId: rid });

    await messageSchema.create({
      senderId: sid,
      receiverId: rid,
      message,
      seen: false
    });

    return res.status(201).send({ msg: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: "error" });
  }
}

export async function deleteMessage(req, res) {
  try {
    const { _id } = req.params;
    const senderId = req.user.userId;

    const msg = await messageSchema.findOne({ _id, senderId });
    if (!msg)
      return res.status(404).send({ msg: "Cannot delete others message" });

    await messageSchema.deleteOne({ _id, senderId });
    return res.status(201).send({ msg: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: "error" });
  }
}
