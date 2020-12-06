var mysql = require('mysql')
var mysqlConfig = require('../config/db')
var sql = require('../dao/dao')
var json = require('./json')
var pool = mysql.createPool(mysqlConfig)
var token = require('../plugins/token')

var userData = {
    // 登录验证
    vaildUser: function (req, res){
        pool.getConnection(function(err, connection){
            if (err) throw err
            var { uid, pwd } = req.body
            connection.query(sql.vaildUser, [uid, pwd], function(err, result){
                if (err) console.log(sql.vaildUser)
                if (result && result != '') {
                    var _result = result
                    result = {
                        method: 'vaild_user',
                        data: _result,
                        token: token.newToken(req)
                    }
                } else {
                    result = undefined
                }
                json(res, result)
                connection.release()
            })
        })
    },
    // 按分页列表查询指定的学生数据
    queryStd: function(req, res) {
        pool.getConnection(function(err, connection){
            if (err) throw err
            // 数据初始化
            var querySql
            var { query, pagenum, pagesize } = req.query
            var index = (pagenum - 1) * pagesize
                pagesize = Number(pagesize)
            // 是否有查询条件
            if (query) {
                // 匹配汉字
                if (/^[\u4e00-\u9fa5]{0,}$/.test(query)) {
                    querySql = sql.queryStdPart + ' WHERE name="' + query + '"'
                } 
                // 匹配宿舍号
                else if (/^[0-9]{3}$/.test(query)){
                    querySql = sql.queryStdPart + ' WHERE roomId=' + query
                }
                // 匹配学号
                else if (/^[0-9]{9,10}$/.test(query)){
                    querySql = sql.queryStdPart + ' WHERE id="' + query + '"'
                }
                else {
                    res.json({
                        status: 204,
                        msg: '无效关键字！'
                    })
                    return
                }
            } else {
                querySql = sql.queryStdAll
            }
            new Promise(
                function (resolve, reject) {
                    // 查询指定数量学生信息
                    connection.query(querySql, [index, pagesize], function(err, result){
                        if (err) console.log(sql.queryStd)
                        if (result) {
                            var _result = {
                                method: 'queryStd',
                                data: result
                            }
                        } else {
                            reject()
                        }
                        resolve(_result)
                    })
                }
            )
            .then(
                function (resolve, reject){
                    // 获取所查询学生信息总数
                    connection.query(sql.getTotal, function(err, result){
                        if (err) console.log(sql.queryStd)
                        if (result && result!='') {
                            resolve.total = result[0]['FOUND_ROWS()']
                        } else {
                            result = undefined
                            reject('获取总数失败')
                        }
                        res.json({
                            status: 200,
                            msg: '查询学生信息成功！',
                            ...resolve
                        })
                        connection.release()
                    })
                }
            ).catch(err => {
                res.json({
                    status: 200,
                    msg: '无相关信息！'
                })
                connection.release()
            })
        })
    },
    // 修改学生信息
    editStd: function (req, res){
        pool.getConnection(function(err, connection){
            if (err) throw err
            var arr = []
            for (item in req.body) {
                arr.push(req.body[item])
            }
            connection.query(sql.editStd, [...arr, arr[0]], function(err, result){
                if (err) console.log(sql.editStd)
                if (result && result != '') {
                    var _result = result
                    result = {
                        status: 200,
                        msg: '学生信息修改成功',
                        data: _result
                    }
                } else {
                    result = {
                        status: 500,
                        msg: '学生信息修改失败',
                        data: _result
                    }
                }
                res.json(result)
                connection.release()
            })
        })
    },
    // 删除学生信息
    delStd: function (req, res){
        pool.getConnection(function(err, connection){
            if (err) throw err
            var { id } = req.query
            connection.query(sql.delStd, [id], function(err, result){
                if (err) console.log(sql.delStd)
                if (result.affectedRows !== 0) {
                    var _result = result
                    result = {
                        status: 200,
                        msg: '学生信息删除成功'
                    }
                } else {
                    result = {
                        status: 500,
                        msg: '学生信息删除失败'
                    }
                }
                res.json(result)
                connection.release()
            })
        })
    },
    // 添加学生信息
    addStd: function (req, res){
        pool.getConnection(function(err, connection){
            if (err) throw err
            new Promise (
                function (resolve, reject){
                    var query = 'SELECT * FROM tb_students WHERE id=' + req.body.id
                    connection.query(query, function(err, result){
                        if (err) throw err
                        if (result && result!='') {
                            reject()
                        } else {
                            resolve()
                        }
                    })
                }
            )
            .then(
                function (resolve){
                    connection.query(sql.addStd, req.body, function(err, result){
                        if (err) console.log(sql.addStd)
                        if (result && result != '') {
                            result = {
                                status: 200,
                                msg: '学生信息添加成功'
                            }
                        } else {
                            result = {
                                status: 500,
                                msg: '学生信息添加失败'
                            }
                        }
                        res.json(result)
                        connection.release()
                    })
                }
            ).catch(err => {
                res.json({
                    status: 400,
                    msg: '用户学号已经存在!'
                })
                connection.release()
            })
        })
    },
    // 查询宿舍通过楼层
    queryRoomByFloor: function(req, res){
        pool.getConnection(function(err, connection){
            if (err) throw err
            var { floor } = req.query
            var querySql = 'SELECT * FROM tb_room WHERE floor=?'
            new Promise(
                function(resolve, reject){
                    connection.query(querySql, floor, function(err, result){
                        if(err) throw err
                        if(result){
                           result = {
                               status: 200,
                               msg: '查询宿舍成功！',
                               data: result
                           }
                        } else {
                            result = {
                                status: 500,
                                msg: '查询宿舍信息失败'
                            }
                        }
                        resolve(result)
                    })
                }
            )
            .then(
                function(resolve, reject){
                    connection.query('SELECT COUNT(*) AS num FROM tb_room', floor, function(err, result){
                        if(err) throw err
                        // console.log(result[0].num)
                        res.json({
                            ...resolve,
                            total:result[0].num
                        })
                        connection.release()
                    })
                }
            )
        })
    },
    // 提交考勤信息
    setCKInfo: function(req, res){
        pool.getConnection(function(err, connection){
            if (err) throw err
            var arr = req.query
            // console.log(arr[0])
            var date = new Date().toLocaleDateString()
            var tbName = 'tb_nck' + date.replace(/\//g, '-')
            connection.release()
            var querySql = 'select tb_nck2020-11-16 from information_schema.tables where table_schema="k5"'
            new Promise(
                function(resolve, reject){
                    connection.query(querySql, function(err, result){
                        if(err) throw err
                        console.log(result)
                    })
                }
            )
        })
    }
}

module.exports = userData
