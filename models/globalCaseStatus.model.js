const mongoose = require('mongoose')
const Schema = mongoose.Schema

const closedIssuesSchema = new Schema({
    pendingIssues: [{
        type: Schema.Types.ObjectId,
        ref: "Issue"
    }],
    closedIssues: [{
        type: Schema.Types.ObjectId,
        ref: "Issue"
    }],
})

module.exports = mongoose.model("ClosedIssue", closedIssuesSchema)
