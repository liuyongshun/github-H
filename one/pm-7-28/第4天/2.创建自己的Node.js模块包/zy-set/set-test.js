// 只需要设置好package.json就可以可以变成模块包了
// package中的【 "main": "set.js" 】指定模块包的入口
// 使用require()方法加载时得到的是set.js中的exports对象

// 在模块包的内部导入模块
//把set.js当成set-test.js的依赖加载到此文件，才可以使用Set对象
const Set = require('./lib/set.js')

console.log(module.filename)

/*------------------构造函数-----------------*/

var set1 = new Set(1, 2, 4, 6, 3, 2, 6, 8, 2)
console.assert(set1.equals(new Set(1,2,4,6,3,8)), '创建集合错误')

var set2 = new Set(2,4,6,8,9)
console.assert(set2.equals(new Set(2,4,6,8,9)), '创建集合错误')

console.log('构造函数测试完成')

/*------------------并集-----------------*/

var set3 = set1.union(set2)

console.assert(set3 instanceof Set, '并集计算结果不是集合')
console.assert(set3.equals(new Set(1,2,4,6,3,8,9)), '并集计算错误')
console.assert(set1.equals(new Set(1,2,4,6,3,8)), '并集计算后集合1应该是不变的')
console.assert(set2.equals(new Set(2,4,6,8,9)), '并集计算后集合2应该是不变的')

console.log('并集测试完成')

/*------------------交集-----------------*/

var set4 = set1.intersection(set2)

console.assert(set4 instanceof Set, '交集计算结果不是集合')
console.assert(set4.equals(new Set(2,4,6,8)), '交集计算错误')
console.assert(set1.equals(new Set(1,2,4,6,3,8)), '交集计算后集合1应该是不变的')
console.assert(set2.equals(new Set(2,4,6,8,9)), '交集计算后集合2应该是不变的')

console.log('交集测试完成')

/*------------------差集-----------------*/

var set5 = set1.difference(set2)

console.assert(set5 instanceof Set, '差集计算结果不是集合')
console.assert(set5.equals(new Set(1,3)), '差集计算错误')
console.assert(set1.equals(new Set(1,2,4,6,3,8)), '差集计算后集合1应该是不变的')
console.assert(set2.equals(new Set(2,4,6,8,9)), '差集计算后集合2应该是不变的')

var set6 = set2.difference(set1)

console.assert(set6 instanceof Set, '交换差集计算结果不是集合')
console.assert(set6.equals(new Set(9)), '交换差集计算错误')
console.assert(set1.equals(new Set(1,2,4,6,3,8)), '交换差集计算后集合1应该是不变的')
console.assert(set2.equals(new Set(2,4,6,8,9)), '交换差集计算后集合2应该是不变的')

console.log('差集测试完成')
