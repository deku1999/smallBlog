var express = require('express')
var router = express.Router()
var User = require('./modules/user')
var Article = require('./modules/article')
router.get('/',function (req,res,next) {
    var session = req.session
    Article.find(function(err,ret) {
        if(err) {
            return next(err)
        }
        var page = Math.ceil((ret.length)/10)
        var arrayA = []
        for(var i=0;i<page;i++) {
            arrayA.push(i)
        }
        res.render('index.html',{
            session,
            ret,
            arrayA
        })
    })
})
router.get('/infoBlog',function(req,res,next) {
    User.findOne({
        username: req.session.user
    },function(err,ret) {
        if(err) {return next(err)}
        Article.find({
            email: ret.email
        },function(err,ret) {
            if(err) {return next(err)}
            res.render('blog.html',{
                session: req.session,
                ret
            })
        })
    })
})
router.get('/delete',function(req,res,next) {
    var data = req.query
    Article.findByIdAndRemove(data.id.replace(/"/g,''),function(err,ret) {
        if(err) {return next(err)}
        console.log('删除成功')
        res.redirect('/infoBlog')
    })
})
router.get('/detail',function(req,res,next) {
    var data = req.query
    Article.findOne({
        _id: data.id.replace(/'/g,'').replace(/"/g,'')
    },function(err,ret) {
        if(err) {
            return next(err)
        }
        res.render("detail.html",{
            session: req.session,
            ret
        })
    })
})
router.get('/login',function (req,res) {
    res.render('login.html')
})
router.get('/register',function (req,res) {
    res.render('register.html')
})
router.get('/exit',function (req,res) {
    req.session.user = null
    res.redirect('/')
})
router.get('/edit',function (req,res) {
    User.findOne({
        username: req.session.user
    },function(err,ret) {
        if(err) {return next(err)}
        res.render('edit.html',{
            ret
        })
    })
})
router.post('/edit',function(req,res,next) {
    var data = req.body
    console.log(data)
    User.findOneAndUpdate({
        email: data.email
    },{
        $set: {
            username: data.username,
            password: data.password
        }
    },{},function(err,ret) {
        if(err) {return next(err)}
        if(!ret) {return res.status(200).json({
            errcode: 0,
            message: '没有找到该数据'
        })}
        req.session.user = data.username
        return res.status(200).json({
            errcode: 1,
            message: '更新信息成功'
        })
    })
})
router.get('/article',function(req,res) {
    var status = req.session.user
    if(status){
        return res.redirect('/addArticle')
    }
    res.redirect('/login')
})
router.get('/addArticle',function(req,res) {
    res.render('article.html')
})
router.post('/article',function(req,res,next) {
    var data = req.body
    User.findOne({
        username: req.session.user
    },function(err,ret) {
        if(err) {return next(err)}
        var email = ret.email
        var admin = new Article({
            email,
            title: data.title,
            message: data.message,
            username: ret.username
        })
        admin.save(function (err,ret) {
            if(err) {
                console.log(err)
                return next(err)
            }
            console.log('保存成功')
            res.redirect('/')
        })
    })
})
router.post('/login',function(req,res,next) {
    var userinfo = req.body
    User.findOne({
        email: userinfo.email,
        password: userinfo.password
    },function(err,ret) {
        if(err) { return next(err)}
        if(ret) {
            req.session.user = ret.username
            res.status(200).json({
                errcode: 1,
                message: '登录成功了'
            })
        }
        else{
            res.status(200).json({
                errcode: 0,
                message: '邮箱或密码错误'
            })
        }
    })
})
router.post('/register',function (req,res,next) {
    var userinfo = req.body
    User.find({
        $or: [
            {username: userinfo.name}, 
            {email:userinfo.email}
         ]
    },function(err,ret) {
        if(err) { return next(err)}
        if(ret.length !==0) {
            return res.status(200).json({
                errcode: 0,
                message: '用户名或邮箱已重复'
            })
        }
        var admin = new User(userinfo)
        admin.save(function (err,data) {
            if(err) {return next(err)}
            req.session.user = userinfo.username
            res.status(200).json({
                errcode: 1,
                message: '注册成功'
            })
        })
    })
})
module.exports = router