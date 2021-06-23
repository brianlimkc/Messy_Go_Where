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


// Only admin can create,later at the router.post can test if user is admin.
router.get("/admin/create", checkUser, async (req, res)=>{
    let vouchers = await VoucherModel.find()
    
    try {
        res.status(200).json({"vouchers" : vouchers})
    } catch (error) {
        res.status(400).json({"error message" : error})
    }
})

// do take note, for admin to create new voucher, please hardcode in voucherTemplate
router.post('/admin/create', checkUser, async (req, res)=>{
    let voucher = new VoucherModel(req.body)
    console.log("this account is admin", req.user.isAdmin)
    try {
        // this is the test for Admin
        // so if user is not admin, then it'll go into the error.
        // reasoning is (!true) -> the code will not run. so will go to the save()
        if(!req.user.isAdmin){
            throw "yo mama"
        }
        await voucher.save()

      res.status(200).json({"new voucher" : voucher})  
    } catch (error) {
        console.log(error)
        res.status(400).json({"message" : error})
    }
})


// This bit of code is for the user to select the voucher. 
//voucher has to be value="num", so req.body.num will have a value.
// please refer to voucherTemplate
router.post('/user', checkUser, async (req, res)=>{
    let temp = {
        ...voucherTemplate[req.body.num],
        issuedTo : req.user.id
    }

    
    try {
        let voucher = new VoucherModel(temp)
        await voucher.save()

        // console.log(voucher)
        
        await UserModel.findByIdAndUpdate(req.user.id, {$push : {voucherList : voucher._id}})
        res.status(200).json({"voucher added" : voucher}) 
    } catch (error) {
        res.status(400).json({"message" : error})
    }
})


module.exports = router
