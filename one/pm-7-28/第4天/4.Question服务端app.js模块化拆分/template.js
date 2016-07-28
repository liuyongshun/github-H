const template = require("art-template")

//禁用缓存，开发时使用，上线时去掉
template.config("cache", false)

module.exports = template