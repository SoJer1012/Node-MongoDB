/*
* 操作数据库 集合 数据的model模块
* */
// 引入
const mongoose = require('mongoose')
/*
* 1、连接数据库
* */
// 连接指定数据库

DB_URL = 'mongodb://localhost:27017/boss_db'
//连接
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
//连接成功
mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open to ' + DB_URL);
});
//连接异常
mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});
//连接断开
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});

/*
* 2、定义对应特定集合的Model，并向外暴露
* */
// 定义Schema（描述文档结构）
const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    type: {type: String, required: true},   //类型   boss/tech
    head: {type: String},        // 头像
    post: {type: String},         // 职位
    info: {type: String},           // 个人或公司简介
    company: {type: String},        // 公司
    salary: {type: String}          // 薪资
})
// 定义Model（与集合对应，可以操作集合）
const UserModel = mongoose.model('user', userSchema)
// 向外暴露Model
exports.UserModel = UserModel

//定义chats集合的文档结构
const chatSchema = mongoose.Schema({
    from: {type: String, require: true},   //发送用户的id
    to: {type: String, require: true},      //目标用户的id
    chat_id: {type: String, require: true},     //
    content: {type: String, require: true},     // 内容
    read: {type: Boolean, default: false},      // 是否已读
    create_time: {type: Number}
})
//定义能操作chats集合数据的model
const ChatModel = mongoose.model('chat', chatSchema)

exports.ChatModel = ChatModel