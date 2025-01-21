import userModel from "../../DB/models/users.model.js";
import { asyncHandler } from './../../utlities/errorHandling.js';
import messageModel from './../../DB/models/message.model.js';

// ---------------------------- sendMessage  --------------------------------
export const sendMessage = asyncHandler(async(req,res,next)=>{
    if (!await userModel.findOne({_id:req.body.userId,isDeleted:false})) {
        return next(new Error("this user not registered yet ",{cause:403}))
    }
    const message = await messageModel.create(req.body);
    return res.status(201).json({msg:"done",message})
})

// ---------------------------- getMessage  --------------------------------
export const getMessage = asyncHandler(async(req,res,next)=>{
    const messages = await messageModel.find({userId:req.user._id});
    return res.status(201).json({msg:"done",messages})
})
