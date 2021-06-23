const router = require('express').Router();
const VoucherModel = require("../models/voucher.model");
const UserModel = require("../models/user.model");
const checkUser = require("../lib/check");
const voucherTemplate = require('../lib/voucherTemplate')


// Getting all vouchers info (currently returns empty array.)
router.get('/', async (req,res) => {
    let allVouchers = await VoucherModel.find()

    try {
        res.status(200).json({allVouchers})
    } catch (error) {
        res.status(400).json({"message": error})
    }
})

router.get("/admin/create", checkUser, async (req, res)=>{
    let vouchers = await VoucherModel.find()
    
    try {
        res.status(200).json({"vouchers" : vouchers})
    } catch (error) {
        res.status(400).json({"error message" : error})
    }
})


router.post('/admin/create', checkUser, async (req, res)=>{
    let voucher = new VoucherModel(req.body)
    console.log("this account is admin", req.user.isAdmin)
    try {
        if(!req.user.isAdmin){
            throw "yo mama"
        }
        await voucher.save()
        // await UserModel.findByIdAndUpdate(req.body.id, {$push : {vouchers : voucher.voucherId}})

      res.status(200).json({"new voucher" : voucher})  
    } catch (error) {
        console.log(error)
        res.status(400).json({"message" : error})
    }
})

router.post('/user', checkUser, async (req, res)=>{
    let temp = {
        ...voucherTemplate[req.body.num],
        issuedTo : req.user.id
    }

    
    try {
        let voucher = new VoucherModel(temp)
        await voucher.save()
        // let user = await UserModel.find();
        // let findUserId;
        // console.log(req.user)
        // user.map(el=>{
        //     el._id==req.user.id ? findUserId=el.id : false
        // })
        
        // if(!findUserId){
        //     throw "good morning loser"
        // }
        console.log(voucher)
        
        await UserModel.findByIdAndUpdate(req.user.id, {$push : {voucherList : voucher._id}})
        res.status(200).json({"voucher added" : voucher}) 
    } catch (error) {
        res.status(400).json({"message" : error})
    }
})


module.exports = router
