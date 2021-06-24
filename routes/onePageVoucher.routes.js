const router = require('express').Router();
const UserModel = require("../models/user.model");
const checkUser = require("../lib/check");
const voucherTemplate = require('../lib/voucherTemplate');

router.get('/', checkUser, async (req, res)=>{
    let userVoucher = await UserModel.findById(req.user.id).populate("voucherType")

    console.log("what is this",userVoucher)
    try {
        res.status(200).json({
            "available vouchers" : {voucherTemplate}, 
             "user vouchers" : {userVoucher}
        })
    } catch (error) {
        res.status(400).json({"message" : error})
    }
})


router.post("/", checkUser, async (req,res)=>{
    let temp = {
        ...voucherTemplate[req.body.num]
    }

    try {
        res.status(200).json({
            "available vouchers" : {voucherTemplate}, 
             "user vouchers" : {userVoucher}
        })
    } catch (error) {
        res.status(400).json({"message" : error})
    }
})




module.exports = router