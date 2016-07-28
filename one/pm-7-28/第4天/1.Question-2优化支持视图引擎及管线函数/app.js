//引入相关模块
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const fs = require('fs')
const multer = require('multer')
const template = require("art-template")

//配置上传头像目录及文件名
const storage = multer.diskStorage({
    destination: 'www/uploads',
    filename: function (req, file, callback) {
        var petname = req.cookies.petname
        var index = file.originalname.lastIndexOf(".")
        var fileExtendName = file.originalname.substr(index)
        callback(null, `${petname + fileExtendName}`)
    }
})
const uploads = multer({ storage })

//禁用缓存，开发时使用，上线时去掉
template.config("cache", false)

const app = express()

//设置静态资源文件所在目录
app.use(express.static('www'))
//设置数据及cookie解析
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

// 指定以.html结尾的文件使用的解析引擎
//.cshtml, .htm
app.engine(".html", template.__express)
// 指定使用html视图引擎
app.set("view engine", "html")

//以下是各种接口
/*--------------------注册begin--------------------*/
//只去定位视图文件   router路由
app.get('/user/register', (req, res) => {
    //第一个参数是模板或视图文件的路径（不带后缀）
    //第二个参数是携带的数据，让视图可动态显示
    res.render('user/register', {
        title: '注册',
        pageTitile: "问答-注册"
    })
})
//处理业务逻辑   api接口
app.post('/api/user/register', (req, res) => {
    req.body.ip = handleIP(req.ip)
    req.body.time = format(new Date())

    fs.exists('www/users', exists => {
        if (exists) {
            saveRegisterInfo(res, req)
        }
        else {
            fs.mkdir('www/users', err => {
                if (err) {
                    send(res, 'file error', '抱歉，系统错误...')
                }
                else {
                    saveRegisterInfo(res, req)
                }
            })
        }
    })
})
/*--------------------注册end--------------------*/

/*--------------------登录begin--------------------*/
app.get('/user/signin', (req, res) => {
    res.render('user/signin', {
        title: '登录',
        rightNav: 'register'
    })
})

app.post('/api/user/signin', (req, res) => {
    var fileName = `www/users/${req.body.petname}.txt`

    fs.exists(fileName, exists => {
        if (!exists) {
            send(res, 'register error', '用户名未注册！')
            return;
        }
        else {
            fs.readFile(fileName, (err, data) => {
                if (err) {
                    send(res, 'file error', '抱歉，系统错误...')
                    return;
                }
                else {
                    var user = JSON.parse(data)
                    if (user.password == req.body.password) {

                        //把昵称字段存储到cookie
                        res.cookie('petname', req.body.petname)

                        send(res, 'success', '登录成功...')
                    }
                    else {
                        send(res, 'signin error', '密码错误！')
                    }
                }
            })
        }
    })
})
/*--------------------登录end--------------------*/

/*--------------------退出begin--------------------*/
app.get('/user/signout', (req, res) => {
    res.clearCookie('petname')
    //res.status(200).json({ code: 'success' })

    // 在服务端控制浏览器页面跳转
    // 重定向
    res.redirect('/')
})
/*--------------------退出end--------------------*/

/*--------------------提问begin--------------------*/
// 添加sign请求处理函数
// 判断用户是否登录，如果未登录则重定向
// 到登录页，如果已登录则交给后面箭头
// 函数处理
app.get('/ask', sign, (req, res) => {
    res.render('ask', {
        title: '提问'
    })
})

app.post('/api/ask', sign, (req, res) => {
    var petname = req.cookies.petname

    if (!petname) {
        send(res, 'signin error', '请重新登录...')
        return
    }

    var time = new Date()
    var fileName = time.getTime();

    req.body.petname = petname
    req.body.ip = handleIP(req.ip)
    req.body.time = format(time)
    req.body.fileName = fileName

    fs.exists('www/questions', exists => {
        if (exists) {
            saveAskInfo(time, fileName, res, req)
        }
        else {
            fs.mkdir('www/questions', err => {
                if (err) {
                    send(res, 'file error', '抱歉，系统错误...')
                }
                else {
                    saveAskInfo(time, fileName, res, req)
                }
            })
        }
    })
})
/*--------------------提问end--------------------*/

/*--------------------头像begin--------------------*/
app.get('/user/photo', sign, (req, res) => {
    res.render('user/photo', {
        title: '修改头像'
    })
})

app.post('/api/user/photo', sign, uploads.single('photo'), (req, res) => {
    res.status(200).json({ code: 'success', message: '上传成功' })
})
/*--------------------头像end--------------------*/

/*--------------------首页begin--------------------*/
app.get('/', (req, res) => {
    fs.readdir('www/questions', (err, files) => {
        if (err) {
            send(res, 'file error', '抱歉，系统错误...')
        }
        else {
            //把文件列表反转顺序，目的把最新提问的文件列表放到前面显示
            files = files.reverse()
            var questions = []

            readQuestions(0, files, questions, function () {
                //send(res, 'success', '读取数据成功！', questions)
                res.render('index', {
                    user: req.cookies.petname,
                    questions
                })
            })
        }
    })
})
/*--------------------首页end--------------------*/

/*--------------------回答begin--------------------*/
//用到友好的URL和页面传值知识点及管线函数
app.get('/answer/:question', sign, (req, res) => {
    res.render('answer', {
        title: '回答',
        question: req.params.question
    })
})

app.post('/api/answer', sign, (req, res) => {
    var petname = req.cookies.petname

    if (!petname) {
        send(res, 'signin error', '请重新登录...')
        return
    }
    console.log(req.body)
    var filename = `www/questions/${req.body.question}.txt`
    console.log(filename)

    req.body.petname = petname
    req.body.ip = handleIP(req.ip)
    req.body.time = format(new Date())

    fs.readFile(filename, (err, data) => {
        if (err) {
            send(res, 'file error', '抱歉，系统错误...')
        }
        else {
            var question = JSON.parse(data)
            if (!question.answers) {
                question.answers = []
            }

            question.answers.push(req.body)

            fs.writeFile(filename, JSON.stringify(question), err => {
                if (err) {
                    send(res, 'file error', '抱歉，系统错误...')
                }
                else {
                    send(res, 'success', '回答提交成功！')
                }
            })
        }
    })
})
/*--------------------回答end--------------------*/

app.get("/test", (req, res) => {
    res.render('test')
})

/*--------------------监听begin--------------------*/
app.listen(3000, () => console.log('服务正在运行...请访问http://127.0.0.1:3000/'))
/*--------------------监听end--------------------*/

/*--------------------公用begin--------------------*/
//判断是否登录的管线函数
function sign(req, res, next){
    //判断有没有登录，用cookies中petname
    if(req.cookies.petname){
        next()
    }
    else{
        //如果是用ajax请求，直接返回错误
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


