const router = require('express').Router()
const IssueModel = require('../models/issue.model')
const UserModel = require('../models/user.model')
const issueUpdateModel = require('../models/issueUpdates.model')
const globalCaseStatusModel = require('../models/globalCaseStatus.model')
const checkUser = require('../lib/check')
require('dotenv').config()


//(Tested) for staff - get “/issue” – get user info – name, email, point, pending cases, resolved cases
router.get('/',checkUser,async (req, res) => {
    try {
        if(req.user.userType === "User") {
            throw "You are not authorized to view this page"
        }
        let globalArrayOfIssues = await IssueModel.find()
            .populate("IssueUpdate")
            .populate("userID")
            .populate("staffID")
        let globalCaseStatus = await globalCaseStatusModel.find()
            .populate("openIssues")
            .populate("pendingIssues")
            .populate("closedIssueSs")
            .populate("deletedIssues")
        res.status(200).json({globalArrayOfIssues, globalCaseStatus})
    } catch (e) {
        console.log(e)
        res.status(400).json({"message": e})
    }
})

//For individual user (UserId) Get their own issues array
router.get('/user/home', checkUser, async(req, res) => {
    try {
        let user = await UserModel.find({_id: req.user.id})
        .populate("pendingIssues")
        .populate("closedIssues")
        // .populate("voucherList")q
        console.log(user)
        //let individualIssuesArray =

        res.status(200).json({user})
    } catch (e) {
        console.log(e)
        res.status(400).json({"message": e})
    }
})

//(Tested - Can add to DB) Issue Form - Post request Can do up the issue form now
router.post('/submit', checkUser, async (req, res) => {
    const newIssue = new IssueModel(req.body)
    // console.log(req.headers) left it here so I can explain that it go thru middleware, remove next time
    newIssue.userID = req.user.id
    // newIssue.issueID = (do we really need our own id since they got their own _id?)


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
        await globalCaseStatusModel.findByIdAndUpdate(process.env.GLOBSTATUS, {$push: { pendingIssues: newIssue._id}})
        await UserModel.findByIdAndUpdate(req.user.id, {$push: { pendingIssues: newIssue._id}})
        res.status(201).json({newIssue})
    } catch(e){
        console.log(e)
        res.status(400).json({"message" : e})
    }
})

// //For updating issues/status of issues(Staff only) //only done layout
// router.put("/edit", async(req, res)=> {
//
//     //splice or filter here
//
//     try {
//         res.status(200).json({})
//     }catch(e){
//
//     }
// })



//For pending issue
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

//For closed issue
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

//View Individual updates for User usertype
router.get('/:issueid', checkUser, async(req, res) => {
    let issueId = req.params.issueid
    // console.log(issueId)
    try {
        let user = await UserModel.find({_id: req.user.id})

        let pendIssue = user[0]["pendingIssues"]
        let closedIssue = user[0]["closedIssues"]

        //leaving these consolelogs to explain later
        // console.log(pendIssue.includes(issueId))
        // console.log(closedIssue.includes(issueId))
        let currentIssue = [] //might need better naming
        if (pendIssue.includes(issueId) || closedIssue.includes(issueId)){
             currentIssue = await IssueModel.find({_id: issueId}) // change if we use our own issueid
                .populate("updates")
            // .populate("voucherList")
            console.log(currentIssue)
        } else {
            throw "issue not found for this user."
        }

        res.status(200).json({currentIssue})
    } catch (e) {
        console.log(e)
        res.status(400).json({"message": e})
    }
})

//Get globalCaseStatus
router.get("")

//catch all other request (maybe dont need)
router.get('*', (req, res)=>{
    res.status(404).json({message: "Nothing to see here yet. Come back next time."})
})

module.exports = router
