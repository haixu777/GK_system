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

export { formatTime, formatEventLevel }
