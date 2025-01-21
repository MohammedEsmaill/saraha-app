import userModel from "../../DB/models/users.model.js";
import { asyncHandler , eventEmitter , compare, Hash , decrypt, encrypt , generateToken , verifyToken  } from "../../utlities/index.js";

// ------------------- signUP ------------------------
export const signUp = asyncHandler(async (req,res,next)=>{
        const {name,email,password,phone,age} = req.body;
        // check if user already exist
        const users = await userModel.findOne({email:email});
        if (users) {
            return next(new Error("user already exist",{cause:500}))
        }
        // hahsing the password
        const hash = await Hash({key:password , SALT_ROUNDS:process.env.SALT_ROUNDS})
        // encrypt phone
        const cipherPhone = encrypt({key:phone,SECRET_KEY:process.env.SECRET_KEY})
        // send email confirmation link
        eventEmitter.emit("sendEmail",{email})
        // send req to db
        const user = await userModel.create({name,email,password:hash,phone:cipherPhone,age});
        return res.status(201).json({msg:"user created successfully",user});

})

// ------------------- confirmEmail ------------------------

export const confirmEmail = asyncHandler(async (req,res,next)=>{
    const {token} = req.params;
    if (!token) {
        return next(new Error("token not found ....",{cause:400}))
    }
    // get user data from token
    const decoded = verifyToken({token:token,signture:process.env.CONFIRM_EMAIL_SIGTRUE})
    if (!decoded?.email) {
        return next(new Error("invalid sigture",{cause:400}))
    }
    // confirm user status
    const user = await userModel.findOneAndUpdate({email:decoded.email,confirmed:false},{confirmed:true});
    if (!user) {
        return next(new Error("user not found or already confirmed ..!?",{cause:400}))
    }
    return res.status(200).json({msg:"done"});
})

// ------------------- Login ------------------------

export const logIn =asyncHandler( async (req,res,next)=>{
    const {email,password} = req.body;
    // ckeck if user not exist
    const user = await userModel.findOne({email:email});
    if (!user) {
        return next(new Error("Invalid email",{cause:400}))
    }
    // check if user not confirmed
    if (user.confirmed == false) {
        return next(new Error("You are not confirmed yet",{cause:400}))
    }
    // check if user not confirmed
    if (user.isDeleted) {
        return next(new Error("Youre acount deleted please active your acount",{cause:400}))
    }
    // check the password matched or not
    const passwordExist = await compare({key:password,hashed:user.password})
    if (!passwordExist) {
        return next(new Error("Invalid password",{cause:400}))
    }
    // generate user token
    var token = generateToken({payload:{ userId: user._id },signture:user.role == "user"?process.env.TOKEN_SIGNTURE_USER:process.env.TOKEN_SIGNTURE_ADMIN,expiresIn:{ expiresIn: 60 * 60 }})
    return res.status(200).json({msg:"user logedIn successfully",token});
})

// ------------------- GetUserData ------------------------

export const getUser = asyncHandler( async (req,res,next)=>{
    const user = req.user;
    // decrypt user phone
    const phone = decrypt({key:user.phone,SECRET_KEY:process.env.SECRET_KEY})
    return res.status(200).json({msg:"Done", ...user,phone});
})

// ------------------- updateUserData ------------------------

export const updateUser = asyncHandler( async (req,res,next)=>{
    // encrypt phone
    if (req.body.phone) {
        req.body.phone = await encrypt({key:req.body.phone,SECRET_KEY:process.env.SECRET_KEY})
    }
    // update user data
    const user = await userModel.findByIdAndUpdate(req.user._id , req.body , {new:true})
    return res.status(200).json({msg:"Done",user});
})

// ------------------- updateUserPaasword ------------------------

export const updateUserPassword = asyncHandler( async (req,res,next)=>{
    const {password,newPassword} = req.body; 
    // compare the password
    if (!await compare({key:password,hashed:req.user.password})) {
        return next(new Error("password not matched",{cause:400}))
    }
    // hash new password
    const hashed = Hash({key:newPassword,SALT_ROUNDS:process.env.SALT_ROUNDS})
    const updatedUser = await userModel.findByIdAndUpdate(req.user._id ,{password : hashed,passwordChangedAt:Date.now()})
    return res.status(200).json({msg:"Done",updatedUser});
})

// ------------------- freezeAcount ------------------------

export const freezeAcount = asyncHandler( async (req,res,next)=>{
    // find acount then softDelete()
    const user = await userModel.findByIdAndUpdate(req.user._id ,{isDeleted:true,passwordChangedAt:Date.now()},{new:true})
    return res.status(200).json({msg:"Done",user});
})

// ------------------- Share profile ------------------------

export const shareProfile = asyncHandler( async (req,res,next)=>{
    const user = await userModel.findById(req.params.id).select("name email -_id");
    return user?res.status(200).json({msg:"Done",user}):next(new Error("user not found ",{cause:404}));
})