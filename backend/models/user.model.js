import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    email:{type:String},
    password:{type:String},
    username:{type:String},
    profile:{type:String},
    phone:{type:Number}
})

export default mongoose.model.Users || mongoose.model("User",userSchema);