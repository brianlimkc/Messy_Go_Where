const mongoose = require('mongoose')
const Schema = mongoose.Schema

const globalCaseStatusSchema = new Schema({
    openIssues: [{
        type: Schema.Types.ObjectId,
        ref: "Issue"
    }],
    pendingIssues: [{
        type: Schema.Types.ObjectId,
        ref: "Issue"
    }],
    closedIssues: [{
        type: Schema.Types.ObjectId,
        ref: "Issue"
    }],
    deletedIssues: [{
        type: Schema.Types.ObjectId,
        ref: "Issue"
    }],
})

module.exports = mongoose.model("GlobalCaseStatus", globalCaseStatusSchema)
