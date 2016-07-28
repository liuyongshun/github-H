


/*------------------构造函数测试-----------------*/
// var set1 = new Set(1, 2, 4, 6, 3, 2, 6, 8, 2)
// // 检查集合创建是否正确，主要检查的是排重功能
// console.assert(set1.equals(new Set(1,2,4,6,3,8)), '创建集合错误0')

// var set2 = new Set(2,4,6,8,9)
// console.assert(set2.equals(new Set(2,4,6,8,9)), '创建集合错误1')

// console.log('构造函数测试完成')

// /*------------------并集测试-----------------*/

// // 并集运算应该将计算结果（算出来并集）返回
var set3 = set1.union(set2)

// 检查返回结果是否是集合
console.assert(set3 instanceof Set, '并集计算结果不是集合')
// 将程序计算的结果和预设的结果进行比较
console.assert(set3.equals(new Set(1,2,4,6,3,8,9)), '并集计算错误')
// 检查set1、set2经过计算后有没有变化，期望的结果是运算后原集合不变
console.assert(set1.equals(new Set(1,2,4,6,3,8)), '并集计算后集合1应该是不变的')
console.assert(set2.equals(new Set(2,4,6,8,9)), '并集计算后集合2应该是不变的')

console.log('并集测试完成')

// /*------------------交集测试-----------------*/

// var set4 = set1.intersection(set2)

// // 检查返回结果是否是集合
// console.assert(set4 instanceof Set, '交集计算结果不是集合')
// console.assert(set4.equals(new Set(2,4,6,8)), '交集计算错误')
// console.assert(set1.equals(new Set(1,2,4,6,3,8)), '交集计算后集合1应该是不变的')
// console.assert(set2.equals(new Set(2,4,6,8,9)), '交集计算后集合2应该是不变的')

// console.log('交集测试完成')

// /*------------------差集测试-----------------*/

// var set5 = set1.difference(set2)

// console.assert(set5 instanceof Set, '差集计算结果不是集合')
// console.assert(set5.equals(new Set(1,3)), '差集计算错误')
// console.assert(set1.equals(new Set(1,2,4,6,3,8)), '差集计算后集合1应该是不变的')
// console.assert(set2.equals(new Set(2,4,6,8,9)), '差集计算后集合2应该是不变的')

// var set6 = set2.difference(set1)

// console.assert(set6 instanceof Set, '交换差集计算结果不是集合')
// console.assert(set6.equals(new Set(9)), '交换差集计算错误')
// console.assert(set1.equals(new Set(1,2,4,6,3,8)), '交换差集计算后集合1应该是不变的')
// console.assert(set2.equals(new Set(2,4,6,8,9)), '交换差集计算后集合2应该是不变的')

// console.log('差集测试完成')
