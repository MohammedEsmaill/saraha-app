import joi from "joi";
import { Types } from "mongoose";

const idValidation = (value , helper)=>{
    const isValid = Types.ObjectId.isValid(value)
    return isValid?value:helper.message(`invalid id : ${value}`)
}
export const genralRules = {
    email:joi.string().email({tlds:{allow:true},maxDomainSegments:3}).messages({"string.email":"email must be a valid email"}),
    password:joi.string().regex(/^[a-zA-Z0-9]{8,30}$/),
    phone:joi.string().regex(/^(010|011|012|015)\d{8}$/),
    id:joi.string().custom(idValidation),
    headers:joi.object({
        token:joi.string().required(),
        'cache-control':joi.string(),
        'postman-token':joi.string(),
        'content-type':joi.string(),
        'content-length':joi.string(),
        host:joi.string(),
        'user-agent':joi.string(),
        accept:joi.string(),
        'accept-encoding':joi.string(),
        connection:joi.string(),
    })
}