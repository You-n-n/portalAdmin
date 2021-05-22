import React, { Component } from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message,
    Select
} from 'antd'
import { PAGE_SIZE } from "../../utils/constants"
import { reqGetAuth, requpdAuthState } from '../../api'
import memoryUtils from "../../utils/memoryUtils"
import storageUtils from "../../utils/storageUtils";
const { Option } = Select;

/*
权限页面
 */
export default class Auth extends Component {

    state = {
        auths: [], // 所有角色的列表
        auth: {}, // 选中的role
        isShowAdd: false, // 是否显示添加界面
        isShowAuth: false, // 是否显示设置权限界面
        useful: '', //修改后的状态
    }

    initColumn = () => {
        this.columns = [
            {
                title: '权限ID',
                dataIndex: 'authId'
            },
            {
                title: '权限名称',
                dataIndex: 'authName'
            },
            {
                title: '权限名称',
                dataIndex: 'description'
            },
            {
                title: '权限状态',
                dataIndex: 'useful'
            },
            {
                title: '创建时间',
                dataIndex: 'addTime'
            },
        ]
    }

    UNSAFE_componentWillMount() {
        this.initColumn()
    }

    componentDidMount() {
        this.getAuths()
    }

    onRow = (auth) => {
        return {
            onClick: event => { // 点击行
                console.log('row onClick()', auth)
                // alert('点击行')
                this.setState({
                    auth
                })
            },
        }
    }

    getAuths = async () => {
        const result = await reqGetAuth()
        if (result.status === '0') {
            const auths = result.data
            console.log(auths)
            this.setState({
                auths: auths
            })
        }
    }

    handleChange = (value) => {
        this.setState({
            useful: value
        })
    }

    updateAuth = async () => {
        const { username } = memoryUtils.user;
        const { useful, auth } = this.state;
        const id = auth.id
        const result = await requpdAuthState(useful, id, username)
        if ('0' === result.status) {
            message.success(result.msg)
            this.setState({
                isShowAuth: false
            })
        } else {
            message.warn(result.msg)
            this.setState({
                isShowAuth: false
            })
        }
        this.getAuths()
    }

    render() {

        const { auths, auth, isShowAuth } = this.state

        const title = (
            <span>
                <Button type='primary' disabled={!auth.id} onClick={() => this.setState({ isShowAuth: true })}>权限修改</Button>
            </span>
        )

        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='id'
                    dataSource={auths}
                    columns={this.columns}
                    pagination={{ defaultPageSize: PAGE_SIZE }}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [auth.id],
                        onSelect: (auth) => { // 选择某个radio时回调
                            this.setState({
                                auth
                            })
                        }

                    }}
                    onRow={this.onRow}
                />

                <Modal
                    title="修改权限"
                    visible={isShowAuth}
                    onOk={this.updateAuth}
                    width='250px'
                    onCancel={() => {
                        this.setState({ isShowAuth: false })
                    }}
                    destroyOnClose={true}
                >
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="请选择"
                        optionFilterProp="children"
                        onChange={this.handleChange}
                        onFocus={this.onFocus}
                        defaultValue={auth.useful}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        <Option value="有效">有效</Option>
                        <Option value="无效">无效</Option>
                    </Select>
                </Modal>
            </Card>
        )
    }
}