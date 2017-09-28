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

function formatTagList (tagList, shouldBind, auth) {
  var personal = []
  var group = []
  var _global = []
  if (shouldBind) {// 绑定tag使用
    tagList.forEach(function(tag) {
      if (tag.domain == '全局') {
        if (auth.indexOf('管理员') !== -1) {
          _global.push(tag)
        } else {
          tag.disabled = true
          _global.push(tag)
        }
      } else if (tag.domain == '组内') {
        if (auth.indexOf('管理员') !== -1 || auth.indexOf('高级') !== -1) {
          group.push(tag)
        } else {
          tag.disabled = true
          group.push(tag)
        }
      } else if (tag.domain == '个人') {
        personal.push(tag)
      }
    })
  } else {// 查看tagList使用
    tagList.forEach(function(tag)  {
      if (tag.domain == '全局') {
        _global.push(tag)
      } else if (tag.domain == '组内') {
        group.push(tag)
      } else if (tag.domain == '个人') {
        personal.push(tag)
      }
    })
  }
  var resObj = {
    personalList: personal,
    groupList: group,
    globalList: _global
  }
  return resObj
  // return {personal, group, _global}
}

export { formatTime, formatEventLevel, Cookie, formatAccountList, formatTagList }
