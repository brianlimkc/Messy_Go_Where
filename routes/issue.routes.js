const router = require('express').Router()
const IssueModel = require('../models/issue.model')
const UserModel = require('../models/user.model')
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
router.get('/:id', async(req, res) => {
    try {
        let user = await UserModel.find()
            .populate("pendingIssues")
            .populate("closedIssues")
            .populate("voucherList")

        //let individualIssues =

        res.status(200).json({individualIssues})
    } catch (e)
    {
        console.log(e)
        res.status(400).json({"message" : e})
    }
})

//(Tested - Can add to DB) Issue Form - Post request Can do up the issue form now
router.post('/submit', checkUser, async (req, res) => {
    const newIssue = new IssueModel(req.body)
    // console.log(req.headers) left it here so I can explain that it go thru middleware, remove next time
    newIssue.userID = req.user.id

    try {
        // await newIssue.save()
        res.status(201).json({newIssue})
    } catch(e){
        console.log(e)
        res.status(400).json
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
