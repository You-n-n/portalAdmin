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
import { reqDeleteUser, reqUsers, reqAddOrUpdateUser, reqLockUser, reqBreakLock, reqResetPwd, reqExportUserInfo } from "../../api/index";
import UserForm from './user-form'
import AuthType from './authtype'
import LockReason from './lockreason'
import memoryUtils from '../../utils/memoryUtils'

/*
用户路由
 */
export default class User extends Component {

  state = {
    users: [], // 所有用户列表
    roles: [], // 所有角色列表
    isShow: false, // 是否显示确认框
    selectedRows: [], // 要操作的数组
    acctStatus: '',
    authType: false, //权限配置
    authTypeusername: '', //用于权限配置的用户名
    lockReason: false, // 锁定原因弹窗
    lockReasonLoading: false, //锁定弹窗确认按钮的loading
  }

  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        width: 180,
        fixed: 'left',
      },
      {
        title: '姓名',
        dataIndex: 'accountName',
        key: 'accountName',
        width: 120,
      },
      {
        title: '账号状态',
        dataIndex: 'acctStatus',
        key: 'acctStatus',
        width: 200,
        render: (text) => {
          if (text === '正常') {
            return <div style={{ color: "#1Dc56F" }}>{text}</div>;
          } else if (text === '锁定') {
            return <div style={{ color: "#F8525F" }}>{text}</div>;
          }
          return <div>{text}</div>
        }
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
        width: 100,
      },
      {
        title: '锁定原因',
        dataIndex: 'lockReason',
        key: 'lockReason',
        width: 200,
      },
      {
        title: '人员状态',
        dataIndex: 'humanStatus',
        key: 'humanStatus',
        width: 200,
      },
      {
        title: '组织机构',
        dataIndex: 'orgaName',
        key: 'orgaName',
        width: 200,
      },
      {
        title: '邮箱',
        dataIndex: 'mail',
        key: 'mail',
        width: 200,
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
        //width: 150,
        render: formateDate
      },
      // {
      //   title: '所属角色',
      //   dataIndex: 'roleid',
      //   render: (roleid) => this.roleNames[roleid]
      // },
      {
        title: '操作',
        width: 150,
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>
        ),
        fixed: 'right',
      },
    ]
  }

  /*
  根据role的数组, 生成包含所有角色名的对象(属性名用角色id值)
   */
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role.id] = role.name
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
    this.setState({ isShow: true })
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
        const { username } = memoryUtils.user;
        let ids = []
        let account = []
        ids.push(user.id)
        account.push(user.username)
        const result = await reqDeleteUser(ids, username, account)
        if (result.status === '0') {
          message.success(result.msg)
          this.getUsers()
        } else {
          message.error(result.msg)
          this.getUsers()
        }
      }
    })
  }

  /**
   * 锁定指定用户
   */
  lockUser = () => {
    const locks = this.state.selectedRows
    if (locks.length === 0) {
      message.warn('请选择要操作的列')
    } else {
      this.setState({
        lockReason: true
      })
    }
  }

  sendLockReason = async () => {
    const locks = this.state.selectedRows
    let ids = []
    let account = []
    const { username } = memoryUtils.user;
    for (let i = 0; i < locks.length; i++) {
      ids.push(locks[i].id)
      account.push(locks[i].username)
    }
    const lockReason = this.form.getFieldsValue()
    this.setState({
      lockReasonLoading: true
    })
    const result = await reqLockUser(ids, account, username, lockReason.lockreason)
    if (result.status === '0') {
      this.setState({
        lockReason: false,
        lockReasonLoading: false
      })
      message.success(result.msg)
      this.getUsers()
    } else {
      this.setState({
        lockReason: true,
        lockReasonLoading: false
      })
      message.warn(result.msg)
    }
  }

  /**
   * 解锁
   */
  breakLock = () => {
    const locks = this.state.selectedRows
    let ids = []
    let account = []
    const { username } = memoryUtils.user;
    if (locks.length === 0) {
      message.warn('请选择要操作的列')
    } else {
      for (let i = 0; i < locks.length; i++) {
        ids.push(locks[i].id)
        account.push(locks[i].username)
      }
      Modal.confirm({
        title: `确认解锁所选列吗?`,
        onOk: async () => {
          const result = await reqBreakLock(ids, account, username)
          if (result.status === '0') {
            message.success(result.msg)
            this.getUsers()
          } else {
            message.warn(result.msg)
          }
        }
      })
    }
  }

  /**
   * 批量删除
   */
  delBatch = () => {
    const dels = this.state.selectedRows
    let ids = []
    let account = []
    const { username } = memoryUtils.user;
    if (dels.length === 0) {
      message.warn('请选择要操作的列')
    } else {
      for (let i = 0; i < dels.length; i++) {
        ids.push(dels[i].id)
        account.push(dels[i].username)
      }
      Modal.confirm({
        title: `确认删除所选列吗?`,
        onOk: async () => {
          const result = await reqDeleteUser(ids, username, account)
          if (result.status === '0') {
            message.success(result.msg)
            this.getUsers()
          } else {
            message.error(result.msg)
            this.getUsers()
          }
        }
      })
    }
  }

  /*
  添加/更新用户
   */
  addOrUpdateUser = async () => {

    const { username } = memoryUtils.user;

    // 1. 收集输入数据
    const user = this.form.getFieldsValue()
    const er = this.form.getFieldsError()
    this.form.resetFields()
    // 如果是更新, 需要给user指定id属性
    if (this.user) {
      user.id = this.user.id
    }

    // 2. 提交添加的请求
    const result = await reqAddOrUpdateUser(user, username)
    // 3. 更新列表显示
    if (result.status === '0') {
      message.success(`${this.user ? '修改' : '添加'}用户成功`)
      this.getUsers()
    } else {
      message.error(result.msg)
    }
    this.setState({ isShow: false })
  }

  getUsers = async () => {
    const result = await reqUsers()
    if (result.status === '0') {
      const { users, roles } = result.data
      //this.initRoleNames(roles)
      this.setState({
        users,
        roles
      })
    }
  }

  authType = () => {
    const authTypes = this.state.selectedRows //选中的列  和相同类似  但只能选中一个
    if (authTypes.length === 1) {
      const { username } = authTypes[0]
      this.setState({ authTypeusername: username })
      this.setState({
        authType: true
      })
    } else {
      message.warning('请选择一列进行操作')
    }
  }

  /**
   * 密码重置
   */
  onResetPwd = () => {
    //reqResetPwd
    const users = this.state.selectedRows
    let ids = []
    const { username } = memoryUtils.user;
    if (users.length === 0) {
      message.warn('请选择要操作的列')
    } else {
      for (let i = 0; i < users.length; i++) {
        ids.push(users[i].id)
      }
      Modal.confirm({
        title: `确认对所选列进行重置密码?`,
        onOk: async () => {
          const result = await reqResetPwd(ids, username)
          if (result.status === '0') {
            message.success(result.msg)
            this.getUsers()
          } else {
            message.warn(result.msg)
          }
        }
      })
    }
  }

  /**
   * 导出用户数据请求  
   */
  onExportUserInfo = async () => {
    const result = await reqExportUserInfo()
    if ('0' === result.status) {
      message.success(result.msg)
    } else {
      message.error('导出异常，请稍后重试')
    }

  }

  UNSAFE_componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getUsers()
  }


  render() {

    const { users, roles, isShow, authType, lockReason, lockReasonLoading } = this.state
    const user = this.user || {}

    const title = (<span>
      搜索栏
    </span>)
    const extra = (
      <span>
        <Button style={{ margin: '0 15px' }} type='primary' onClick={this.lockUser}>锁定</Button>
        <Button type='primary' onClick={this.onExportUserInfo}> 导出 </Button>
        <Button style={{ margin: '0 15px' }} type='primary' onClick={this.breakLock}>解锁</Button>
        <Button style={{ width: 90, margin: '0 15px 0 0' }} type='primary' onClick={this.authType}>角色配置</Button>
        <Button type='primary' onClick={this.onResetPwd}>密码重置</Button>
        <Button style={{ width: 90, margin: '0 15px' }} type='primary' onClick={this.showAdd}>创建用户</Button>
        <Button type='danger' onClick={this.delBatch}>删除用户</Button>
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
          dataSource={users}
          columns={this.columns}
          pagination={{ defaultPageSize: 8 }}
        />

        <Modal
          title={user.id ? '修改用户' : '添加用户'}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          destroyOnClose={true}
          onCancel={() => {
            this.form.resetFields()
            this.setState({ isShow: false })
          }}
        >
          <UserForm
            setForm={form => this.form = form}
            roles={roles}
            user={user}
            isUpdate={user.id ? true : false}
          />
        </Modal>

        <Modal
          title='角色配置'
          visible={authType}
          width='700px'
          onOk={() => {
            this.setState({
              authType: false,
              selectedRows: []
            })
          }}
          destroyOnClose={true}
          onCancel={() => {
            this.setState({ authType: false })
          }}
        >
          <AuthType
            authTypeusername={this.state.authTypeusername}
          />
        </Modal>

        <Modal
          title='锁定原因'
          visible={lockReason}
          width='500px'
          onOk={this.sendLockReason}
          destroyOnClose={true}
          confirmLoading={lockReasonLoading}
          onCancel={() => {
            this.setState({ lockReason: false })
          }}
        >
          <LockReason
            setForm={form => this.form = form}
          />
        </Modal>
      </Card>
    )
  }
}