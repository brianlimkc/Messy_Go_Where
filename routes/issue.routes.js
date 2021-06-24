const router = require('express').Router()
const IssueModel = require('../models/issue.model')
const UserModel = require('../models/user.model')
const issueUpdateModel = require('../models/issueUpdates.model')
const GlobalCaseStatusModel = require('../models/globalCaseStatus.model')
const checkUser = require('../lib/check')
const { cloudinary } = require('../lib/cloundinary')
const { nanoid } = require('nanoid')
const globalCaseStatusID = "60d04a0f21a73227222ac063"
const issuePointReward = 100
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

    try {
        let singleIssue = await IssueModel.findById(thisIssueId)
            .populate("updates")

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
        let globalArrayOfIssues = await IssueModel.find()
            .populate("IssueUpdate")
            .populate("userID")
            .populate("staffID")
        let globalCaseStatus = await GlobalCaseStatusModel.find()
            .populate("openIssues")
            .populate("pendingIssues")
            .populate("closedIssueSs")
            .populate("deletedIssues")

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
        // if (req.user.userType === "User") {
        //     throw "You are not authorized to view this page"
        // }
        let globalCaseStatus = await GlobalCaseStatusModel.find()
            .populate("openIssues")
        let globalOpenIssues = globalCaseStatus[0]["openIssues"]
        // console.log(globalOpenIssues)
        res.status(200).json({globalOpenIssues})
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
        let globalCaseStatus = await GlobalCaseStatusModel.find()
            .populate("pendingIssues")
        res.status(200).json({globalCaseStatus})
        let globalPendingIssues = globalCaseStatus[0]["pendingIssues"]
        // console.log(globalPendingIssues)
        res.status(200).json({globalPendingIssues})
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
        let globalCaseStatus= await GlobalCaseStatusModel.find()
            .populate("closedIssues")
        // console.log(globalCaseStatus[0]["openIssues"])
        let globalClosedIssues = globalCaseStatus[0]["closedIssues"]
        // console.log(globalClosedIssues)
        res.status(200).json({globalClosedIssues})
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
        let globalCaseStatus = await GlobalCaseStatusModel.find()
            .populate("deletedIssues")
        let globalDeletedIssues = globalCaseStatus[0]["deletedIssues"]
        // console.log(globalDeletedIssues)
        res.status(200).json({globalDeletedIssues})
    }catch(e){
        console.log(e)
    }
})


//Submit New Issue
router.post('/submit', checkUser, async (req, res) => {

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    try {
        const newIssue = new IssueModel(req.body)
        newIssue.userID = req.user.id
        newIssue.issueID = `Ref-${nanoid(8).toUpperCase()}`

        //Create and populate IssueUpdates
        const newIssueUpdate = new issueUpdateModel()
        newIssueUpdate.date = date
        newIssueUpdate.time = time
        newIssueUpdate.updateDescription = "New Issue submitted by User"
        newIssueUpdate.userID = req.user.id
        newIssueUpdate.issueID = newIssue._id

        //push new issue into pending Issue array for both global and user
        newIssue.updates = newIssueUpdate._id

        await newIssue.save()
        await newIssueUpdate.save()

        // Update Global Case Status        
        await GlobalCaseStatusModel.findByIdAndUpdate(globalCaseStatusID, {$push: { openIssues: newIssue._id}})

        //Update User Model     
        await UserModel.findByIdAndUpdate(req.user.id, {$push: { pendingIssues: newIssue._id}})

        res.status(201).json({newIssue})
    } catch(e){
        console.log(e)
        res.status(400).json({"message" : e})
    }
})

// Accept Issue by Staff
router.post('/iAccept/:issueid', checkUser, async (req, res) => {

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();


    try {
        let issueID = req.params.issueid
        let currentStaffID = req.user.id

        // create new IN PROGRESS issueUpdate and save
        const newIssueUpdate = new issueUpdateModel(req.body)
        newIssueUpdate.date = date
        newIssueUpdate.time = time
        newIssueUpdate.updateDescription = "Our Staff are working on the issue"
        newIssueUpdate.userID = req.user.id
        newIssueUpdate.issueID = issueID
        newIssueUpdate.updateStatus = "In Progress"
        //auto time and date?
        //auto description?
        await newIssueUpdate.save()
        let newIssueUpdateID = newIssueUpdate._id

        // update Staff pendingIssues with new issue
        await UserModel.findByIdAndUpdate(currentStaffID, {$push: {pendingIssues: issueID}})

        // update Issue updates with new issue update, issueStatus and staffID
        await IssueModel.findByIdAndUpdate(req.params.issueid, {$push: {updates: newIssueUpdateID}})
        await IssueModel.findByIdAndUpdate(req.params.issueid, {$set: {issueStatus: "In Progress"}})
        await IssueModel.findByIdAndUpdate(req.params.issueid, {$set: {staffID: currentStaffID}})

        //update globalStatus
        await GlobalCaseStatusModel.findByIdAndUpdate(globalCaseStatusID, {$pull: {openIssues: issueID}})
        await GlobalCaseStatusModel.findByIdAndUpdate(globalCaseStatusID, {push: {pendingIssues: issueID}})
        res.status(200).json({newIssueUpdate})
    } catch (e) {
        res.status(400).json({"message": e})
    }
})

