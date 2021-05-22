import React, { Component } from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd'
import { PAGE_SIZE } from "../../utils/constants"
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import memoryUtils from "../../utils/memoryUtils"
import storageUtils from "../../utils/storageUtils";
import RoleForm from "./roleForm"

/*
角色路由
 */
export default class Role extends Component {

  state = {
    roles: [], // 所有角色的列表
    role: {}, // 选中的role
    isShowAdd: false, // 是否显示添加界面
    isShowAuth: false, // 是否显示设置权限界面
  }

  constructor(props) {
    super(props)

    this.auth = React.createRef()
  }

  initColumn = () => {
    this.columns = [
      {
        title: '角色ID',
        dataIndex: 'roleId'
      },
      {
        title: '创建名称',
        dataIndex: 'roleName'
      },
      {
        title: '上级角色ID',
        dataIndex: 'superRoleId'
      },
      {
        title: '角色描述',
        dataIndex: 'description'
      },
    ]
  }

  getRoles = async () => {
    const result = await reqRoles()
    if (result.status === '0') {
      const roles = result.data
      this.setState({
        roles: roles
      })
    }
  }


  onRow = (role) => {
    return {
      onClick: event => { // 点击行
        console.log('row onClick()', role)
        // alert('点击行')
        this.setState({
          role
        })
      },
    }
  }


  UNSAFE_componentWillMount() {
    this.initColumn()
  }

  componentDidMount() {
    this.getRoles()
  }

  render() {

    const { roles, role, isShowAdd, isShowAuth } = this.state

    const title = (
      <span>
        <Button type='primary' disabled={!role.id} onClick={() => this.setState({ isShowAuth: true })}>设置角色权限</Button>
      </span>
    )

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='id'
          dataSource={roles}
          columns={this.columns}
          pagination={{ defaultPageSize: PAGE_SIZE }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [role.id],
            onSelect: (role) => { // 选择某个radio时回调
              this.setState({
                role
              })
            }

          }}
          onRow={this.onRow}
        />

        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={() => {
            this.setState({ isShowAuth: false })
          }}
          width='700px'
          onCancel={() => {
            this.setState({ isShowAuth: false })
          }}
          destroyOnClose={true}
        >
          <RoleForm
            roleId={role.roleId}
          />
        </Modal>
      </Card>
    )
  }
}