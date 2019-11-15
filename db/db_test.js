const md5 = require('blueimp-md5')

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/boss_db')

const conn = mongoose.connection

conn.on('connected', function() {
    console.log('数据库连接成功，YEEE')
})


const userSchema = mongoose.Schema({
    username: {type: String, require: true},
    password: {type: String, require: true},
    type: {type: String, require: true}
})

const UserModel = mongoose.model('user', userSchema)

function newItem () {
    const userModel = new UserModel({
        username: 'Bob',
        password: md5('123'),
        type: 'tech'
    })

    userModel.save((error, user) => {
        console.log('save()', error, user)
    })
}
//newItem()
function findItems() {
    UserModel.find((error, users) => {
        console.log('find()', error, users)
    })


    // UserModel.findOne({_id: '5dbbfd563910402e304f9bd6'},(error, user) => {
    //     console.log('---------------------------------')
    //     console.log('findOne()', error, user)
    // })



    // UserModel.findOne({_id: '5dbbfd563910402e304f9b46'},(error, user) => {
    //     console.log('---------------------------------')
    //     console.log('findOne()', error, user)
    // })
}

findItems()

function updateItem() {
    UserModel.findByIdAndUpdate({_id: '5dbbfd563910402e304f9bd6'},
        {username: 'Jack'},(error, user) => {
            console.log('update', error, user)
        })
}
//updateItem();

function deleteItem() {
    UserModel.remove({_id: '5dbbfec25d3fd03a406d7db4'}, (error, doc)=> {
        console.log('remove', error, doc)
    })
}

// deleteItem()
// findItems()