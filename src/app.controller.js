import cors from "cors"
import checkConnection from "./DB/connectionDB.js";
import messageRouter from "./modules/messages/message.controller.js";
import userRouter from "./modules/users/user.controller.js";
import { globalErrorHandling } from "./utlities/errorHandling.js";
const bootstrap = (app,express)=>{
    app.use(cors())
    app.use(express.json());
    checkConnection()
    app.get("/",(req,res,next)=>{
        return res.status(200).json({msg:"hello on saraha app"})
    })
    app.use("/users",userRouter)
    app.use("/messages",messageRouter)
    app.use("*",(req,res,next)=>{
        return next(new Error(`error invalid url / ${req.originalUrl}`,{cause:404}))
    })
    app.use(globalErrorHandling)
}
export default bootstrap;