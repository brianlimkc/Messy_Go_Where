const router = require('express').Router()
const IssueModel = require('../models/issue.model')
const UserModel = require('../models/user.model')
const issueUpdateModel = require('../models/issueUpdates.model')
const globalCaseStatusModel = require('../models/globalCaseStatus.model')
const checkUser = require('../lib/check')


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
router.get('/:id/home', checkUser, async(req, res) => {
    try {
        if (!req.user.id === req.params.id) {
            throw "Access denied"
        }

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

//(Tested - Can add to DB) Issue Form - Post request Can do up the issue form now
router.post('/submit', checkUser, async (req, res) => {
    const newIssue = new IssueModel(req.body)
    // console.log(req.headers) left it here so I can explain that it go thru middleware, remove next time
    newIssue.userID = req.user.id
    // newIssue.issueID = (DO we really need our own id?)

    const newIssueUpdate = new issueUpdateModel()
    newIssueUpdate.date = new Date() //has both date and time or let it be split
    // newIssueUpdate.update = //update description - To be filled in at staff form
    newIssueUpdate.userID = req.user.id
    newIssueUpdate.issueID = newIssue._id

    newIssue.updates = newIssueUpdate._id



    console.log(newIssueUpdate)
    console.log(newIssue)
    try {
        // await newIssue.save()
        //await newIssueUpdate.save()
        // await globalCaseStatusModel.findByIdAndUpdate(req.user.id, {$push: { pendingIssues: newIssue._id  }})
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

//catch all other request (maybe dont need)
router.get('*', (req, res)=>{
    res.status(404).json({message: "Nothing to see here yet. Come back next time."})
})

module.exports = router
