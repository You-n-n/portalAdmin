/**
 * 包含应用中所有接口请求函数的模块
 */

import ajax from './ajax'

const BASE = ''
 // 登录
//  export function reqLogin(username,password){
//     return ajax('/portal/login', {username,password}, 'POST')
//  }

export const reqLogin = (username, password) => ajax(BASE + '/portal/login', {username,password}, 'POST') 


// 添加用户
//export const reqAddUser = () => ajax('manage/user/add', user, 'POST')