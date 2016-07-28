const express = require("express")

const app = express()

function utf8(req, res, next){
    // res.set()设置响应头，
    // 还可以写成res.set({})批量设置响应头
    // 在Content-Type响应头中设置编码可以解决乱码问题
    res.set('Content-Type', 'text/html; charset=utf-8')
    
    console.log('设置字符编码')
    
    // 将请求交给下一个函数处理
    next()
}

function first(req, res, next){
    //从URL地址中取客户端传过的数据，queryString
    var name = req.query.name
    var age = req.query.age

    name = req.params.name
    age = req.params.age

    // 获取客户端数据：
    // 1、获取url中的querystring(?后面的name=value，通过GET方法发送)
    //     req.query.name
    // 2、获取请求体中的数据（通过POST方法发送，有多种编码方式）
    //     req.body.name
    //     如果是 urlencoded 编码需要使用 body-parser 模块
    //     如果是 multipart/form-data 需要使用 multer 模块
    // 3、获取cookie中的数据
    //     req.cookies.name
    //     需要使用 cookie-parser 模块
    // 4、获取请求头中的数据
    //     req.get('name')
    // 4.1设置响应的请求头信息
    //      res.set("name", "value");
    // 5、获取url路径Path中的数据
    //     req.params.age
    //     需要设置请求地址模式   '/hi/:age'
    
    // 将参数放入Path相对于将参数放入QueryString
    // 更加容易被人和搜索引擎识别
    // 因此被称为友好URL，friendly url
    console.log("我是请求的第1步" + name + age)

    res.set("home", "index.html")
    //把执行转移到下一步
    next()
}

function second(req, res, next){
    console.log("我是请求的第2步")

    next()
}

function third(req, res, next){
    console.log("我是请求的第3步")

    next()
}

// app.get("/user/login", utf8, first, second, third, (req, res) => {
//     console.log("我是最后的回调函数")
//     res.status(200).send("给客户端返回信息")
// })

//1.接口URL，2.管线方法， 3.回调函数
app.get("/user/login/:name/:age", [utf8, first, second, third],(req, res) => {
    console.log("我是最后的回调函数")
    res.status(200).send("给客户端返回信息")
})

app.listen(3000, ()=>{
    console.log("server is running...")
})