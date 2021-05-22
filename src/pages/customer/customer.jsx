import React, { Component } from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message,
} from 'antd'
import { formateDate } from "../../utils/dateUtils"
import LinkButton from "../../components/link-button/index"
import { reqGetCtmAll, reqDelCtm } from "../../api/index";
import memoryUtils from '../../utils/memoryUtils'

export default class Customer extends Component {

    state = {
        customerList: [],
        selectedRows: []
    }

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username',
                width: 150,
                fixed: 'left',
            },
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                width: 120,
            },
            {
                title: '用户密码',
                dataIndex: 'password',
                key: 'password',
                width: 200,
            },
            {
                title: '性别',
                dataIndex: 'sex',
                key: 'sex',
                width: 100,
            },
            {
                title: '年龄',
                dataIndex: 'age',
                key: 'age',
                width: 100,
            },
            {
                title: '身份证号',
                dataIndex: 'prsnIdNum',
                key: 'prsnIdNum',
                width: 200,
            },
            {
                title: '默认地址',
                dataIndex: 'address',
                key: 'address',
                //width: 200,
            },
            {
                title: '电话',
                dataIndex: 'telphone',
                key: 'telphone',
                width: 200,
            },
            {
                title: '注册时间',
                dataIndex: 'addTime',
                key: 'addTime',
                width: 200,
                render: formateDate
            },
            // {
            //   title: '所属角色',
            //   dataIndex: 'roleid',
            //   render: (roleid) => this.roleNames[roleid]
            // },
            // {
            //     title: '操作',
            //     width: 150,
            //     render: (user) => (
            //         <span>
            //             <LinkButton onClick={() => this.showUpdate(user)}>详情</LinkButton>
            //         </span>
            //     ),
            //     fixed: 'right',
            // },
        ]
    }

    getCtmList = async () => {
        const result = await reqGetCtmAll()
        if ('0' === result.status) {
            console.log(result.data)
            this.setState({
                customerList: result.data
            })
        }
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getCtmList()
    }

    onResetPwd = () => {
        const nums = this.state.selectedRows
        if (nums < 1) {
            message.warn('请选择需要操作的列')
        } else {
            message.success('重置密码成功')
        }
    }

    delBatch = async () => {
        const nums = this.state.selectedRows
        let ids = []
        let ctmName = []
        const { username } = memoryUtils.user;
        if (nums < 1) {
            message.warn('请选择需要操作的列')
        } else {
            for (let i = 0; i < nums.length; i++) {
                ids.push(nums[i].id)
                ctmName.push(nums[i].username)
            }
            const result = await reqDelCtm(ids, ctmName, username)
            if ('0' === result.status) {
                message.success(result.msg)
                this.getCtmList()
            } else {
                message.error(result.msg)
                this.getCtmList()
            }
        }
    }

    render() {
        const { customerList } = this.state

        const title = (<span>
            搜索栏
        </span>)

        const extra = (
            <span>
                <Button type='primary' onClick={this.onExportUserInfo}> 导出 </Button>
                <Button type='primary' style={{ width: 90, margin: '0 15px' }} onClick={this.onResetPwd}>密码重置</Button>
                <Button type='danger' onClick={this.delBatch}>注销用户</Button>
            </span>
        )

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect: (record, selected, selectedRows) => {
                this.setState({
                    selectedRows: selectedRows
                })
                //console.log(selectedRows);
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                this.setState({
                    selectedRows: selectedRows
                })
                //console.log(selected, selectedRows, changeRows);
            },
        };

        return (
            <Card title={title} extra={extra}>
                <Table
                    scroll={{ x: 2000 }}
                    rowSelection={rowSelection}
                    bordered={true}
                    rowKey='id'
                    dataSource={customerList}
                    columns={this.columns}
                    pagination={{ defaultPageSize: 8 }}
                />
            </Card>
        )
    }
}