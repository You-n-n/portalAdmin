/**
 * 格式化日期
 */
// export function formateDate(time){
//     if(!time) return ''
//     let date = new Date(time)
//     return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':'
//         + date.getMinutes() + ':' + date.getSeconds()
// }
export function formateDate(time, fmt) {
  let date = new Date(time)
  if (typeof time == 'string') {
    return time;
  }

  if (!fmt) fmt = "yyyy-MM-dd hh:mm:ss";

  if (!time || time == null) return null;
  var o = {
    'y+': date.getFullYear(), //年
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}