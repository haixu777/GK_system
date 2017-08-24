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

export { formatTime, formatEventLevel, Cookie, formatAccountList }
