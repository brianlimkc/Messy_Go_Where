const mongoose = require('mongoose')
const Schema = mongoose.Schema

const issueUpdateSchema = new Schema({
    date: String,
    time: String,
    updateDescription: { // to see whether there is further merge conflict
        type: String,
        default: "Case under review"  // chose to keep BT code
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
