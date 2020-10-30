import React, {Component} from 'react'
import './home.less'
import { Comment, Tooltip, List, Collapse, Calendar, Timeline,  } from 'antd';
import moment from 'moment';
/**
 * 首页路由
 */

const { Panel } = Collapse;

const data = [
      {
        author: '小天',
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        content: (
          <p>
            希望产品列表能够根据字母排列
          </p>
        ),
        datetime: (
          <Tooltip
            title={moment()
              .subtract(2, 'days')
              .format('YYYY-MM-DD HH:mm:ss')}
          >
            <span>
              {moment()
                .subtract(2, 'days')
                .fromNow()}
            </span>
          </Tooltip>
        ),
      },
  ];

export default class Home extends Component{

    render() {
        return (
            <div>
                <div>
                    <Collapse accordion className="c1" defaultActiveKey={['1']}>
                        <Panel className="p1" header="客户需求留言" key="1" >
                            <List
                                className="comment-list"
                                header={`${data.length} 条留言`}
                                itemLayout="horizontal"
                                dataSource={data}
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
                    <Timeline.Item>创建服务现场 2015-09-01</Timeline.Item>
                    <Timeline.Item>初步排除网络异常 2015-09-01</Timeline.Item>
                    <Timeline.Item>技术测试异常 2015-09-01</Timeline.Item>
                    <Timeline.Item>网络异常正在修复 2015-09-01</Timeline.Item>
                </Timeline>
                </div>

                <div className="calendar" style={{ width: 300, border: '1px solid #d9d9d9', borderRadius: 4 }}>
                    <Calendar fullscreen={false} />
                </div>
            </div>
        )
    }
}