import userModel from "../DB/models/users.model.js";
import { asyncHandler } from "../utlities/errorHandling.js";
import { verifyToken } from "../utlities/token/verifyToken.js";
export const authentication = asyncHandler(async (req,res,next)=>{
    const {token} = req.headers;
    if (!token) {
        return next(new Error("token not found ....",{cause:401}))
    }
    const [prefix,myToken] = token.split(" ") || [];
    if (!myToken || !prefix) {
        return next(new Error("token not found ....",{cause:401}))
    }
    let SIGNTURE_TOKEN = undefined;
    if (prefix == "Admin") {
        SIGNTURE_TOKEN = process.env.TOKEN_SIGNTURE_ADMIN;
    }
    else if(prefix == "Bearer"){
        SIGNTURE_TOKEN = process.env.TOKEN_SIGNTURE_USER;
    }else{
        return next(new Error("invalid token prefix",{cause:401}))
    }
    const decoded = verifyToken({token:myToken,signture:SIGNTURE_TOKEN})
    if (!decoded?.userId) {
        return next(new Error("invalid token payload",{cause:403}))
    }
    let user = await userModel.findById(decoded.userId).lean();
    if (!user) {
        return next(new Error("user not found ",{cause:404}))
    }
    if (user.isDeleted) {
        return next(new Error("you are deleted please active your acount",{cause:403}))
    }
    if((user?.passwordChangedAt?.getTime()/1000) > decoded?.iat){
        return next(new Error("expire token please login again",{cause:401}))
    }


    req.user = user;
    next()
    
})
export const authorization = (accessRole)=>{
    return asyncHandler(async (req,res,next)=>{
        if (!accessRole.includes(req.user.role)) {
            return next(new Error("Access denied",{cause:403}))
        }
        next();
})
}
