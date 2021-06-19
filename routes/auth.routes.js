const router = require('express').Router()
const UserModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const checkUser = require("../lib/check")

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

        let user = new UserModel(req.body)

        user.password = await bcrypt.hash(user.password, 10)
        console.log(user)
        await user.save()
        //
        let token = jwt.sign({user : {
                id: user._id
            }},process.env.JWTSECRET, {expiresIn: "7d" })


        res.status(201).json({token})
        // res.status(201).json({message: "user created"})
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
                isAdmin: user.isAdmin
            }},process.env.JWTSECRET,{expiresIn: "7d" })


        res.status(200).json({token})
    }catch (e){
        console.log(e)
        res.status(400).json({message: e})
    }

})

module.exports = router
