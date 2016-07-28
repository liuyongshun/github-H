//引入相关模块
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const fs = require('fs')
const uploads = require('./multer.js')
const template = require('./template')
const util = require('./utilities')

const app = express()

//设置静态资源文件所在目录
app.use(express.static('www'))
//设置数据及cookie解析
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
// 指定以.html结尾的文件使用的解析引擎
app.engine(".html", template.__express)
// 指定使用html视图引擎
app.set("view engine", "html")

//以下是各种接口
/*--------------------注册begin--------------------*/
app.get('/user/register', (req, res) => {
    res.render('user/register', {
        title: '注册'
    })
})

app.post('/api/user/register', (req, res) => {
    req.body.ip = util.handleIP(req.ip)
    req.body.time = util.format(new Date())

    fs.exists('www/users', exists => {
        if (exists) {
            util.saveRegisterInfo(res, req)
        }
        else {
            fs.mkdir('www/users', err => {
                if (err) {
                    util.send(res, 'file error', '抱歉，系统错误...')
                }
                else {
                    util.saveRegisterInfo(res, req)
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
            util.send(res, 'register error', '用户名未注册！')
            return;
        }
        else {
            fs.readFile(fileName, (err, data) => {
                if (err) {
                    util.send(res, 'file error', '抱歉，系统错误...')
                    return;
                }
                else {
                    var user = JSON.parse(data)
                    if (user.password == req.body.password) {

                        //把昵称字段存储到cookie
                        res.cookie('petname', req.body.petname)

                        util.send(res, 'success', '登录成功...')
                    }
                    else {
                        util.send(res, 'signin error', '密码错误！')
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
app.get('/ask', util.sign, (req, res) => {
    res.render('ask', {
        title: '提问'
    })
})

app.post('/api/ask', util.sign, (req, res) => {
    var petname = req.cookies.petname

    if (!petname) {
        util.send(res, 'signin error', '请重新登录...')
        return
    }

    var time = new Date()
    var fileName = time.getTime();

    req.body.petname = petname
    req.body.ip = util.handleIP(req.ip)
    req.body.time = util.format(time)
    req.body.fileName = fileName

    fs.exists('www/questions', exists => {
        if (exists) {
            util.saveAskInfo(time, fileName, res, req)
        }
        else {
            fs.mkdir('www/questions', err => {
                if (err) {
                    util.send(res, 'file error', '抱歉，系统错误...')
                }
                else {
                    util.saveAskInfo(time, fileName, res, req)
                }
            })
        }
    })
})
/*--------------------提问end--------------------*/

/*--------------------头像begin--------------------*/
app.get('/user/photo', util.sign, (req, res) => {
    res.render('user/photo', {
        title: '修改头像'
    })
})

app.post('/api/user/photo', util.sign, uploads.single('photo'), (req, res) => {
    res.status(200).json({ code: 'success', message: '上传成功' })
})
/*--------------------头像end--------------------*/

/*--------------------首页begin--------------------*/
app.get('/', (req, res) => {
    fs.readdir('www/questions', (err, files) => {
        if (err) {
            util.send(res, 'file error', '抱歉，系统错误...')
        }
        else {
            //把文件列表反转顺序，目的把最新提问的文件列表放到前面显示
            files = files.reverse()
            var questions = []

            util.readQuestions(0, files, questions, function () {
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
app.get('/answer/:question', util.sign, (req, res) => {
    res.render('answer', {
        title: '回答',
        question: req.params.question
    })
})

app.post('/api/answer', util.sign, (req, res) => {
    var petname = req.cookies.petname

    if (!petname) {
        send(res, 'signin error', '请重新登录...')
        return
    }
    console.log(req.body)
    var filename = `www/questions/${req.body.question}.txt`
    console.log(filename)

    req.body.petname = petname
    req.body.ip = util.handleIP(req.ip)
    req.body.time = util.format(new Date())

    fs.readFile(filename, (err, data) => {
        if (err) {
            util.send(res, 'file error', '抱歉，系统错误...')
        }
        else {
            var question = JSON.parse(data)
            if (!question.answers) {
                question.answers = []
            }

            question.answers.push(req.body)

            fs.writeFile(filename, JSON.stringify(question), err => {
                if (err) {
                    util.send(res, 'file error', '抱歉，系统错误...')
                }
                else {
                    util.send(res, 'success', '回答提交成功！')
                }
            })
        }
    })
})
/*--------------------回答end--------------------*/

/*--------------------监听begin--------------------*/
app.listen(3000, () => console.log('服务正在运行...请访问http://127.0.0.1:3000/'))
/*--------------------监听end--------------------*/

