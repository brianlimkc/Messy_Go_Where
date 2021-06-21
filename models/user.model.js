const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    id: String,
    name: String,
    email: String,
    password: String,
    profilePic: String,
    userType: {
        type: String,
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

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model("User", userSchema)
