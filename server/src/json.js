var json = function(res, result){
    if (typeof result === 'undefined') {
        res.json({
            status: '1',
            msg: '操作失败！'
        })
    }
    else if (result.method === 'select') {
        res.json({
            status: '200',
            msg: '查询用户名成功！'
        })
    }
    else if (result.method === 'vaild_user') {
        res.json({
            status: '200',
            msg: '用户登录成功！',
            data: result.data,
            token: result.token
        })
    }
    else if (result.method === 'queryStd') {
        res.json({
            status: '200',
            msg: '查询学生信息成功！',
            ...res
        })
    }
}

module.exports = json