// Resolve Issue by Staff
router.post('/iResolved/:issueid', checkUser, async (req, res) => {

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    console.log("inside iResolved")
    try {
        let issueID = req.params.issueid
        let currentStaffID = req.user.id

        // create new RESOLVED issueUpdate and save
        const newIssueUpdate = new issueUpdateModel(req.body)
        newIssueUpdate.date = date
        newIssueUpdate.time = time
        newIssueUpdate.updateDescription = req.body.description
        newIssueUpdate.userID = currentStaffID
        newIssueUpdate.issueID = issueID
        newIssueUpdate.updateStatus = "Resolved"
        await newIssueUpdate.save()
        let newIssueUpdateID = newIssueUpdate._id

        // update issue status
        await IssueModel.findByIdAndUpdate(issueID, {$push: {updates: newIssueUpdateID}})
        await IssueModel.findByIdAndUpdate(issueID, {$set: {issueStatus: "Resolved"}})

        //update user pendingIssues and closedIssues
        // let currentUserID = await IssueModel.findById(issueID).userID
        let currentUser = await IssueModel.findById(issueID)
        let currentUserID = currentUser.userID

        await UserModel.findByIdAndUpdate(currentUserID, {$pull: {pendingIssues: issueID}})
        await UserModel.findByIdAndUpdate(currentUserID, {$push: {closedIssues: issueID}})

        //update staff pendingIssues and closedIssues
        await UserModel.findByIdAndUpdate(currentStaffID, {$pull: {pendingIssues: issueID}})
        await UserModel.findByIdAndUpdate(currentStaffID, {$push: {closedIssues: issueID}})

        //update globalStatus
        await GlobalCaseStatusModel.findByIdAndUpdate(globalCaseStatusID, {$pull: {pendingIssues: issueID}})
        await GlobalCaseStatusModel.findByIdAndUpdate(globalCaseStatusID, {push: {closedIssues: issueID}})

        // increment points to user TBC

        res.status(200).json({newIssueUpdate})
    } catch (e) {
        res.status(400).json({"message": e})
    }
})

// Close Issue by User or Staff
router.post('/iDeleted/:issueid', checkUser, async (req, res) => {

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    console.log("inside delete issue")
    try {
        let issueID = req.params.issueid
        let currentIssue = await IssueModel.findById(issueID)

        let currentUserID = currentIssue.userID
        let currentStatus = currentIssue.issueStatus
        

        // create new DELETED issueUpdate and save
        const newIssueUpdate = new issueUpdateModel()
        newIssueUpdate.date = date
        newIssueUpdate.time = time
        newIssueUpdate.updateDescription = req.body.description
        newIssueUpdate.userID = req.user.id
        newIssueUpdate.issueID = issueID
        newIssueUpdate.updateStatus = "Closed"
        // auto time and date
        // auto description?
        await newIssueUpdate.save()

        switch (currentStatus) {
            case "Open":
                // pull from global status openIssues
                await GlobalCaseStatusModel.findByIdAndUpdate(globalCaseStatusID, {$pull: {openIssues: issueID}})
                break
            case "In Progress":
                // update staff
                await UserModel.findByIdAndUpdate(currentStaffID, {$pull: {pendingIssues: issueID}})
                await UserModel.findByIdAndUpdate(currentStaffID, {$push: {closedIssues: issueID}})
                // pull from global status pendingIssues
                await GlobalCaseStatusModel.findByIdAndUpdate(globalCaseStatusID, {$pull: {pendingIssues: issueID}})
                break
        }

        // update user pendingIssues and closedIssues
        await UserModel.findByIdAndUpdate(currentUserID, {$pull: {pendingIssues: issueID}})
        await UserModel.findByIdAndUpdate(currentUserID, {$push: {closedIssues: issueID}})

        // update issue issueStatus and updates
        await IssueModel.findByIdAndUpdate(req.params.issueid, {$push: {updates: newIssueUpdate._id}})
        await IssueModel.findByIdAndUpdate(req.params.issueid, {$set: {issueStatus: "Deleted"}})


        // push into global status deleted issues
        await GlobalCaseStatusModel.findByIdAndUpdate(globalCaseStatusID, {push: {deletedIssues: issueID}})
        res.status(200).json({newIssueUpdate})
    } catch (e) {
        console.log(e)
        res.status(200).json({newIssueUpdate})
    }
})


router.post('/iRating/:issueID', checkUser, async (req, res) => {
    console.log("inside iRating")
    try {
        console.log(req.body)
        let rating = req.body.rating
        let CurrUser = await UserModel.findById(req.user.id)
        let currentPoints = CurrUser.points
        let updatedPoints = currentPoints + issuePointReward
        console.log("current points:", currentPoints, "updated points:", updatedPoints)
        await IssueModel.findByIdAndUpdate(req.params.issueID, {$set: {rating: rating}})
        await UserModel.findByIdAndUpdate(req.user.id, {$set: {points: updatedPoints}})
        res.status(200).json()
    } catch (e)
        {
        console.log(e)
        res.status(200).json()
        }
})


//catch all other request (maybe dont need)
router.get('*', (req, res)=>{
    res.status(404).json({message: "Nothing to see here yet. Come back next time."})
})

module.exports = router
