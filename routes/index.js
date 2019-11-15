var express = require('express');
var router = express.Router();

const { UserModel,ChatModel } = require('../db/models')
const md5 = require('blueimp-md5')
const filter = {password: 0, __v: 0} //过滤不需要的信息

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

//用户注册路由
router.post('/register', (req, res, next) => {
    //获取请求数据
    const { username, password, type } = req.body
    //处理数据
    UserModel.findOne({username}, (err, user) => {
        if(user) {
            //返回响应
            res.send({code: 1, msg: '此用户已存在'})
        }else{
            new UserModel({username,type,password: md5(password)}).save((error, user) => {
                //返回响应
                const data = {username, type, _id: user._id}
                res.cookie('userId', user._id, {maxAge: 1000*60*60*24})
                res.send({code: 0, data: data})
            })
        }
    })
})
//用户登录路由
router.post('/login', (req, res, next) => {
    //获取请求数据
    const { username, password } = req.body
    //处理数据
    UserModel.findOne({username, password: md5(password)}, filter, (err, user) => {
        if(user) {
            //返回响应
            res.cookie('userId', user._id, {maxAge: 1000*60*60*24})
            res.send({code: 0, data: user})

        }else{
            res.send({code: 1, msg: '用户名或密码不正确'})
        }
    })
})

// 更新用户信息路由、
router.post('/update', (req, res, next) => {
    //获取cookie里面的userId
    const userId = req.cookies.userId
    if(!userId) {
        return res.send({code: 1, msg: '请先登录'})
    }
    //获取请求数据
    const user = req.body
    //处理数据
    UserModel.findByIdAndUpdate({_id: userId}, user,(err, oldUser) => {
        const {username, type, _id} = oldUser
        if(!oldUser) {
            //返回响应
            res.clearCookie('userId')
            return res.send({code: 1, msg: '请先登录'})

        }else{
            const data = Object.assign(user,{username,_id,type})
            res.send({code: 0, data: data})
        }
    })
})
// 获取用户信息路由、
router.get('/user', (req, res, next) => {
    //获取cookie里面的userId
    const userId = req.cookies.userId
    if(!userId) {
        return res.send({code: 1, msg: '请先登录'})
    }
    //处理数据
    UserModel.findOne({_id: userId}, filter, (err, user) => {
        //返回响应
        res.send({code: 0, data: user})
    })
})
// 根据用户类型获取用户列表路由、
router.get('/userlist', (req, res, next) => {
    const { type } = req.query
    //处理数据
    UserModel.find({type}, filter, (err, users) => {
        //返回响应
        res.send({code: 0, data: users})
    })
})

// 根据当前用户的聊天列表
router.get('/chatlist', (req, res, next) => {
    const userId = req.cookies.userId
    //处理数据
    UserModel.find((err, userDocs) => {
        // const users = {}
        // userDocs.forEach(doc => {
        //     users[doc._id] = {username: doc.username,head: doc.head}
        // })
        const users = userDocs.reduce((users, user) => {
            users[user._id] = {username: user.username,head: user.head,company:user.company}
            return users
        }, {})
        // 查询userId相关的所有聊天信息
        ChatModel.find({'$or': [{from: userId},{to: userId}]}, filter, (error, chatMsgs) => {
            res.send({code: 0, data: {users, chatMsgs}})
        })

    })
})


// 修改指定消息为已读
router.post('/readmsg', (req, res, next) => {
    const from = req.body.from
    const to = req.cookies.userId
    //处理数据
    /*
    * 参数一  查询条件
    * 参数二  更新为指定的数据对象
    * 参数三  是否一次更新多条，默认为一条
    * 参数四  回调函数
    * */
    ChatModel.update({from,to,read: false}, {read: true}, {multi: true},(error, doc) => {
        res.send({code: 0, data: doc.nModified})  // 更新的数量
    })
})

module.exports = router;
