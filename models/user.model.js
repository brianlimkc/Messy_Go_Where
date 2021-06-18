const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    id: String,
    name: String,
    email: String,
    password: String,
    userType: {
        type: String,
        required: true,
        default: "User",
        enum: ["User","Staff","Admin"]
    },
    isAdmin: Boolean,
    pendingIssues: [{
        type: Schema.Types.ObjectId,
        ref: "Issue"
    }],
    closedIssues: [{
        type: Schema.Types.ObjectId,
        ref: "Issue"
    }],
    points: Number,
    issuesSubmitted: Number,
    voucherList : [{
        type: Schema.Types.ObjectId,
        ref: "Voucher"
    }],
})

module.exports = mongoose.model("User", userSchema)
