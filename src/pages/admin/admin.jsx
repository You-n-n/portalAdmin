import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'

/**
 * 后台管理的路由组件
 */
export default class Admin extends Component {
    render() {
        const user = memoryUtils.user
        //如果内存中没有存储user -->  当前没有登录
        if(!user || !user.id){
            // 自动跳转到登录(在render()中)
            return <Redirect to='/login' />
        }
        return (
            <div>
                <h1>Hello: {user.username}!</h1>
            </div>
        )
    }
}