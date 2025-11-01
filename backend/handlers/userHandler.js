import userSchema from '../models/user.model.js';
import chatMemberSchema from '../models/chatmember.model.js';
import messageSchema from '../models/message.model.js';

export async function nav(req,res) {
    try {
        const _id=req.user.userId;
        const user=await userSchema.findOne({_id});
        if(!user)
           return res.status(403).send({msg:"Login to continue"});
        return res.status(200).send({user});
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function home(req,res) {
    try {
        const _id=req.user.userId;
        const user=await userSchema.findOne({_id});
        if(!user)
           return res.status(403).send({msg:"Login to continue"});
        const receivers=await chatMemberSchema.find({$or:[{senderId:_id},{receiverId:_id}]});
        const chatMemberPromises = receivers.map(async (receiver) => {
            if(receiver.senderId==_id)
                return await userSchema.findOne({ _id: receiver.receiverId },{username:1,profile:1});
            if(receiver.receiverId==_id)
                return await userSchema.findOne({ _id: receiver.senderId },{username:1,profile:1});
        });
        const members = await Promise.all(chatMemberPromises);
        const chatmembers=Array.from(new Map(members.map(member => [member.username, member])).values()).reverse()  
        
        const countPromises=chatmembers.map(async(member)=>{
            return await messageSchema.countDocuments({senderId:member._id,seen:false})
        })
        const counts=await Promise.all(countPromises);
        const messagePromises=chatmembers.map(async(member)=>{
            return await messageSchema.findOne({$or:[{senderId:_id,receiverId:member._id},{senderId:member._id,receiverId:_id}]},{message:1,seen:1}).sort({ _id: -1 })
        })
        const lmessages=await Promise.all(messagePromises);
        return res.status(200).send({chatmembers,counts,lmessages});
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function profile(req,res) {
    try {
        const _id=req.user.userId;
        const user=await userSchema.findOne({_id},{password:0});
        if(!user)
           return res.status(403).send({msg:"Login to continue"});
        return res.status(200).send(user);
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function editDetails(req,res) {
    try {
        const _id=req.user.userId;
        const {...details}=req.body;
        const update=await userSchema.updateOne({_id},{$set:{...details}});
        return res.status(201).send({msg:"success"});
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function listPeople(req,res) {
    try {
        const _id=req.user.userId;
        const user=await userSchema.findOne({_id});
        if(!user)
           return res.status(403).send({msg:"Login to continue"});
        const people = await userSchema.find({ _id: { $ne: _id } });
        return res.status(200).send({people});
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function userProfile(req,res) {
    try {
        const _id=req.user.userId;
        const {id}=req.params;
        const user=await userSchema.findOne({_id},{password:0});
        if(!user)
           return res.status(403).send({msg:"Login to continue"});
        const userp=await userSchema.findOne({_id:id},{password:0});
        return res.status(200).send(userp);
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}