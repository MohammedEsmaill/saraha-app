import mongoose from "mongoose"
const messageSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    }
},{
    timestamps:true
})
const messageModel = mongoose.models.message || mongoose.model("message",messageSchema);
export default messageModel;