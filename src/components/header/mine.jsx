import React, {Component} from 'react'
import {Descriptions, Badge, Tag, Modal } from 'antd'

export default class Mine extends Component {

    state = {
        msgBoard : false,
        systemBug : false,
    }

    onClicks1 = () => {
            this.setState({
                msgBoard : true
            })
    }

    onClicks2 = () => {
        this.setState({
            systemBug : true
        })
}

    onCancle = () => {
        this.setState({
            msgBoard : false,
            systemBug : false
        })
    }

    render(){
        const {user} = this.props
        return(
            <div>
                <Descriptions title={user.accountName} layout="vertical" bordered size="small">
                    <Descriptions.Item label="姓名">{user.accountName}</Descriptions.Item>
                    <Descriptions.Item label="性别">{user.sex}</Descriptions.Item>
                    <Descriptions.Item label="用户名">{user.username}</Descriptions.Item>
                    <Descriptions.Item label="生日">{user.birthDay}</Descriptions.Item>
                    <Descriptions.Item label="账号注册时间" span={2}>
                    {user.addTime}
                    </Descriptions.Item>
                    <Descriptions.Item label="当前状态" span={3}>
                    <Badge status="success" text="在线" />
                    </Descriptions.Item>
                    <Descriptions.Item label="个人电话">{user.telphone}</Descriptions.Item>
                    <Descriptions.Item label="账号状态">{user.acctStatus}</Descriptions.Item>
                    <Descriptions.Item label="所属组织">{user.orgaName}</Descriptions.Item>
                    <Descriptions.Item label="系统鼓励宣言">
                    多读书
                    <br />
                    多看报
                    <br />
                    少吃零食
                    <br />
                    多睡觉 :)
                    <br />
                    <Tag color="volcano">永远年轻</Tag>
                    
                    <Tag color="orange">热爱生活</Tag>
                    <br />
                    </Descriptions.Item>
                    <Descriptions.Item label="系统操作">
                    <a onClick = {this.onClicks1}>个人留言</a> <p />
                    <a onClick = {this.onClicks2}>报告系统BUG</a> <p />
                    </Descriptions.Item>
                </Descriptions>

                <Modal 
                    visible = {this.state.msgBoard}
                    title = '个人留言'
                    onOk = {this.onCancle}
                    onCancel = {this.onCancle}
                />

                <Modal 
                    visible = {this.state.systemBug}
                    title = '报告系统BUG'
                    onOk = {this.onCancle}
                    onCancel = {this.onCancle}
                />
            </div>
        )
    }
}