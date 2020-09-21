/**
 * 包含应用中所有接口请求函数的模块
 */
import jsonp from 'jsonp'
import ajax from './ajax'
import { message } from 'antd'

const BASE = ''
 // 登录
//  export function reqLogin(username,password){
//     return ajax('/portal/login', {username,password}, 'POST')
//  }

export const reqLogin = (username, password) => ajax(BASE + '/portal/login', {username,password}, 'POST') 

//获取 一级/二级列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/all' , {parentId})
//添加分类
export const reqAddCategorys = (categoryName,parentId) => ajax(BASE + '/manage/category/add' , {categoryName,parentId}, 'POST')
//更新分类
export const reqUpdateCategorys = (categoryName,id) => ajax(BASE + '/manage/category/update' , {categoryName,id}, 'POST')
//删除分类
export const reqDelCategorys = (id) => ajax(BASE + '/manage/category/del' , {id}, 'POST')

// 添加用户
//export const reqAddUser = () => ajax('manage/user/add', user, 'POST')

/**
 * json 请求的接口请求函数
 */
export const reqWeather = () => {

return  new  Promise((resolve, reject) => {
    const url = 'https://tianqiapi.com/api?version=v6&appid=25784789&appsecret=Jg3n4SdS'
    // 发送jsonp请求
    jsonp(url, {}, (err,data) =>{
        //console.log('jsonp()',err, data)
        //如果成功了
        if(!err){
            const {wea, city} = data
            resolve({wea, city})
        }else{
            //失败了
            message.error('获取天气信息失败!')
        }
    })
})
}
reqWeather()