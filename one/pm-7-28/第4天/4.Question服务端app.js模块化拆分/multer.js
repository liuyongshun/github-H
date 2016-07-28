const multer = require('multer')

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

module.exports = multer({ storage })