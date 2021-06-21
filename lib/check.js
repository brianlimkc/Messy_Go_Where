const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = function (req, res, next){
    let token = req.headers.authorization.split(" ")[1]
    if(!token){
        return res.status(401).json({message: "no token"})
    }

    try{
        let decoded = jwt.verify(token, process.env.JWTSECRET);
        // console.log("decoded", decoded)
        req.user = decoded.user
        next()
    }catch(e){
        return res.status(401).json({message: "token is not valid"})
    }
}
