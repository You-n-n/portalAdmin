import React, {Component} from 'react'
import {Descriptions, Badge} from 'antd'

export default class Mine extends Component {

    getMain = () => {
        const {user} = this.props
        console.log(user)
    }

    render(){
        return(
            <div>
                <Descriptions title="Admin" layout="vertical" bordered size="small">
                    <Descriptions.Item label="姓名">admin</Descriptions.Item>
                    <Descriptions.Item label="性别">男</Descriptions.Item>
                    <Descriptions.Item label="用户名">Admin</Descriptions.Item>
                    <Descriptions.Item label="生日">2018-04-24 18:00:00</Descriptions.Item>
                    <Descriptions.Item label="账号注册时间" span={2}>
                    2019-04-24 18:00:00
                    </Descriptions.Item>
                    <Descriptions.Item label="账号状态" span={3}>
                    <Badge status="processing" text="正常" />
                    </Descriptions.Item>
                    <Descriptions.Item label="Negotiated Amount">$80.00</Descriptions.Item>
                    <Descriptions.Item label="Discount">$20.00</Descriptions.Item>
                    <Descriptions.Item label="Official Receipts">$60.00</Descriptions.Item>
                    <Descriptions.Item label="系统鼓励宣言">
                    多读书
                    <br />
                    多看报
                    <br />
                    少吃零食
                    <br />
                    多睡觉 :)
                    <br />
                    </Descriptions.Item>
                </Descriptions>
            </div>
        )
    }
}