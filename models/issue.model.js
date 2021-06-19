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
        ref: "Update"
    }],
    issueStatus: {
        type: String,
        required: true,
        default: "Open",
        enum: ["Open","In Progress","Closed","Deleted"]
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
