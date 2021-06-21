const router = require('express').Router()
const UserModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const checkUser = require("../lib/check")
const { cloudinary } = require('../lib/cloundinary')
const { nanoid } = require('nanoid')

router.get('/user', checkUser, async(req, res) => {
    try{
        let user = await UserModel.findById(req.user.id, "-password")
        res.status(200).json({user})
    }catch(e){
        res.status(500).json({ message: "something went wrong"})
    }
})
//
router.post('/register', async (req, res) => {
    try {
            let emailSearch = await UserModel.findOne({email: req.body.email});
            if (emailSearch) {
                // throw "Email already exist!"
                res.status(400).json({message: "Duplicate email. Please use another email."});
            } else {

                let user = new UserModel(req.body)
                user.password = await bcrypt.hash(user.password, 10)
                let newNanoId = await nanoid(8).toUpperCase()
                user.id = `${(user.userType === "User") ? "U-" : "S-"}${newNanoId}`
                user.isAdmin = false
                console.log(user)
                await user.save()
                //
                let token = jwt.sign({
                    user: {
                        id: user._id,
                        userType: user.userType,
                        isAdmin: user.isAdmin
                    }
                }, process.env.JWTSECRET, {expiresIn: "7d"})

                res.status(201).json({token})
            }
    } catch (e) {
        console.log(e)
        res.status(400).json({message: "user not created"})
    }
})
//
router.post('/login', async(req, res) => {
    try{
        let user = await UserModel.findOne({email: req.body.email})
        //if user is empty
        if(!user){
            throw "user not found"
        }
        //if password is not a match
        if(!user.validPassword(req.body.password)){
            throw "check user password"
        }

        //sign the token
        //process.env.JWTSECRET

        let token = jwt.sign({user : {
                id: user._id,
                userType: user.userType,
                isAdmin: user.isAdmin
            }},process.env.JWTSECRET,{expiresIn: "7d" })

        res.status(200).json({token})
    }catch (e){
        console.log(e)
        res.status(400).json({message: e})
    }

})

router.post('/upload', async (req, res) => {
    try {
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'MGW_profilePic',
        });
        console.log(uploadResponse);
        res.status(201).json(uploadResponse);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
})

module.exports = router
