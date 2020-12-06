var express = require('express')
var handel = require('./src/handel')
var token = require('./plugins/token')
var app = express()
var port = 3000
// 处理客户端json数据
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

app.listen(port, () => {
    console.log('yes sir')
})

// 登录验证接口
app.post('/vaild_user', jsonParser, function(req, res){
    handel.vaildUser(req, res)
})
app.use(token.tokenVerify)
// 获取学生
app.get('/queryStd', function(req, res){
    handel.queryStd(req, res)
})
// 修改学生
app.post('/editStd', jsonParser, function(req, res){
    handel.editStd(req, res)
})
// 删除学生
app.delete('/delStd', function(req, res){
    handel.delStd(req, res)
})
// 添加学生
app.post('/addStd', jsonParser, function(req, res){
    handel.addStd(req, res)
})
// 提交考勤信息
app.get('/setCKInfo', function(req, res){
    handel.setCKInfo(req, res)
})
// 查询宿舍通过楼层
app.get('/queryRoomByFloor', function(req, res){
    handel.queryRoomByFloor(req, res)
})

// 测试
// app.get('/test', function(req, res){
//     res.json({
//         status: 200,
//         msg: 'token yes!'
//     })
// })