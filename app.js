var express = require('express')
var router = require('./router')
var path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session')
var app = express()
app.use(session({
    secret: 'keyboard cat',	
    resave: false,
    saveUninitialized: true	
  }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.engine('html',require('express-art-template'))
app.use('/public/',express.static(path.join(__dirname,'public')))
app.use('/node_modules/',express.static(path.join(__dirname,'node_modules')))
app.use(router)
app.use(function (req,res) {
    res.render('404.html')
})
app.use(function(err,req,res,next) {
    console.log(err)
    res.status(500).json({
        errcode: 500,
        message: '服务器发生了错误'
    })
})
app.listen(3000,function() {
    console.log('server is runnig')
})