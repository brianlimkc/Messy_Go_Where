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
    
    try {
        let user = await UserModel.findById(req.user.id)

        let userPoints = user.points
    
        if(userPoints < voucherTemplate[req.body.num].pointsCost){
            throw "Wah lao waste time"
        } else {
            user.points = Number(userPoints) - Number(voucherTemplate[req.body.num-1].pointsCost);

            switch (req.body.num) {
                case 1:
                    user.voucherACount++;
                    break;
            
                case 2:
                    user.voucherBCount++;
                    break;

                case 3:
                    user.voucherCCount++;
                    break;
                
                case 4:
                    user.voucherDCount++;
                    break;
            }
        }
        
        await user.save()

        res.status(200).json({
            "available vouchers" : {voucherTemplate}, 
             "voucher A count" : user.voucherACount,
             "voucher B count" : user.voucherBCount,
             "voucher C count" : user.voucherCCount,
             "voucher D count" : user.voucherDCount,
             "user points" : user.points
        })
    } catch (error) {
        res.status(400).json({"message" : error})
    }
})


router.post("/redeem", checkUser, async (req,res)=>{
    
    try {
        let user = await UserModel.findById(req.user.id)

            switch (req.body.num) {
                case 1:
                    if(user.voucherACount!==0){
                        user.voucherACount--;
                    } else{
                        throw "wah lao another one"
                    }
                    break;
            
                case 2:
                    if(user.voucherBCount!==0){
                        user.voucherBCount--;
                    } else{
                        throw "wah lao another one"
                    }
                    break;

                case 3:
                    if(user.voucherCCount!==0){
                        user.voucherCCount--;
                    } else{
                        throw "wah lao another one"
                    }
                    break;
                
                case 4:
                    if(user.voucherDCount!==0){
                        user.voucherDCount--;
                    } else{
                        throw "wah lao another one"
                    }
                    break;
            
        }
        
        await user.save()

        res.status(200).json({
            "available vouchers" : {voucherTemplate}, 
             "voucher A count" : user.voucherACount,
             "voucher B count" : user.voucherBCount,
             "voucher C count" : user.voucherCCount,
             "voucher D count" : user.voucherDCount,
             "user points" : user.points
        })
    } catch (error) {
        res.status(400).json({"message" : error})
    }
})




module.exports = router