const mongoose = require('mongoose')
const Schema = mongoose.Schema

const voucherSchema = new Schema({
    picture: String,
    description: String,
    pointsCost: Number,
    status: {
        type: String,
        required: true,
        default: "Redeemed",
        enum: ["Redeemed","Used"]
        },
    issuedTo: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("Voucher", voucherSchema)
