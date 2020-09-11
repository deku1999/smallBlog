var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/blog',{useNewUrlParser: true, useUnifiedTopology: true})
mongoose.set('useFindAndModify', false)
var Schema = mongoose.Schema
var articles = new Schema({
    username: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
var Article = mongoose.model('articles',articles)
module.exports = Article