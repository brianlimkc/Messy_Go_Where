const mongoose = require('mongoose')
const Schema = mongoose.Schema

const issueUpdateSchema = new Schema({
    date: String,
    time: String,
    description: String,
    update: {
        type: String,
        default: "Case under review"
    },
    updateStatus: {
        type: String,
        required: true,
        default: "In Progress",
        enum: ["Open","In Progress","Closed","Deleted"]
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
