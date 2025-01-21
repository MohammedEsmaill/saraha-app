import mongoose from "mongoose"
export const roles = {
    user:"user",
    admin:"admin"
}
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        match:/^(?!.*\.{2})[a-zA-Z0-9][a-zA-Z0-9#$%&\*\+-/=\?\_`|~]*@[a-zA-Z0-9][a-zA-Z0-9-_.]*\.[a-zA-Z]{2,4}$/
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true,
        min:18,
        max:60
    },
    confirmed:{
        type:Boolean,
        default: false
    },
    role:{
        type:String,
        enum : [roles.admin,roles.user],
        default:roles.user
    },
    passwordChangedAt : Date,
    isDeleted:{
        type:Boolean,
        default:false
    }
})

const userModel = mongoose.models.Users || mongoose.model("Users",userSchema);
export default userModel;