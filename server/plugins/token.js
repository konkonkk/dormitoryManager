var jwt = require('jsonwebtoken');

// 生成token
function tokenVerify (req, res, next) {
    let token = req.get("Authorization")
    jwt.verify(token, "secretKey", (err, decode)=> {
        if (err) {  //  时间失效的时候 || 伪造的token
            res.json({
                status: 405,
                msg: 'token失效，没有权限！'
            })
            return
        }
        next()
    })
}
// 验证
function newToken(req) {
    return jwt.sign({"uid": req.body.uid}, "secretKey", {"expiresIn": 60 * 60 * 24})
}

module.exports = {
    tokenVerify: tokenVerify,
    newToken: newToken
}