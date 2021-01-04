import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Modal, Tabs, Button} from 'antd'
import {reqWeather} from '../../api'
import menuList from '../../config/menuConfig'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import './index.less'
import LinkButton from "../link-button";
import {Link} from 'react-router-dom';

const { TabPane } = Tabs;
class Header extends Component {

    state = {
        currentTime: formateDate(Date.now(),'yyyy-MM-dd hh:mm:ss'), //当前时间字符串
        wea: '', 
        city: '',
        mypanes: [],
        activeKey: '',
        panes:[],
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

    add = () => {
        const title = this.getTitle()
        
        const activeKey = this.props.location.pathname;
        console.log(activeKey)
        const { panes } = this.state;
        panes.push({ title: title, content: '', key: activeKey });
        this.setState({ panes, activeKey });
      };

    constructor(props) {
        super(props);
        this.newTabIndex = 0;
        const title = this.getTitle();
        const panes = [
          { title: title, content: '', key: title },
        ];
        this.state = {
          activeKey: panes[0].key,
          panes,
        };
      }

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
    
      onChange = activeKey => {
        this.setState({ activeKey });
      };
    
      onEdit = (targetKey, action) => {
        this[action](targetKey);
      };
    
      remove = targetKey => {
        let { activeKey } = this.state;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
          if (pane.key === targetKey) {
            lastIndex = i - 1;
          }
        });
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (panes.length && activeKey === targetKey) {
          if (lastIndex >= 0) {
            activeKey = panes[lastIndex].key;
          } else {
            activeKey = panes[0].key;
          }
        }
        this.setState({ panes, activeKey });
      };

    render() {

        const {currentTime, city, wea} = this.state;
        const {username} = memoryUtils.user;
        //得到当前需要显示的title
        const title = this.getTitle();
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎您, {username}  </span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                {/* <div>
                        <div style={{ marginBottom: 16 }}>
                        <Button onClick={this.add}>ADD</Button>
                        </div>
                    <Tabs
                    hideAdd
                    onChange={this.onChange}
                    activeKey={this.state.activeKey}
                    type="editable-card"
                    onEdit={this.onEdit}
                    >
                    {this.state.panes.map(pane => (
                        // this.props.history.replace('/login')
                        <TabPane tab={<Link to={pane.key}>{pane.title}</Link>} key={pane.key}>
                        </TabPane>
                    ))}
                    </Tabs>
                </div> */}
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