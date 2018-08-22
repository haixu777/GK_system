function formatTime (time) {
  var time = new Date(time)
  return time.getFullYear() + '' + ((time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1)) + '' + (time.getDate() < 10 ? '0' + time.getDate() : time.getDate())
}

function formatEventLevel (level) {
  if (!level) return []
  if (level instanceof Array) {
    return Number(level.join(','))
  }
  var str =  level
  if (str.indexOf(',') === -1) {
    return [Number(str)]
  } else {
    var arr = level.split(',')
    var res = []
    // arr.forEach((level) => {
    //   res.push(Number(level))
    // })
    arr.forEach((function(level) {
      res.push(Number(level))
    }))
    return res
  }
}

const Cookie = {
  get: function (name) {
    var match = document.cookie.match(new RegExp(name + '=([^;]+)'));
    if (match) return match[1];
  },
  set: function (name, value) {
    const Days = 7
    const exp = new Date()
    exp.setTime(exp.getTime() + Days*24*60*60*1000)
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString()
  },
  del: function (name) {
    const exp = new Date()
    exp.setTime(exp.getTime() - 1)
    const cval=this.get(name)
    if(cval!=null)
    document.cookie= name + "="+cval+";expires="+exp.toGMTString()
  },
  clear: function () {
    const keys=document.cookie.match(/[^ =;]+(?=\=)/g)
    if (keys) {
      for (var i = keys.length; i--;)
        document.cookie=keys[i]+'=0;expires=' + new Date( 0).toUTCString()
    }
  }
}

function formatAccountList (accountList) {
  var resObj = []
  for (var i=0; i<accountList.length; i++) {
    if (accountList[i]['publish_account']) {
      resObj.push(accountList[i])
    }
  }
  return resObj
}

function myTrim(operation,x) {
  var res = ''
  if (x) {
    res = x.replace(/^\s+|\s+$/gm, '')
  } else {
    if (operation === 'type') {
      res = '综合'
    } else if (operation === 'control'){
      res = '查删'
    }
  }
  return res
}

/*
 * 统计管控总数，用递归遍历整个tree，最终输出一个可以利用iView展示的Table
 * 输入：某一跟节点事件
 * 输出：叶子节点管控条目总和
*/
function formatTotalControl (tree) {
  var aOperation = {}
  var aContent = {}
  var isFirstime = true

  // 获取单个节点
  function traverseNode (node) {
    node.control_programs.forEach(function(control) {
      if (isFirstime) {
        aOperation[myTrim('control', control.control_operation)] = 1
        aContent[myTrim('type', control.sample_type)] = 1
      } else {
        for (var i = 0; i < data.length; i++) {
          for (var j = 1; j < thead.length; j++) {
            if (myTrim('control', control.control_operation) === data[i].operation && myTrim('type', control.sample_type) === thead[j].key)
              data[i][thead[j].key] += control.control_number
          }
        }
      }
    })
  }

  // 遍历tree
  function traverseTree (node) {
    if (!node) return
    traverseNode(node)
    if (node.children && node.children.length > 0) {
      for (var i = 0; i < node.children.length; i++) {
        traverseTree(node.children[i])
      }
    }
  }
  traverseTree(tree)

  var thead = [{title: ' ', key: 'operation'}]
  var data = []

  for (var prop in aContent) {
    thead.push({
      title: prop,
      key: prop
    })
  }
  for (var prop in aOperation) {
    data.push({
      operation: prop
    })
  }
  for (var i = 0; i < data.length; i++) {
    for (var j = 1; j < thead.length; j++) {
      data[i][thead[j].key] = 0
    }
  }
  isFirstime = false
  traverseTree(tree)

  return {
    columns: thead,
    data: data
  }
}

export { formatTime, formatEventLevel, Cookie, formatAccountList, formatTotalControl }
