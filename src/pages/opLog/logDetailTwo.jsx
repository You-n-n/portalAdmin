import { Table } from 'antd'
import React, { Component } from 'react'
import propTypes from 'prop-types'

export default class LogDetailTwo extends Component {
    static propTypes = {
        operLogDetail: propTypes.any.isRequired,
        showName: propTypes.any.isRequired
    }
    state = {
        list: []
    }

    componentDidMount() {
        try {
            const { operLogDetail } = this.props
            const showName = this.props.showName;
            const afterCntt = JSON.parse(operLogDetail.afterCntt);
            const beforeCntt = JSON.parse(operLogDetail.beforeCntt);
            let lsitData = []
            Object.keys(afterCntt).forEach(key => {
                let jsonObj = { "key": "", "value1": "", "value2": "" };
                jsonObj.key = showName.get(key) ? showName.get(key) : key;
                if (beforeCntt[key] === afterCntt[key]) {
                    jsonObj.value2 = afterCntt[key];
                } else {
                    jsonObj.value2 = "&标蓝&" + afterCntt[key];
                }
                jsonObj.value1 = beforeCntt[key];
                lsitData.push(jsonObj);
            });
            this.setState({
                list: lsitData
            })
        } catch (e) {
            alert("json格式解析失败")
        }
        this.initColumns()
    }

    initColumns = () => {
        this.columns = [
            {
                title: '要素名称',
                dataIndex: 'key',
                width: 150,
            },
            {
                title: '修改前',
                dataIndex: 'value1',
                width: 150,
                ellipsis: true,
            },
            {
                title: '修改后',
                dataIndex: 'value2',
                width: 150,
                ellipsis: true,
                render: function (value, item) {
                    if (value.toString().indexOf("&标蓝&") >= 0) {
                        value = value.toString().replace("&标蓝&", "");
                        return <div style={{ color: '#1e88c4', width: '220px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} title={value}>{value}</div>
                    }
                    return <div style={{ width: '220px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} title={value}>{value}</div>
                }
            },
        ]
    }
    render() {

        return (
            <div>
                <Table
                    dataSource={this.state.list}
                    columns={this.columns}
                    bordered
                    pagination={false}
                />
            </div>
        )
    }
}