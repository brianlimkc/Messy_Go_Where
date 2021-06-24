const mongoose = require('mongoose')
const Schema = mongoose.Schema

const issueUpdateSchema = new Schema({
    date: String,
    time: String,
    updateDescription: String,
    updateStatus: {
        type: String,
        required: true,
        default: "Open",
        enum: ["Open","In Progress","Resolved","Closed"]
    },
    issueID: {
        type: Schema.Types.ObjectId,
        ref: "Issue"
    },
    userID: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
})

module.exports = mongoose.model("IssueUpdate", issueUpdateSchema)
