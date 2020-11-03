import React, {Component} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {Layout} from 'antd'
import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import User from '../user/user'
import Role from '../role/role'
import Log from '../opLog/log'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'

const { Footer, Sider, Content } = Layout;

/**
 * 后台管理的路由组件
 * 天气接口:https://tianqiapi.com/api?version=v6&appid=25784789&appsecret=Jg3n4SdS
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
                    <Header>头部</Header>
                    <Content style={{margin: 20,backgroundColor: '#fff'}}>
                        <Switch>
                            <Route path='/home' component={Home} />
                            <Route path='/category' component={Category} />
                            <Route path='/product' component={Product} />
                            <Route path='/role' component={Role} />
                            <Route path='/user' component={User} />
                            <Route path='/log' component={Log} />
                            <Route path='/charts/bar' component={Bar} />
                            <Route path='/charts/line' component={Line} />
                            <Route path='/charts/pie' component={Pie} />
                            <Redirect to='/home' />
                        </Switch>
                    </Content>

                    <Footer style={{textAlign: 'center',color: '#cccccc'}}>这地球不停自转🌎,一点一线一圈🙋</Footer>
                </Layout>
            </Layout>
        )
    }
}