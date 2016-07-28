// 集合构造函数，支持2种传参形式
function Set(arr) {
    var items = []
    
    // 检查第1个参数是否是数组
    if (arr instanceof Array) {
        items = arr
    }
    else {
        console.log(3)
        console.log(Array.from(arguments))
        console.log(items)
        items = [].concat(Array.from(arguments))
        console.log(items)
    }
    
    this.items = Set.unique(items)
}

// 排重方法，类方法
Set.unique = function (arr) {
    var result = []
    var length = arr.length

    for (var i = 0; i < length; i++) {
        //取到数组中的当前值
        var a = arr[i]

        //循环length - i
        for (var j = i + 1; j < length; j++) {
            //取到数组中的当前值的后面的所有的数据
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
    //数组的toString()默认情况会把每项用,连接
    return '{' + this.items.toString() + '}'
}

// 判断2个集合是否相等：元素个数相同，不分顺序
Set.prototype.equals = function (set) {
    // 判断set是否由Set构造函数创建，不是则直接返回false
    if (set instanceof Set) {
        //判断的是去重过后的项
        //1,2,2,4与1,2,4
        var arr1 = this.items//1,2,4
        var arr2 = set.items//1,2,4
        console.log(arr1)
        console.log(arr2)
        // 判断内部的元素个是否相等，不相等则直接返回false
        if (arr1.length == arr2.length) {
            // 合并排重后，元素个数仍然相等则集合相等
            //arr1.concat(arr2)//1,2,4,1,2,4
            //Set.unique(arr1.concat(arr2))//1,2,4
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

// 作业：请参考测试用例要求完成以下方法
// 要求通过测试用例

// 并集：合并
Set.prototype.union = function(set){

}

// 交集：求相同
Set.prototype.intersection = function(set){

}

// 差集：减去 this - set 
Set.prototype.difference = function(set){
    
}