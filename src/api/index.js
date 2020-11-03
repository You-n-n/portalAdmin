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

export const reqLogin = (username, password,verification) => ajax(BASE + '/portal/login', {username,password,verification}, 'POST') 
//获取验证码
export const reqGetCode = () => ajax(BASE + '/img/getVerifyCode',{})
//获取 一级/二级列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/all' , {parentId})
//添加分类
export const reqAddCategorys = (categoryName,parentId,account_name) => ajax(BASE + '/manage/category/add' , {categoryName,parentId,account_name}, 'POST')
//更新分类
export const reqUpdateCategorys = (categoryName,id,account_name) => ajax(BASE + '/manage/category/update' , {categoryName,id,account_name}, 'POST')
//删除分类
export const reqDelCategorys = (id,account_name) => ajax(BASE + '/manage/category/del' , {id,account_name}, 'POST')
//获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId}, 'GET')
//获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/all' , ({pageNum, pageSize}), 'GET')
// 搜索商品分页列表 ,searchType用于判断()
export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType}) => ajax(BASE + '/manage/product/search' , {
    pageNum,
    pageSize,
    [searchType]: searchName,
    },
     'GET')
// 更新商品的状态
export const reqUpdateStatus = (id, productStatus) => ajax(BASE + '/manage/product/updateStatus' , {id, productStatus}, 'POST')
//获取留言板信息
export const reqGetAllMsgBoard = () => ajax(BASE + '/manage/msg/getMsgBoard' , {}, 'GET')


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