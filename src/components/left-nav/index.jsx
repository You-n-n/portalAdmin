import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import './index.less'
import menuList from '../../config/menuConfig'
import { Menu, Icon } from 'antd';

const SubMenu = Menu.SubMenu;

/**
 * 左侧导航栏组件
 */
class LeftNav extends Component{

    /**
     * 根据menu 的数据生成对应的标签数组  动态生成
     * map()+递归
     */
    getMenuNodes_map = (menuList) => {
        return menuList.map(item => {
            if(!item.children){
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                return(
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                        }>
                            {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    }
    /**
     * 
     * redce()+递归
     */
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname
        //得到当前请求的路由路径
        return menuList.reduce((pre, item) => {
            //向pre中添加<Menu.Item>  
            if(!item.children){
                pre.push((
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                ))
            //或者 <SubMenu>
            }else{
                
                //查找一个与当前请求路径匹配的子Item
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                //如果存在,说明当前item的子列表需要打开
                if(cItem){
                    this.openKey = item.key
                }
                pre.push((
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                        }>
                            {this.getMenuNodes(item.children)}
                    </SubMenu>
                ))
            }
            
            return pre 
        }, [])
    }

    //在第一次render()之前执行一次
    //为第一次render()渲染准备数据
    componentWillMount () {
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {
        //debugger
        //得到当前请求的路由路径
        let path = this.props.location.pathname
        //console.log('render()',path)
        //需要打开菜单项的key
        if(path.indexOf('/product')===0){ //选中的为商品或者商品的子路由
            path = '/product'
        }
        const openKey = this.openKey

        return(
            <div className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={logo} alt="logo" />
                    <h1>管理后台</h1>
                </Link>

                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                >
                     {
                        this.menuNodes
                     }
                </Menu>
            </div>
        )
    } 
}

/**
 * 高阶组件
 */
export default withRouter(LeftNav)