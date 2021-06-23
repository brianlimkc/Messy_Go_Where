const router = require('express').Router();
const VoucherModel = require("../models/voucher.model");
const UserModel = require("../models/user.model");
const checkUser = require("../lib/check");


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
        res.status(200).json({"error message" : error})
    }
})


router.post('/admin/create', async (req, res)=>{
    let voucher = new VoucherModel(req.body)
    await voucher.save()
    await UserModel.findByIdAndUpdate(req.body.id, {$push : {vouchers : voucher.voucherId}})

    try {
      res.status(200).json({"new voucher" : voucher})  
    } catch (error) {
        res.status(200).json({"message" : error})
    }
})



module.exports = router
