import bcrypt from "bcrypt";
import pkg from "jsonwebtoken";
import nodemailer from "nodemailer";
const {sign}=pkg;
const transporter = nodemailer.createTransport({
   service:"gmail",
    auth: {
      user: "felixmathewt@gmail.com",
      pass: "qwvy rccu lwjz rmal",
    },
});

import userSchema from './models/user.model.js';
import chatMemberSchema from "./models/chatmember.mode.js";
import messageSchema from './models/message.model.js';

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
        const chatMembers = await Promise.all(chatMemberPromises);
        return res.status(200).send({chatMembers});
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

export async function chat(req,res) {
    try {
        const {rid}=req.params;
        const sid=req.user.userId;
        const user=await userSchema.findOne({_id:sid});
        if(!user)
           return res.status(403).send({msg:"Login to continue"});
        const receiver=await userSchema.findOne({_id:rid},{profile:1,username:1})
        const chats=await messageSchema.find({$or:[{senderId:sid,receiverId:rid},{senderId:rid,receiverId:sid}]});
        
        return res.status(200).send({chats,receiver,uid:sid});
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function addMessage(req,res) {
    try {
        const {rid}=req.params;
        const sid=req.user.userId;
        const {message,date,time}=req.body;
        const chatmember=await chatMemberSchema.findOne({senderId:sid,receiverId:rid});
        if(!chatmember)
           await chatMemberSchema.create({senderId:sid,receiverId:rid})
        const chats=await messageSchema.create({senderId:sid,receiverId:rid,message,date,time});
        return res.status(201).send({msg:"success"});
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function signUp(req,res) {
  try {
      const {email,password,username,cpassword,phone,profile}=req.body;
      
      if(!(email&&username&&password&&cpassword&&phone&&profile))
          return res.status(404).send({msg:"fields are empty"});

      if(password!==cpassword)
          return res.status(404).send({msg:"password not matched"})
      bcrypt.hash(password,10).then((hashedPassword)=>{
        userSchema.create({email,username,password:hashedPassword,phone,profile}).then(()=>{
              return res.status(201).send({msg:"success"});
          }).catch((error)=>{
              return res.status(404).send({msg:"Not registered"})
          })
      }).catch((error)=>{
          return res.status(404).send({msg:"error"}); 
      })
  } catch (error) {
      return res.status(404).send({msg:"error"});
  }
}

export async function signIn(req,res) {
    try {
  const {email,password}=req.body;  

  if(!(email&&password))
      return res.status(404).send({msg:"feilds are empty"})

  const user=await userSchema.findOne({email})
  if(user===null)
      return res.status(404).send({msg:"invalid email"})

  //convert to hash and compare using bcrypt
  const success=await bcrypt.compare(password,user.password);
  if(success!==true)
      return res.status(404).send({msg:"email or password is invalid"})
  //generate token using sign(JWT key)
  const token=await sign({userId:user._id},process.env.JWT_KEY,{expiresIn:"24h"});
  return res.status(200).send({msg:"Succefully logged in",token})
    } catch (error) {
        return res.status(404).send({msg:"error"});
    }
}

export async function forgotPassword(req,res) {
    const {email}=req.body;
    
      try {
          const user=await userSchema.findOne({email});
          if(!user)
              res.status(403).send({msg:"User not found"});
      // send mail with defined transport object
        const info = await transporter.sendMail({
            from: `"Hai 👻" <${email}>`, // sender address
            to: `${email}`, // list of receivers
            subject: "Change Password", // Subject line
            text: "Confirm your account", // plain text body
            html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                color: #333;
            }
            .email-container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #fff;
                border: 1px solid #ddd;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
            }
            .btn {
                display: inline-block;
                background-color: #4CAF50;
                color: #fff;
                text-decoration: none;
                padding: 15px 30px;
                margin-top: 20px;
                border-radius: 4px;
                font-size: 18px;
                text-align: center;
            }
        </style>
      </head>
      <body>
  
        <div class="email-container">
            <p>Hello,</p>
            <p>Please confirm your email address by clicking the button below and change password.</p>
            <a href="http://localhost:5173/newpassword" class="btn">Change Your Password</a>
        </div>
  
      </body>
      </html>`, // html body
        });
      // console.log("Message sent: %s", info.messageId);
      // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  
          return res.status(201).send({msg:"Check your mail",email});
      } catch (error) {
          return res.status(404).send({msg:"error"});
      }
  }
  
  export async function changePassword(req,res) {
      try {
          const {email,npassword,cpassword}=req.body;  
          if(!(email&&npassword&&cpassword))
              return res.status(404).send({msg:"feilds are empty"})
  
          const user=await userSchema.findOne({email})
          if(user===null)
              return res.status(404).send({msg:"invalid email"})
          if(npassword!==cpassword)
              return res.status(404).send({msg:"password not matched"})
          //convert to hash and compare using bcrypt
          const success=await bcrypt.compare(npassword,user.password);
          if(success===true)
              return res.status(404).send({msg:"Same password"})
          bcrypt.hash(npassword,10).then((hashedPassword)=>{
              userSchema.updateOne({email},{$set:{password:hashedPassword}}).then(()=>{
                  return res.status(201).send({msg:"success"});
              }).catch((error)=>{
                  return res.status(404).send({msg:"Not registered"})
              })
          }).catch((error)=>{
              return res.status(404).send({msg:"error"}); 
          })
      } catch (error) {
          return res.status(404).send({msg:"error"});
      }
  }  