const mongoose = require("mongoose")

var passmonlocal = require("passport-local-mongoose"); 

const UsarSchema = new mongoose.Schema({
    username:String,
    password:String
})

UsarSchema.plugin(passmonlocal);
module.exports = mongoose.model("Usar" , UsarSchema)