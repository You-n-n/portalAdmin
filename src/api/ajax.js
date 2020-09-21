/**
 * 能发送异步ajax请求的函数模块
 * 封装axios库
 * 函数的返回值是promise对象
 * 1. 优化 统一处理请求异常
 */

import axios from 'axios'
import {message} from 'antd'

export default function ajax(url, data={}, type='GET'){

    return new Promise((resolve, reject) => {
        let promise 
        // 1. 执行异步ajax请求
        if(type==='GET'){ //发送GET请求
            promise= axios.get(url,
                {params: data
                })
        } else { //发送post请求
            promise = axios.post(url,data)
        }
        // 2. 如果成功, 调用resolve(value)
        promise.then(response => {
            resolve(response.data)
        // 3. 失败了,不调用reject(reason)
        }).catch(error => {
            message.error('请求出错' + error.message)
        })
        
    })

    
}

 // 请求登录接口
 //ajax('/portal/login',{username:'tom',password:'123'},'POST').then()