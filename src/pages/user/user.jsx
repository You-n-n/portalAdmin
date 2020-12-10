import React, {Component} from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd'
import {formateDate} from "../../utils/dateUtils"
import LinkButton from "../../components/link-button/index"
import {reqDeleteUser, reqUsers, reqAddOrUpdateUser} from "../../api/index";
import UserForm from './user-form'
import memoryUtils from '../../utils/memoryUtils'

/*
用户路由
 */
export default class User extends Component {

  state = {
    users: [], // 所有用户列表
    roles: [], // 所有角色列表
    isShow: false, // 是否显示确认框
  }

  initColumns = () => {
    this.columns = [
      {
        title: '姓名',
        dataIndex: 'accountName',
        key: 'accountName'
      },
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'mail',
        key: 'mail'
      },

      {
        title: '电话',
        dataIndex: 'telphone',
        key: 'telphone'
      },
      {
        title: '注册时间',
        dataIndex: 'addTime',
        key: 'addTime',
        render: formateDate
      },
      // {
      //   title: '所属角色',
      //   dataIndex: 'role_id',
      //   render: (role_id) => this.roleNames[role_id]
      // },
      {
        title: '操作',
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>
        )
      },
    ]
  }

  /*
  根据role的数组, 生成包含所有角色名的对象(属性名用角色id值)
   */
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
    // 保存
    this.roleNames = roleNames
  }

  /*
  显示添加界面
   */
  showAdd = () => {
    this.user = null // 去除前面保存的user
    this.setState({isShow: true})
  }

  /*
  显示修改界面
   */
  showUpdate = (user) => {
    this.user = user // 保存user
    this.setState({
      isShow: true
    })
  }

  /*
  删除指定用户
   */
  deleteUser = (user) => {
    Modal.confirm({
      title: `确认删除${user.username}吗?`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if(result.status===0) {
          message.success('删除用户成功!')
          this.getUsers()
        }
      }
    })
  }

  /*
  添加/更新用户
   */
  addOrUpdateUser = async () => {

    const {username} = memoryUtils.user;

    // 1. 收集输入数据
    const user = this.form.getFieldsValue()
    const er = this.form.getFieldsError()
    this.form.resetFields()
    // 如果是更新, 需要给user指定_id属性
    if (this.user) {
      user._id = this.user._id
    }

    // 2. 提交添加的请求
    const result = await reqAddOrUpdateUser(user,username)
    // 3. 更新列表显示
    if(result.status=== '0') {
      this.setState({isShow: false})
      message.success(`${this.user ? '修改' : '添加'}用户成功`)
      this.getUsers()
    }else{
      message.error(result.msg)
    }
  }

  getUsers = async () => {
    const result = await reqUsers()
    if (result.status==='0') {
      const {users, roles} = result.data
      //this.initRoleNames(roles)
      this.setState({
        users,
        roles
      })
    }
  }

  UNSAFE_componentWillMount () {
    this.initColumns()
  }

  componentDidMount () {
    this.getUsers()
  }


  render() {

    const {users, roles, isShow} = this.state
    const user = this.user || {}

    const title = <Button type='primary' onClick={this.showAdd}>创建用户</Button>

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      onSelect: (record, selected, selectedRows) => {
        //console.log(record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        //console.log(selected, selectedRows, changeRows);
      },
    };

    return (
      <Card title={title}>
        <Table
          rowSelection={rowSelection}
          bordered
          rowKey='id'
          dataSource={users}
          columns={this.columns}
          pagination={{defaultPageSize: 8}}
        />

        <Modal
          title={user.id ? '修改用户' : '添加用户'}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          destroyOnClose={true}
          onCancel={() => {
            this.form.resetFields()
            this.setState({isShow: false})
          }}
        >
          <UserForm
            setForm={form => this.form = form}
            roles={roles}
            user={user}
          />
        </Modal>

      </Card>
    )
  }
}