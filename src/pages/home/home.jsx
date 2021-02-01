import React, {Component} from 'react'
import './home.less'
import { Comment, Tooltip, List, Collapse, Calendar, Timeline,  message  } from 'antd';
import moment from 'moment';
import {reqGetAllMsgBoard} from '../../api/'
import memoryUtils from '../../utils/memoryUtils'
/**
 * 首页路由
 */

const { Panel } = Collapse;

{/*
  开启socket
  但不太会用
// var ws = new WebSocket("ws://localhost:8888/go/imserver/10");
// ws.onopen = function(evt) { 
// console.log("用户xxx已经连接 ..."); 
// ws.send('{"toUserId" : "20" , "message" : "Hello WebSockets!"}');
// };

// ws.onmessage = function(evt) {
// console.log ("println message");
// ws.close();
// };

// ws.onclose = function(evt) {
// console.log("Connection closed.");
// }; 
*/}

// const data = [
//       {
//         author: '小天',
//         avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
//         content: (
//           <p>
//             希望产品列表能够根据字母排列
//           </p>
//         ),
//         datetime: (
//           <Tooltip
//             title={moment()
//               .subtract(2, 'days')
//               .format('YYYY-MM-DD HH:mm:ss')}
//           >
//             <span>
//               {moment()
//                 .subtract(2, 'days')
//                 .fromNow()}
//             </span>
//           </Tooltip>
//         ),
//       },
//   ];

export default class Home extends Component{

  state = {
    total: 0, // 日志的总数量
    msgBoards: [], //日志的数组
    loading: false, //加载...
  }

  getMsgBoards = async () => {
    this.setState({loading: true})
    const result = await reqGetAllMsgBoard()
    this.setState({loading: false})
    if(result.status==='0'){
      //得到的可能是一级也可能是二级
      const msgBoards = result.data
      this.setState({
        msgBoards : msgBoards
      })
  }else {
      message.error('获取留言失败')
  }
  }

  componentDidMount () {
    this.getMsgBoards()
  }

    render() {
      const {msgBoards} = this.state
        return (
            <div>
                <div>
                    <Collapse accordion className="c1" defaultActiveKey={['1']}>
                        <Panel className="p1" header="今日待办" key="1" >
                            <List
                                className="comment-list"
                                header={`${msgBoards.length} 条留言`}
                                itemLayout="horizontal"
                                dataSource={msgBoards}
                                renderItem={item => (
                                <li>
                                    <Comment
                                    author={item.author}
                                    avatar={item.avatar}
                                    content={item.content}
                                    datetime={item.datetime}
                                    />
                                </li>
                                )}
                            />
                        </Panel>
                    </Collapse>
                </div>

                <div className="timeline">
                <Timeline>
                    <Timeline.Item>创建服务现场 2020-09-01</Timeline.Item>
                    <Timeline.Item>初步排除网络异常 2020-09-01</Timeline.Item>
                    <Timeline.Item>技术测试异常 2020-09-01</Timeline.Item>
                    <Timeline.Item>网络异常正在修复 2020-09-01</Timeline.Item>
                </Timeline>
                </div>

                <div className="calendar" style={{ width: 300, border: '1px solid #d9d9d9', borderRadius: 4 }}>
                    <Calendar fullscreen={false} />
                </div>
            </div>
        )
    }
}