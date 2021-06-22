const mongoose = require("mongoose");
require('dotenv').config()
const issueModel = require("../models/issue.model")
const userModel = require("../models/user.model")
const IssueUpdatesModel = require("../models/issueUpdates.model")

console.log(process.env.DB)

// mongoose.connect(process.env.DB, {
//     useFindAndModify: false,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useNewUrlParser: true
// }).then(() => {
//     console.log("mongodb running")
// })

// userModel.deleteMany().then(()=>{
//     process.exit()
// })
//
// userModel.insertMany([
//     {
//         id: "u-00001",
//         name: "John Smith",
//         email: "jsmith@example.com",
//         password: "abcde12345",
//         userType: "User",
//         isAdmin: false,
//         pendingIssues: [],
//         closedIssues: [],
//         points: 999,
//         issuesSubmitted: 99,
//         voucherList : [],
//     },
//     {
//         id: "u-00002",
//         name: "Sally Jones",
//         email: "sjones@example.com",
//         password: "abcde12345",
//         userType: "User",
//         isAdmin: false,
//         pendingIssues: [],
//         closedIssues: [],
//         points: 999,
//         issuesSubmitted: 99,
//         voucherList : [],
//     },
//     {
//         id: "u-00003",
//         name: "Roger Lee",
//         email: "rlee@example.com",
//         password: "abcde12345",
//         userType: "User",
//         isAdmin: false,
//         pendingIssues: [],
//         closedIssues: [],
//         points: 999,
//         issuesSubmitted: 99,
//         voucherList : [],
//     },
//     {
//         id: "s-00001",
//         name: "Charles Jordan",
//         email: "cjordan@example.com",
//         password: "abcde12345",
//         userType: "Staff",
//         isAdmin: false,
//         pendingIssues: [],
//         closedIssues: [],
//         points: 999,
//         issuesSubmitted: 99,
//         voucherList : [],
//     },
//     {
//         id: "s-00002",
//         name: "William James",
//         email: "cjordan@example.com",
//         password: "abcde12345",
//         userType: "Staff",
//         isAdmin: true,
//         pendingIssues: [],
//         closedIssues: [],
//         points: 999,
//         issuesSubmitted: 99,
//         voucherList : [],
//     },
//
// ])
//     .then(()=>{
//         process.exit()
//     })

// issueModel.deleteMany().then(()=>{
//     process.exit()
// })
//
// issueModel.insertMany([
//     {
//         issueID : "i-0001",
//         picture : "https://via.placeholder.com/150",
//         description: "issue 1",
//         date: "1/7/21",
//         time: "2:30pm",
//         location: "Blk 16",
//         rating: "",
//         updates: [],
//         issueStatus: "Open",
//     },
//     {
//         issueID : "i-0002",
//         picture : "https://via.placeholder.com/150",
//         description: "issue 2",
//         date: "1/7/21",
//         time: "2:30pm",
//         location: "Blk 16",
//         rating: "",
//         updates: [],
//         issueStatus: "Open",
//     },
//     {
//         issueID : "i-0003",
//         picture : "https://via.placeholder.com/150",
//         description: "issue 3",
//         date: "1/7/21",
//         time: "2:30pm",
//         location: "Blk 16",
//         rating: "",
//         updates: [],
//         issueStatus: "Open",
//     },
//     {
//         issueID : "i-0004",
//         picture : "https://via.placeholder.com/150",
//         description: "issue 4",
//         date: "1/7/21",
//         time: "2:30pm",
//         location: "Blk 16",
//         rating: "",
//         updates: [],
//         issueStatus: "Open",
//     },
//     {
//         issueID : "i-0005",
//         picture : "https://via.placeholder.com/150",
//         description: "issue 5",
//         date: "1/7/21",
//         time: "2:30pm",
//         location: "Blk 16",
//         rating: "",
//         updates: [],
//         issueStatus: "Open",
//     },
//     {
//         issueID : "i-0006",
//         picture : "https://via.placeholder.com/150",
//         description: "issue 6",
//         date: "1/7/21",
//         time: "2:30pm",
//         location: "Blk 16",
//         rating: "",
//         updates: [],
//         issueStatus: "Open",
//     },
//
//     ])
// .then(()=>{
//     process.exit()
// })

// IssueUpdatesModel.deleteMany().then(()=>{
//     process.exit()
// })
//
// IssueUpdatesModel.insertMany([
//     {
//         date: "22/06/2021",
//         time: "1200",
//         updateDescription: "first",
//         updateStatus: "Open",
//     },
//     {
//         date: "22/06/2021",
//         time: "0500",
//         updateDescription: "second",
//         updateStatus: "In Progress",
//     }
// ])
//     .then(()=>{
//         process.exit()
//     })
