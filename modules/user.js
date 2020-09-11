var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/blog',{useNewUrlParser: true, useUnifiedTopology: true})
mongoose.set('useFindAndModify', false)
var Schema = mongoose.Schema
var userInfo = new Schema({
    username:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
})
var User = mongoose.model('User',userInfo)
module.exports = User