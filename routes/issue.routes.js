const router = require('express').Router()
const IssueModel = require('../models/issue.model')
const UserModel = require('../models/user.model')
const issueUpdateModel = require('../models/issueUpdates.model')
const globalCaseStatusModel = require('../models/globalCaseStatus.model')
const checkUser = require('../lib/check')
const { cloudinary } = require('../lib/cloundinary')
const { nanoid } = require('nanoid')
const globalCaseStatusID = "60d04a0f21a73227222ac063"
require('dotenv').config()

/*
Individual User
*/

//(Tested) for staff - get “/issue” – get user info – name, email, point, pending cases, resolved cases
router.get('/', async (req, res) => {
    let globalArrayOfIssues = await IssueModel.find()
        .populate("IssueUpdate")
        .populate("userID")
        .populate("staffID")
    try {
        res.status(200).json({globalArrayOfIssues})
    } catch (e)
    {
        console.log(e)
        res.status(400).json({"message" : e})
    }
})

//For individual user (UserId) Get their own issues array
router.get('/user/home', checkUser, async(req, res) => {
    try {
        let user = await UserModel.find({_id: req.user.id})
        .populate("pendingIssues")
        .populate("closedIssues")
        // .populate("voucherList")
        console.log(user)
        //let individualIssuesArray =
        res.status(200).json({user})
    } catch (e) {
        console.log(e)
        res.status(400).json({"message": e})
    }
})

//User Issue Form - Post request Can do up the issue form now
router.post('/submit', checkUser, async (req, res) => {
    const newIssue = new IssueModel(req.body)
    // console.log(req.headers) left it here so I can explain that it go thru middleware, remove next time
    newIssue.userID = req.user.id
    newIssue.issueID = `Ref-${nanoid(8).toUpperCase()}`



    //IssueUpdates
    const newIssueUpdate = new issueUpdateModel()
    newIssueUpdate.date = new Date() //has both date and time or let it be split
    // newIssueUpdate.update = //update description - To be filled in at staff form
    newIssueUpdate.userID = req.user.id
    newIssueUpdate.issueID = newIssue._id

    //push new issue into pending Issue array for both global and user
    newIssue.updates = newIssueUpdate._id



    console.log(newIssueUpdate)
    console.log("newIssueId", newIssue)
    try {
        await newIssue.save()
        await newIssueUpdate.save()
        // await globalCaseStatusModel.findByIdAndUpdate(process.env.GLOBSTATUS, {$push: { openIssues: newIssue._id}})
        await globalCaseStatusModel.findByIdAndUpdate(globalCaseStatusID, {$push: { openIssues: newIssue._id}})
        
        await UserModel.findByIdAndUpdate(req.user.id, {$push: { pendingIssues: newIssue._id}})

        res.status(201).json({newIssue})
    } catch(e){
        console.log(e)
        res.status(400).json({"message" : e})
    }
})


//User pending issue
router.get('/pending', checkUser, async(req, res) => {
    try {
        let user = await UserModel.find({_id: req.user.id})
            .populate("pendingIssues")
        console.log(user)

        res.status(200).json({user})
    } catch (e) {
        console.log(e)
        res.status(400).json({"message": e})
    }
})


//User closed issue
router.get('/closed', checkUser, async(req, res) => {
    try {
        let user = await UserModel.find({_id: req.user.id})
            .populate("closedIssues")
        // .populate("voucherList")
        console.log(user)
        //let individualIssuesArray =

        res.status(200).json({user})
    } catch (e) {
        console.log(e)
        res.status(400).json({"message": e})
    }
})


//stopped here cuz
router.get('/issue/:id', checkUser, async(req, res) => {
    try {
        let user = await UserModel.find({_id: req.user.id})
            .populate("closedIssues")
        // .populate("voucherList")
        console.log(user)
        //let individualIssuesArray =

        res.status(200).json({user})

          } catch (e) {
        console.log(e)
        res.status(400).json({"message": e})
    }
})

//User - View Individual updates for User usertype
router.get('/single/:issueid', checkUser, async(req, res) => {
    let thisIssueId = req.params.issueid
    // console.log(issueId)
    try {
        let singleIssue = await IssueModel.findById(thisIssueId)
            .populate("updates")

        // let user = await UserModel.find({_id: req.user.id})
        //
        // let pendIssue = user[0]["pendingIssues"]
        // let closedIssue = user[0]["closedIssues"]
        //
        // //leaving these consolelogs to explain later
        // // console.log(pendIssue.includes(thisIssueId))
        // // console.log(closedIssue.includes(thisIssueId))
        // let currentIssue = [] //might need better naming
        // if (pendIssue.includes(thisIssueId) || closedIssue.includes(thisIssueId)){
        //      currentIssue = await IssueModel.findById({_id: thisIssueId}) // change if we use our own issueid
        //         .populate("updates")
        //     // .populate("voucherList")
        //     console.log(currentIssue)
        // } else {
        //     throw "issue not found for this user."
        // }
        console.log("singleIssue retrieved")
        res.status(200).json({singleIssue})
    } catch (e) {
        console.log(e)
        res.status(400).json({"message": e})
          }
})


