/**
 * 包含应用中所有接口请求函数的模块
 */
import jsonp from 'jsonp'
import ajax from './ajax'
import { message } from 'antd'

const BASE = '/go'
// 登录
//  export function reqLogin(username,password){
//     return ajax('/portal/login', {username,password}, 'POST')
//  }

/**
 * portal页面登录请求
 * @param username
 * @param password
 * @param verification
 * @returns {*|Promise|Promise<unknown>}
 */
//登录请求
export const reqLogin = (username, password, verification) => ajax(BASE + '/portal/login', { username, password, verification }, 'POST')


/**
 * 分类请求
 * @param parentId
 * @returns {*|Promise|Promise<unknown>}
 */
//获取 一级/二级列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/all', { parentId })
//添加分类
export const reqAddCategorys = (categoryName, parentId, username) => ajax(BASE + '/manage/category/add', { categoryName, parentId, username }, 'POST')
//更新分类
export const reqUpdateCategorys = (categoryName, id, username) => ajax(BASE + '/manage/category/update', { categoryName, id, username }, 'POST')
//删除分类
export const reqDelCategorys = (id, username) => ajax(BASE + '/manage/category/del', { id, username }, 'POST')
//获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', { categoryId }, 'GET')


/**
 * 商品请求
 * @param pageNum
 * @param pageSize
 * @returns {*|Promise|Promise<unknown>}
 */
//获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/all', ({ pageNum, pageSize }), 'GET')
// 搜索商品分页列表 ,searchType用于判断()
export const reqSearchProducts = ({ pageNum, pageSize, searchName, searchType }) => ajax(BASE + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName,
},
    'GET')
// 更新商品的状态
export const reqUpdateStatus = (id, productStatus, username) => ajax(BASE + '/manage/product/updateStatus', { id, productStatus, username }, 'POST')
//添加商品
export const reqUploadAndUpdateProduct = (product, username) => ajax(BASE + '/manage/product/addOrUpdate', { product, username }, 'POST')
//删除图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/product/delImg', { name }, 'POST')
//根据分类Id获取该分类下的所有商品
export const reqGetProductById = (pageNum, pageSize, id) => ajax(BASE + '/manage/product/getProductById', { pageNum, pageSize, id }, 'GET')

/**
 * 其他请求
 * @returns {*|Promise|Promise<unknown>}
 */
//获取留言板信息
export const reqGetAllMsgBoard = () => ajax(BASE + '/manage/msg/getMsgBoard', {}, 'GET')
//获取所有日志信息
export const reqGetOperations = (pageNum, pageSize) => ajax(BASE + '/ws/log/info', ({ pageNum, pageSize }), 'GET')
//按条件查询日志信息
export const reqGetOperationByAny = ({ pageNum, pageSize, searchName, opType, opMenu }) => ajax(BASE + '/ws/log/searchByAny', ({
    pageNum,
    pageSize,
    opType,
    opMenu,
    searchName
}), 'GET')

/**
 * user 用户请求
 */
//删除用户
export const reqDeleteUser = (ids, username, account) => ajax(BASE + '/manage/user/delUser', ({ ids, username, account }), 'POST')
//查询所有用户信息
export const reqUsers = () => ajax(BASE + '/manage/user/userInfo', ({}), 'GET')
//添加或者修改用户信息
export const reqAddOrUpdateUser = (user, username) => ajax(BASE + '/manage/user/addUser', ({ user, username }), 'POST')
//获取用户主账号
export const reqToGetAcctId = (accountName) => ajax(BASE + '/manage/user/toGetAcctId', ({ accountName }), 'POST')
//用户新增->检查手机号格式
export const reqCheckPhone = (telPhone) => ajax(BASE + '/manage/user/checkPhone', ({ telPhone }), 'POST')
//密码修改->检查旧密码
export const reqCheckOldPwd = (oldPwd, username) => ajax(BASE + '/manage/user/checkPwd', ({ oldPwd, username }), 'POST')
//密码修改->检查新密码
export const reqCheckNewPwd = (newPwd, confirmPwd) => ajax(BASE + '/manage/user/checkPwd', ({ newPwd, confirmPwd }), 'POST')
//密码修改
export const reqUpdatePwd = (oldPwd, newPwd, username) => ajax(BASE + '/manage/user/updPwd', ({ oldPwd, newPwd, username }), 'POST')
//用户锁定
export const reqLockUser = (ids, account, username, lockReason) => ajax(BASE + '/manage/user/lockUser', ({ ids, account, username, lockReason }), 'POST')
//用户解锁
export const reqBreakLock = (ids, acount, username) => ajax(BASE + '/manage/user/breakLock', ({ ids, acount, username }), 'POST')
//密码重置
export const reqResetPwd = (ids, username) => ajax(BASE + '/manage/user/resetPwd', ({ ids, username }), 'POST')
//查询所有组织Name
export const reqGetOrgaInfo = () => ajax(BASE + '/manage/user/getOrgaInfo', ({}), 'GET')
//导出用户数据
export const reqExportUserInfo = () => ajax(BASE + '/manage/export/test', ({}), 'GET')

/**
 * customer 客户请求
 */
//查询所有用户信息
export const reqGetCtmAll = () => ajax(BASE + '/manage/customer/getCtmAll', ({}), 'GET')
//用户注销
export const reqDelCtm = (ids, ctmName, username) => ajax(BASE + '/manage/customer/delCtm', ({ ids, ctmName, username }), 'POST')


/**
 * role 角色请求
 */
//查询所有的角色信息
export const reqRoles = () => ajax(BASE + '/manage/role/getAllRole', ({}), 'GET')
//获取某用户的角色
export const reqGetAcctRoles = (username) => ajax(BASE + '/manage/role/getAcctRoles', ({ username }), 'POST')
//修改某用户的权限
export const reqUpdAcctRoles = (username, targetKeys, operator) => ajax(BASE + '/manage/role/updAcctRoles', ({ username, targetKeys, operator }), 'POST')
//查询该角色下的所有权限
export const reqGetRoleAuths = (roleId) => ajax(BASE + '/manage/role/getRoleAuths', ({ roleId }), 'Get')

/**
 * 
 * auth 权限请求
 */
//查询所有的权限列表
export const reqGetAuth = () => ajax(BASE + '/manage/role/getAllAuth', ({}), 'GET')
//修改权限状态
export const requpdAuthState = (useful, id, username) => ajax(BASE + '/manage/role/updAuthState', ({ useful, id, username }), 'POST')
//修改角色的权限
export const reqUpdRoleAuths = (roleId, targetKeys, operator) => ajax(BASE + '/manage/role/updRoleAuths', ({ roleId, targetKeys, operator }), 'POST')

/**
 * order 订单请求
 */
export const reqGetOrder = (orderFlow) => ajax(BASE + '/manage/order/getOrder', ({ orderFlow }), 'POST')

//获取天气信息
export const reqWeather = () => {
    return new Promise((resolve, reject) => {
        const url = 'https://tianqiapi.com/api?version=v6&appid=25784789&appsecret=Jg3n4SdS'
        // 发送jsonp请求
        jsonp(url, {}, (err, data) => {
            //console.log('jsonp()',err, data)
            //如果成功了
            if (!err) {
                const { wea, city } = data
                resolve({ wea, city })
            } else {
                //失败了
                message.error('获取天气信息失败!')
            }
        })
    })
}
reqWeather()