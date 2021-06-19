const express = require('express')
const mongoose = require("mongoose");
const app = express()
require('dotenv').config()

mongoose.connect(process.env.DB, {
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log("mongodb running")
})


//middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
// app.use(express.static('node_modules')) //probably not useful, commented out but left here if it is necessary
// app.use(express.static('public'))

//routes

app.use("/api/auth", require('./routes/auth.routes'))
app.use("/api/issue", require('./routes/issue.routes'))
app.use("/api/voucher", require('./routes/voucher.routes'))


app.listen(process.env.PORT, () => console.log(`running on ${process.env.PORT}`))
