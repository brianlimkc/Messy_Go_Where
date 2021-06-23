const mongoose = require('mongoose')
const Schema = mongoose.Schema

const voucherSchema = new Schema({
    voucherId: String,
    picture: String,
    description: String,
    pointsCost: Number,
    status: {
        type: String,
        required: true,
        default: "Available",
        enum: ["Redeemed","Available"]
        },
    issuedTo: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("Voucher", voucherSchema)
