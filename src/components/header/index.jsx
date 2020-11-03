import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'

import {reqWeather} from '../../api'
import menuList from '../../config/menuConfig'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import './index.less'
import LinkButton from "../link-button";

/**
 * 左侧导航的组件
 */
class Header extends Component {

    state = {
        currentTime: formateDate(Date.now(),'yyyy-MM-dd hh:mm:ss'), //当前时间字符串
        wea: '', 
        city: '',
    };

    getTime = () => {
        //每隔1s获取当前时间，并更新状态数据
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now());
            this.setState({currentTime});
        }, 1000);
    };

    getWeather = async () => {
        //调用接口请求异步获取数据
        const {city, wea} = await reqWeather();
        //更新状态
        this.setState({city, wea});

    };

    getTitle = () => {
        //得到当前请求路径
        const path = this.props.location.pathname;
        let title;
        menuList.forEach(item => {
            if (item.key === path) {
                //如果当前item对象的key与path一样item的title就是当前的路径
                title = item.title;
            } else if (item.children) {
                //在所有子item中查找匹配的
                const child = item.children.find(child => path.indexOf(child.key) === 0);
                //如果有值才说明有匹配的
                if (child) {
                    //取出title
                    title = item.title + ' > ' + child.title
                }
            }
        });
        return title;
    };

    /**
     * 退出登录
     */
    logout = () => {
        Modal.confirm({
                content: '确定退出吗?',
                onOk : () => {
                    //console.log('OK',this);
                    //删除保存的user数据，
                    storageUtils.removeUser();
                    memoryUtils.user = {};
                    //跳转到login
                    this.props.history.replace('/login');
                }
            })
    };

    /**
     * 第一次render() 之后执行
     * 一般在此执行异步操作：发送ajax请求，启动定时器
     */
    componentDidMount() {
        //获取当前的时间
        this.getTime();
        //获取当前天气显示
        this.getWeather();
    }

    /**
     * 当前组件卸载之前调用
     */
    componentWillUnmount() {
        //清除定时器
        clearInterval(this.intervalId);
    }

    render() {

        const {currentTime, city, wea} = this.state;
        const {account_name} = memoryUtils.user;
        //得到当前需要显示的title
        const title = this.getTitle();
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎您, {account_name}  </span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <span>{city}</span>
                        <span>{wea}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header);
