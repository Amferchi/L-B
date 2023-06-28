const mongoose = require("mongoose")

const  memberSchema = new mongoose.Schema({
     name:String,
     rank:String,
     kills:Number,
     avatar:String,
     wins:Number,
     position:String

})

module.exports = mongoose.model("members",memberSchema)