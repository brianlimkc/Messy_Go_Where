const mongoose = require('mongoose')
const Schema = mongoose.Schema

const globalCaseStatus = new Schema({
    pendingIssues: [{
        type: Schema.Types.ObjectId,
        ref: "Issue"
    }],
    closedIssues: [{
        type: Schema.Types.ObjectId,
        ref: "Issue"
    }],
})

module.exports = mongoose.model("GlobalCaseStatus", globalCaseStatus)
