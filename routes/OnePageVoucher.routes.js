const router = require('express').Router();
const UserModel = require("../models/user.model");
const checkUser = require("../lib/check");
const voucherTemplate = require('../lib/voucherTemplate');

router.get('/', checkUser, async (req, res)=>{
    let user = await UserModel.findById(req.user.id)

    try {
        res.status(200).json({
            "availableVouchers" : {voucherTemplate},
            "voucherACount" : user.voucherACount,
            "voucherBCount" : user.voucherBCount,
            "voucherCCount" : user.voucherCCount,
            "voucherDCount" : user.voucherDCount,
            "userPoints" : user.points
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
            user.points = Number(userPoints) - Number(voucherTemplate[req.body.num].pointsCost);

            switch (req.body.num) {
                case 0:
                    user.voucherACount++;
                    break;

                case 1:
                    user.voucherBCount++;
                    break;

                case 2:
                    user.voucherCCount++;
                    break;

                case 3:
                    user.voucherDCount++;
                    break;
            }
        }

        await user.save()

        res.status(200)
    } catch (error) {
        res.status(400).json({"message" : error})
    }
})


router.post("/redeem", checkUser, async (req,res)=>{

    try {
        let user = await UserModel.findById(req.user.id)

        switch (req.body.num) {
            case 0:
                if(user.voucherACount!==0){
                    user.voucherACount--;
                } else{
                    throw "wah lao another one"
                }
                break;

            case 1:
                if(user.voucherBCount!==0){
                    user.voucherBCount--;
                } else{
                    throw "wah lao another one"
                }
                break;

            case 2:
                if(user.voucherCCount!==0){
                    user.voucherCCount--;
                } else{
                    throw "wah lao another one"
                }
                break;

            case 3:
                if(user.voucherDCount!==0){
                    user.voucherDCount--;
                } else{
                    throw "wah lao another one"
                }
                break;

        }

        await user.save()

        res.status(200).json({
            "availableVouchers" : {voucherTemplate},
            "voucherACount" : user.voucherACount,
            "voucherBCount" : user.voucherBCount,
            "voucherCCount" : user.voucherCCount,
            "voucherDCount" : user.voucherDCount,
            "userPoints" : user.points
        })
    } catch (error) {
        res.status(400).json({"message" : error})
    }
})

module.exports = router
