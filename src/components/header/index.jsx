import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Modal, Tabs, Icon, Popover, Drawer, message} from 'antd'
import {reqWeather, reqUpdatePwd} from '../../api'
import menuList from '../../config/menuConfig'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import './index.less'
import Password from './password'
import Mine from './mine'

const { TabPane } = Tabs;
class Header extends Component {

    state = {
        currentTime: formateDate(Date.now(),'yyyy-MM-dd hh:mm:ss'), //当前时间字符串
        wea: '', 
        city: '',
        clicked: false,
        hovered: false,
        visible: false,
        password: false
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
                cancelText: '再留一会',
                okText: '狠心离开',
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

    updatePwd = async () => {
        // 1. 收集输入数据
        const user = this.form.getFieldsValue()
        const error = this.form.getFieldsError()
        const{oldPwd, newPwd} = user
        const{username} = memoryUtils.user
        if(error.oldPwd || error.newPwd || error.confirmPwd){
            message.error('填写数据错误')
        }else{
            const result = await reqUpdatePwd(oldPwd,newPwd,username)
            if('0' === result.status){
                message.success(result.msg)
                this.setState({
                    password: false
                })
            }else{
                message.error(result.msg)
            }
        }
    }
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

    //隐藏弹窗并退出登录
      hide = () => {
        this.setState({
          hovered: false,
        });
        this.logout();
      };
    
      //显示弹窗
      handleHoverChange = visible => {
        this.setState({
          hovered: visible,
        });
      };

      //用于改变图标方向
      arrowDirection = () => {
          let arrow 
          const hover = this.state.hovered
          if(false === hover){
              arrow = "down"
          }else{
              arrow = "up"
          }
          return arrow
      }

      //展示右侧弹出列表
      showDrawer = () => {
        this.setState({
            visible: true,
            hovered: false
        });
      };
    
      //关闭右侧弹出列表
      onClose = () => {
        this.setState({
            visible: false,
            password: false,
        });
      };

      //展示右侧弹出列表
      opMine = () => {
        this.setState({
            password: true,
            hovered: false
        });
      };

    render() {
        const {currentTime, city, wea} = this.state;
        const {username} = memoryUtils.user;
        const user = memoryUtils.user;
        const arrow = this.arrowDirection();
        //得到当前需要显示的title
        const title = this.getTitle();
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎您, {username}  </span>
                    {/* <LinkButton onClick={this.logout}><Icon type="down" /></LinkButton> */}
                    <Popover
                    content={
                        <div>
                        <a onClick={this.showDrawer}>个人信息</a>  <p />
                        <a onClick={this.opMine} >修改密码</a>  <p />
                        <a onClick={this.hide}>退出登录</a>
                        </div>
                    }
                    trigger="hover"
                    visible={this.state.hovered}    
                    onVisibleChange={this.handleHoverChange}
                    >
                        <a><Icon type={arrow} /></a>
                    </Popover>
                </div>

                    <Drawer
                    title="个人信息"
                    placement="right"
                    closable={false}
                    width={600}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    >
                        <Mine
                            user={user}
                        />
                    </Drawer>

                    <Modal
                    title="修改密码"
                    visible={this.state.password}
                    onOk={this.updatePwd}
                    onCancel={this.onClose}
                    destroyOnClose={true}
                    >
                        <Password 
                            setForm={form => this.form = form}
                            user={user}
                        />
                    </Modal>

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

/**
 * //修改tab选中的颜色
setActiveColor = ()=>{
    let otherTab = document.getElementsByClassName('ant-tabs-tab');//包含了当前的active
    for (let j in otherTab){
        if (otherTab.hasOwnProperty(j)){
            let i = otherTab[j]
            if (i.className.includes('ant-tabs-tab-active')){//当前点击的
                i.style.backgroundColor = '#E03D3E';
                i.style.color = '#fff'
            }
             else {//其他默认的样式
                i.style.backgroundColor = '#fafafa';
                i.style.color = 'rgba(0, 0, 0, 0.65)'
            }
        }
    }
}
 */