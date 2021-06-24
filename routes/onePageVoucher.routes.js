const router = require('express').Router();
const UserModel = require("../models/user.model");
const checkUser = require("../lib/check");
const voucherTemplate = require('../lib/voucherTemplate');

router.get('/', checkUser, async (req, res)=>{
    let user = await UserModel.findById(req.user.id)
    let vACount = user.voucherACount
    let vBCount = user.voucherBCount
    let vCCount = user.voucherCCount
    let vDCount = user.voucherDCount
    let userPoints = user.points

    console.log(userPoints)

    try {
        res.status(200).json({
            "available vouchers" : {voucherTemplate}, 
             "voucher A count" : {vACount},
             "voucher B count" : {vBCount},
             "voucher C count" : {vCCount},
             "voucher D count" : {vDCount},
             "user points" : {userPoints}
        })
    } catch (error) {
        res.status(400).json({"message" : error})
    }
})


router.post("/buy", checkUser, async (req,res)=>{
    // test using vouchtemp[req.body.num]
    
    let temp = {
        ...voucherTemplate[req.body.num]
    }
    
    try {
        let user = await UserModel.findById(req.user.id)
        let vACount = user.voucherACount
        let vBCount = user.voucherBCount
        let vCCount = user.voucherCCount
        let vDCount = user.voucherDCount
        let userPoints = user.points
    
        if(userPoints < voucherTemplate[req.body.num].pointsCost){
            throw "Wah lao waste time"
        } else {
            userPoints = Number(userPoints) - Number(voucherTemplate[req.body.num-1].pointsCost);

            switch (req.body.num) {
                case 1:
                    vACount++;
                    break;
            
                case 2:
                    vBCount++;
                    break;

                case 3:
                    vCCount++;
                    break;
                
                case 4:
                    vDCount++;
                    break;
            }
        }


        res.status(200).json({
            "available vouchers" : {voucherTemplate}, 
             "user vouchers" : {userVoucher}
        })
    } catch (error) {
        res.status(400).json({"message" : error})
    }
})




module.exports = router