// photo upload
router.post('/upload', async (req, res) => {
    try {
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'MGW_issuesPic',
        });
        console.log(uploadResponse);
        res.status(201).json(uploadResponse);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });

    }
})

/*
Staff
Staff
Staff
Staff
*/

//(Tested) for staff - get “/issue” – get user info – name, email, point, pending cases, resolved cases
router.get('/global',checkUser,async (req, res) => {
    console.log("inside globalStatus Route")
    try {
        if(req.user.userType === "User") {
            throw "You are not authorized to view this page"
        }
        // let globalArrayOfIssues = await IssueModel.find()
        //     .populate("IssueUpdate")
        //     .populate("userID")
        //     .populate("staffID")
        let globalCaseStatus = await globalCaseStatusModel.find()
            .populate("openIssues")
            // .populate("pendingIssues")
            // .populate("closedIssueSs")
            // .populate("deletedIssues")

        // console.log(globalCaseStatus[0].openIssues)
         // res.status(200).json({globalArrayOfIssues, globalCaseStatus})
        res.status(200).json({globalCaseStatus})

    } catch (e) {
        console.log(e)
        res.status(400).json({"message": e})
    }
})


//For updating issues status (Staff only) ----- completed
router.put("/update/:issueid",checkUser, async(req, res)=> {
    console.log("params", req.params.issueid)

    try {
        if(req.user.userType === "User") {
            throw "You are not authorized to view this page"
        }

        //IssueUpdates
        const newIssueUpdate = new issueUpdateModel(req.body)
        newIssueUpdate.date = req.body.date //has both date and time or let it be split
        newIssueUpdate.time = req.body.time //has both date and time or let it be split
        // newIssueUpdate.update = //update description - To be filled in at staff form
        newIssueUpdate.userID = req.user.id
        newIssueUpdate.issueID = req.params.issueid
        await newIssueUpdate.save()

        //findById issue and push into updates array
        await IssueModel.findOneAndUpdate({_id:req.params.issueid}, {$push: { updates: newIssueUpdate._id}})


        // let updatedIssue = issueUpdateModel.findOne({issueID:req.params.issueid},{})
        res.status(201).json({newIssueUpdate})
    }catch(e){
        console.log(e)
        res.status(400).json({"message": e})
    }
})

//view all open issues
router.get('/staff/open',checkUser,async (req, res) => {
    try {
        if (req.user.userType === "User") {
            throw "You are not authorized to view this page"
        }
        let globalCaseStatus = await globalCaseStatusModel.find()
            .populate("openIssues")
        let globalOpenIssues = globalCaseStatus[0]["openIssues"]
        // console.log(globalOpenIssues)
        res.status(400).json({globalOpenIssues})
    }catch(e){
            console.log(e)
    }
})
//view all pending issues
router.get('/staff/pending',checkUser,async (req, res) => {
    try {
        if (req.user.userType === "User") {
            throw "You are not authorized to view this page"
        }
        let globalCaseStatus = await globalCaseStatusModel.find()
            .populate("pendingIssues")
        res.status(400).json({globalCaseStatus})
        let globalPendingIssues = globalCaseStatus[0]["pendingIssues"]
        // console.log(globalPendingIssues)
        res.status(400).json({globalPendingIssues})
    }catch(e){
        console.log(e)
    }
})
//view all closed issues
router.get('/staff/closed',checkUser,async (req, res) => {
    try {
        if (req.user.userType === "User") {
            throw "You are not authorized to view this page"
        }
        let globalCaseStatus= await globalCaseStatusModel.find()
            .populate("closedIssues")
        // console.log(globalCaseStatus[0]["openIssues"])
        let globalClosedIssues = globalCaseStatus[0]["closedIssues"]
        // console.log(globalClosedIssues)
        res.status(400).json({globalClosedIssues})
    }catch(e){
        console.log(e)
    }
})

//view all rejected issues
router.get('/staff/deleted',checkUser,async (req, res) => {
    try {
        if (req.user.userType === "User") {
            throw "You are not authorized to view this page"
        }
        let globalCaseStatus = await globalCaseStatusModel.find()
            .populate("deletedIssues")
        let globalDeletedIssues = globalCaseStatus[0]["deletedIssues"]
        // console.log(globalDeletedIssues)
        res.status(400).json({globalDeletedIssues})
    }catch(e){
        console.log(e)
    }
})

//catch all other request (maybe dont need)
router.get('*', (req, res)=>{
    res.status(404).json({message: "Nothing to see here yet. Come back next time."})
})

module.exports = router
