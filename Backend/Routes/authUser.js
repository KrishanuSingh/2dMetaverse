const express = require('express');
const zod = require('zod');
const router = express.Router();

const User = require('../database');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config');
const bcrypt = require('bcrypt');
const authMiddleware = require('../authMiddleware');
const {VerifyEmail} = require('../verification/tokensender');



const UserSchema = zod.object({
    username: zod.string(),
    email: zod.string().email(),
    password: zod.string()
})

router.post("/signup", async(req,res)=>{
 try{   
    const body = req.body;
    const parsedBody = UserSchema.safeParse(body);
    if(!parsedBody.success){
        return res.status(411).json({
            message: "invalid input"
        })
    }
    else{
        const checkUsername = await User.findOne({
            username: req.body.username
        })
        if(checkUsername){
            return res.json({
                message:"Username already exists"
            })
        }
    try{
        await VerifyEmail(body);
        res.status(200).json({
            message:"Verification mail sent"
        });
    }
        catch(err){
            console.error("error sending verification mail",err)
            res.status(500).json({
                message: "some error has occured"
            })

        }
    }
 } catch(err){
    console.error(err);
    res.status(500).send("Internal Server Error");
 }

})

router.get('/verify/:token', async(req,res)=>{
  try{
    const token = req.params.token;

    const decoded = jwt.verify(token, JWT_SECRET);
    const hashedpass = await bcrypt.hash(decoded.password,10);
    const dbUser = await User.create({
        username: decoded.username,
        email: decoded.email,
        password: hashedpass
    });

    const userId = dbUser._id;

    const token2 = jwt.sign({userId: userId},JWT_SECRET);
    res.json({
        message: "login successful",
        token: token2
    })
}catch(err){
    console.log(err);
    res.send(500).send("internal server error");
}


})
router.post('/signin',async(req,res)=>{
  try{
    const username = req.body.username;
    const password = req.body.password;

    const check = await User.findOne({
        username:username,
    })
    if(!check){
        return res.status(411).json({
            message:"Invalid Username"
        })
    }
    else{
        const passValid = await bcrypt.compare(password, check.password);
        if(!passValid){
            return res.json({
                message:"Invalid Password"
            })
        }
        const UserId = check._id;
        const token = jwt.sign({UserId:UserId},JWT_SECRET);
        return res.status(200).json({
            message:"login successfull",
            token:token
        })
    }
  }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
     }
})
router.put('/updateUser',authMiddleware, async(req,res)=>{
  try{
    const body = req.body;
    const safebody = UserSchema.safeParse(body);
    if(!safebody.success){
        return res.status(411).json({
            message: "invalid input"
        })
    }    
    const hashedpass = await bcrypt.hash(req.body.password,10);
    await User.updateOne(body._id,{
        username:body.username,
        password:hashedpass,
        email:body.email

    })
    res.json({
        message:"update successful"
    })
}catch(err){
    console.error(err);
    res.status(500).send("Internal Server Error");
 }
})

router.delete('/delete', authMiddleware, async(req,res)=>{
  try{
    const queryId = req.userId;
    const findId = await User.findByIdAndDelete({queryId});
    if(findId){
        return res.json({
            message: findId + "user deleted"
        })
    }
    else{
        return res.json({
            message: "user not found"
        })
    }
 }catch(err){
    console.error(err);
    res.status(500).send("Internal Server Error");
 }
})

router.get('/getprofiles',authMiddleware, async(req,res)=>{
  try{
    const queryId = req.query.id;
    const users = await User.find({
        username:{ "regex": queryId }
    })
    res.json({
        user:users.map(user=>({
            username: user.username,
            email: user.email
        }))
    })
  }catch(err){
    console.error(err);
    res.status(500).send("Internal Server Error");
 }
})

module.exports = router;