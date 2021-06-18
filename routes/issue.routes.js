const router = require('express').Router()
require('dotenv').config()
const IssueModel = require('../models/issue.model')
const UserModel = require('../models/user.model')

//for staff
router.get('/', async (req, res) => {
    try {
        let globalArrayOfIssues = await IssueModel.find()
            .populate("updates")
            .populate("issueStatus")
            .populate("userID")
            .populate("staffID")

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

//Issue Form - Post request (Not yet tested)
router.post('/add/:issueID', async (req, res) => {
    const issues = new IssueModel(req.body)
    try {
        res.status(201).json({issues})
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
