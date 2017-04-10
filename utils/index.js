function formatTime (time) {
  var time = new Date(time * 1000)
  return time.getFullYear() + '' + ((time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1)) + '' + (time.getDate() < 10 ? '0' + time.getDate() : time.getDate())
}

export { formatTime }
