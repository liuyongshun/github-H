const fs = require('fs')

/*--------------------公用begin--------------------*/
//判断是否登录的管线函数
function sign(req, res, next){
    if(req.cookies.petname){
        next()
    }
    else{
        if(req.xhr){
            // req.xhr通过请求头中的X-Requested-With判断是
            // 否是Ajax请求，Ajax请求默认都带有这个请求头
            send(res, 'signin error', '请重新登录...')
        }
        else{
            res.redirect('/user/signin')
        }
    }
}
//给客户端响应数据
function send(res, code, message, data) {
    res.status(200).json({ code, message, data })
}
//保存注册信息
function saveRegisterInfo(res, req) {
    //${}当作一个点位符
    var fileName = `www/users/${req.body.petname}.txt`
    //var fileName = 'www/users/' + req.body.petname + ".txt";

    fs.exists(fileName, exists => {
        if (exists) {
            send(res, 'registered', '用户名已经注册过了！')
        }
        else {
            fs.appendFile(fileName, JSON.stringify(req.body), err => {
                if (err) {
                    send(res, 'file error', '抱歉，系统错误...')
                }
                else {
                    send(res, 'success', '恭喜，注册成功！请登录...')
                }
            })
        }
    })
}
//保存提问信息
function saveAskInfo(time, fileName, res, req) {
    var fileName = `www/questions/${fileName}.txt`

    fs.appendFile(fileName, JSON.stringify(req.body), err => {
        if (err) {
            send(res, 'file error', '抱歉，系统错误...')
        }
        else {
            send(res, 'success', '问题提交成功！')
        }
    })
}
//读取问答列表文件到数组中
function readQuestions(i, files, questions, complete) {
    if (i < files.length) {
        fs.readFile(`www/questions/${files[i]}`, (err, data) => {
            if (!err) {
                questions.push(JSON.parse(data))
            }
            readQuestions(++i, files, questions, complete)
        })
    }
    else {
        complete()
    }
}

//转换日期格式
function format(date) {
    var dateStr = ""

    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var h = date.getHours()
    var m = date.getMinutes()
    var s = date.getSeconds()

    month = month < 10 ? "0" + month : month
    day = day < 10 ? "0" + day : day
    h = h < 10 ? "0" + h : h
    m = m < 10 ? "0" + m : m
    s = s < 10 ? "0" + s : s

    //生成格式：2016-07-16 14:51:12
    dateStr = year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s

    return dateStr
}

//处理IP
function handleIP(IP) {
    var result = IP
    if (result.endsWith("127.0.0.1")) {
        result = "127.0.0.1"
    } else {
        if (result.indexOf(":") > -1) {
            var index = result.lastIndexOf(":")
            result = result.substr(index)
        }
    }
    return result
}
/*--------------------公用end--------------------*/

// 导出多个函数，以下3种写法都可以

// module.exports = {
//     sign: sign, 
//     send: send,
//     saveRegisterInfo: saveRegisterInfo,
//     saveAskInfo: saveAskInfo,
//     readQuestions: readQuestions,
//     format: format,
//     handleIP: handleIP
// }

//如果属性名称和属性值是同样的话，可以省略一个
// module.exports = {sign, send, saveRegisterInfo, 
//     saveAskInfo, readQuestions, 
//     format, handleIP}

exports.send = send
exports.sign = sign
exports.saveRegisterInfo = saveRegisterInfo
exports.saveAskInfo = saveAskInfo
module.exports.readQuestions = readQuestions
module.exports.format = format
module.exports.handleIP = handleIP



