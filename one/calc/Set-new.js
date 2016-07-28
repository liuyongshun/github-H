/*

通常情况下是先写代码然后再测试
    ----常规开发过程
    
先写测试用例（编写各种测试语句，核对代码在各种情况下的预期结果）
写好测试用例后，将测试用例交给开发人员
开发人员在编写代码的过程中反复使用测试用例检查代码，
直到所有测试用例全部通过
    ----测试驱动开发   
    ----Test Driven Development   TDD

*/

// 集合构造函数，支持2种传参形式
function Set(arr) {
    var items = []
    
    // 检查第1个参数是否是数组
    if (arr instanceof Array) {
        items = arr
    }
    else {
        items = [].concat(Array.from(arguments))
    }
    
    this.items = Set.unique(items)
}

// 排重方法，类方法
Set.unique = function (arr) {
    var result = []
    var length = arr.length

    for (var i = 0; i < length; i++) {
        var a = arr[i]
        for (var j = i + 1; j < length; j++) {
            var b = arr[j]

            if (a === b) {
                break
            }
            else {
                if (j == length - 1) {
                    result.push(a)
                }
            }
        }
    }
    result.push(arr[length - 1])
    return result
}

// 重写toString()方法
Set.prototype.toString = function () {
    return '{' + this.items.toString() + '}'
}

// 判断2个集合是否相等：元素个数相同，不分顺序
Set.prototype.equals = function (set) {
    // 判断set是否由Set构造函数创建，不是则直接返回false
    if (set instanceof Set) {
        var arr1 = this.items
        var arr2 = set.items
        // 判断内部的元素个是否相等，不相等则直接返回false
        if (arr1.length == arr2.length) {
            // 合并排重后，元素个数仍然相等则集合相等
            var arr = Set.unique(arr1.concat(arr2))
            return arr.length == arr1.length
        }
        else {
            return false
        }
    }
    else {
        return false
    }
}

// 并集：合并
Set.prototype.union = function (set) {
    var result = this.items.concat(set.items)
    return new Set(result)
}

// 交集：求相同
Set.prototype.intersection = function (set) {
    var arr1 = this.items
    var arr2 = set.items
    var result = []

    for (var i = 0; i < arr1.length; i++) {
        var a = arr1[i]
        for (var j = 0; j < arr2.length; j++) {
            var b = arr2[j]

            if (a === b) result.push(a)
        }
    }

    return new Set(result)
}

// 差集：减去 this - set，从 this 中排除 set 中的元素
Set.prototype.difference = function (set) {
    var arr1 = this.items
    var arr2 = set.items
    var result = []

    for (var i = 0; i < arr1.length; i++) {
        var a = arr1[i]
        for (var j = 0; j < arr2.length; j++) {
            var b = arr2[j]

            if (a === b) {
                break
            }
            else {
                if (j == arr2.length - 1) result.push(a)
            }
        }
    }

    return new Set(result)
}