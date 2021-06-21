const mongoose = require('mongoose')
const Schema = mongoose.Schema

const issuesSchema = new Schema({
    issueID : String,
    picture : String,
    description: String,
    date: String,
    time: String,
    location: String,
    rating: Number,
    updates: [{
        type: Schema.Types.ObjectId,
        ref: "IssueUpdate"
    }], //do we need [] here? or just let issue update be []
    issueStatus: {
        type: String,
        required: true,
        default: "Open",
        enum: [
            "Open",
            "In Progress",
            "Closed",
            "Deleted"
        ]
    },
    issueType: {
        type: String,
        required: true,
        default: "General",
        enum: [
            "General",
            "Pests",
            "Animal & Birds",
            "Cleanliness",
            "Roads & Footpaths",
            "Facilities in HDB",
            "Drinking Water",
            "Drains & Sewers",
            "Parks & Greenery",
            "Construction Sites",
            "Abandoned Trolleys",
            "Shared Bicycles",
            "Illegal Parking"
        ]
    },
    userID: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    staffID: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
})

module.exports = mongoose.model("Issue", issuesSchema)
