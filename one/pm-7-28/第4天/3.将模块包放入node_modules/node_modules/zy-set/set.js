
function Set(arr) {
    var items = []
    
    if (arr instanceof Array) {
        items = arr
    }
    else {
        items = [].concat(Array.from(arguments))
    }
    
    this.items = Set.unique(items)
}

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

Set.prototype.toString = function () {
    return '{' + this.items.toString() + '}'
}


Set.prototype.equals = function (set) {
    if (set instanceof Set) {
        var arr1 = this.items
        var arr2 = set.items

        if (arr1.length == arr2.length) {
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

Set.prototype.union = function (set) {
    var result = this.items.concat(set.items)
    return new Set(result)
}

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


// 将Set导出模块
module.exports = Set
