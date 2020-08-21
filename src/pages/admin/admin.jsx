import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {Layout} from 'antd'
import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'

const { Footer, Sider, Content } = Layout;

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
            <Layout style={{height: '100%'}}>
                <Sider>
                    <LeftNav />
                </Sider>

                <Layout>
                    <Header>Header</Header>
                    <Content style={{backgroundColor: '#fff'}}>Content</Content>
                    <Footer style={{textAlign: 'center',color: '#cccccc'}}>这地球不停自转,一点一线一圈</Footer>
                </Layout>
            </Layout>
        )
    }
}