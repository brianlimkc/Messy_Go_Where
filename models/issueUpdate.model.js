const mongoose = require('mongoose')
const Schema = mongoose.Schema

const issuesSchema = new Schema({
    name: String,
    parentFolder: {
        type: Schema.Types.ObjectId,
        ref: "Folder"
    }
})

module.exports = mongoose.model("Issue", issuesSchema)
