import React, {Component} from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message,
  Icon
} from 'antd'
import {formateDate} from "../../utils/dateUtils"
import LinkButton from "../../components/link-button/index"
import {reqDeleteUser, reqUsers, reqAddOrUpdateUser} from "../../api/index";
import UserForm from './user-form'
import AuthType from './authtype'
import memoryUtils from '../../utils/memoryUtils'

/*
用户路由
 */
export default class User extends Component {

  state = {
    users: [], // 所有用户列表
    roles: [], // 所有角色列表
    isShow: false, // 是否显示确认框
    dels: [], // 要删除的数组
    acctStatus: '',
    authType: false, //权限配置
    authTypeusername : '' //用于权限配置的用户名
  }

  initColumns = () => {
    this.columns = [
      {
        title: '姓名',
        dataIndex: 'accountName',
        key: 'accountName',
        width: 120,
        fixed: 'left',
      },
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        width: 200,
      },
      {
        title: '账号状态',
        dataIndex: 'acctStatus',
        key: 'acctStatus',
        width: 200,
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
        width: 200,
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
        const {username} = memoryUtils.user;
        let ids = []
        let account = []
        ids.push(user.id)
        account.push(user.username)
        const result = await reqDeleteUser(ids,username,account)
        if(result.status === '0') {
          message.success(result.msg)
          this.getUsers()
        }
      }
    })
  }

  /**
   * 批量删除
   */
  delBatch = () => {
    const dels = this.state.dels
    let ids = []
    let account = []
    const {username} = memoryUtils.user;
    if(dels.length === 0){
      message.warn('请选择列')
    }else{
      for(let i = 0 ; i < dels.length ; i++){
        ids.push(dels[i].id)
        account.push(dels[i].username)
      }
      Modal.confirm({
        title: `确认删除所选列吗?`,
        onOk: async () => {
          const result = await reqDeleteUser(ids,username,account)
          if(result.status === '0') {
            message.success(result.msg)
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

    const {username} = memoryUtils.user;

    // 1. 收集输入数据
    const user = this.form.getFieldsValue()
    const er = this.form.getFieldsError()
    this.form.resetFields()
    // 如果是更新, 需要给user指定id属性
    if (this.user) {
      user.id = this.user.id
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

  authType = () => {
    const dels = this.state.dels //选中的列  和相同类似  但只能选中一个
    const {username} = dels[0]
    this.setState({authTypeusername : username})
    if(dels.length === 1){
      this.setState({
        authType : true
      })
    }else{
      message.warning('请选择一列进行操作')
    }
    
  }

  UNSAFE_componentWillMount () {
    this.initColumns()
  }

  componentDidMount () {
    this.getUsers()
  }


  render() {

    const {users, roles, isShow, authType} = this.state
    const user = this.user || {}

    const title =( <span>
                      搜索栏
                    </span> )
    const extra = (
                    <span>
                      <Button style={{width: 90, margin:'0 15px'}}  type='primary' onClick={this.authType}>角色配置</Button>
                      <Button type='danger' onClick={this.delBatch}>删除用户</Button>
                      <Button style={{width: 90, margin:'0 15px'}}  type='primary' onClick={this.showAdd}>密码重置</Button>
                      <Button type='primary' onClick={this.showAdd}>创建用户</Button>
                    </span>
                    )

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      onSelect: (record, selected, selectedRows) => {
        this.setState({
          dels : selectedRows
        })
        //console.log(selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        this.setState({
          dels : selectedRows
        })
        //console.log(selected, selectedRows, changeRows);
      },
    };

    return (
      <Card title={title} extra={extra}>
        <Table
          scroll={{ x: 2200}}
          rowSelection={rowSelection}
          bordered={true}
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

        <Modal
          title= '角色配置'
          visible={authType}
          width='700px'
          onOk={() => {
            this.setState({authType: false})
          }}
          destroyOnClose={true}
          onCancel={() => {
            this.setState({authType: false})
          }}
        >
          <AuthType
            authTypeusername= {this.state.authTypeusername}
          />
        </Modal>

      </Card>
    )
  }
}