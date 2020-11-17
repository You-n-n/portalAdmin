import React, {Component} from 'react'
import { Table, Button, message, Card ,Select, Input,} from 'antd';
import LinkButton from '../../components/link-button'
import {reqGetOperations} from '../../api/'
/**
 * 用户路由
 */

const Option = Select.Option

export default class Log extends Component{

    state = {
      total: 0, // 日志的总数量
      operations: [], //日志的数组
      loading: false, //加载...
      searchName:'', //搜索的关键字
      opType:'any', //操作类型
      opMenu:'any' // 操作菜单
    }

    //初始化table 的列的数组
    initColumns = () => {
      this.columns = [
        {
          title: '操作人',
          dataIndex: 'acctId',
          key: 'acctId',
        },
        {
          title: '操作类型',
          dataIndex: 'opType',
          key: 'opType',
        },
        {
          title:'操作菜单',
          dataIndex: 'opMenu',
          key: 'opMenu',
        },
        {
          title: '操作内容',
          dataIndex: 'logCntt',
          key: 'logCntt',
        },
        {
          title: '修改前数据',
          dataIndex: 'beforeCntt',
          key: 'beforeCntt',
        },{
          title: '修改后数据',
          dataIndex: 'afterCntt',
          key: 'afterCntt',
        },{
          title: '操作时间',
          dataIndex: 'opTime',
          key: 'opTime',
        },
        // {
        //   title: 'Action',
        //   key: 'action',
        //   render: () => (
        //   <span>
        //   <LinkButton onClick={'/'}>详情</LinkButton>
        //   </span>
        //   ),
        // },
        ];
}

  componentWillMount (){
    this.initColumns()
}

//发送异步ajax请求
componentDidMount () {
  this.getOperations()
}

  getOperations = async () => {
    this.setState({loading: true})
    const result = await reqGetOperations()
    this.setState({loading: false})
    if(result.status==='0'){
      //得到的可能是一级也可能是二级
      const operations = result.data
      this.setState({
        operations : operations
      })
  }else {
      message.error('获取日志信息失败')
  }
}

    render() {
      const {operations, loading, opType, opMenu, daiding} = this.state

      //card的左侧标题
      const title =(
                <span>
                  搜索
                </span>
          )
          //card的右侧标题
          const extra = (
            <span>
              <span>操作人</span>
                <Input 
                    placeholder='操作人' 
                    style={{width: 150, margin:'0 15px'}} 
                    value={daiding} 
                />

              <span>操作类型</span>
                <Select 
                    value={opMenu} 
                    style={{width: 150, margin:'0 15px'}} 
                    onChange={value => this.setState({opMenu:value})}
                >
                    <Option value='any'>请选择</Option>
                    <Option value='CATEGORY_MANAGEMENT'>品类管理</Option>
                    <Option value='PRODUCT_MANAGEMENT'>商品管理</Option>
                    <Option value='USER_MANAGEMENT'>用户管理</Option>
                    <Option value='ROLE_MANAGEMENT'>角色管理</Option>
                </Select>

              <span>操作类型</span>
                <Select 
                    value={opType} 
                    style={{width: 150, margin:'0 15px'}} 
                    onChange={value => this.setState({opType:value})}
                >
                    <Option value='any'>请选择</Option>
                    <Option value='add'>新增</Option>
                    <Option value='upd'>修改</Option>
                    <Option value='del'>删除</Option>
                </Select>
                
                <Button type='primary' style={{margin:'0 100px'}} >搜索</Button>
            </span>
          )

        return (
          <div>
            <div>
            </div>

            <div>
            <Card title={title} extra={extra}>
                  <Table columns={this.columns} 
                  rowKey="logId"
                  bordered
                  dataSource={operations} 
                  pagination={{defaultPageSize:8, showQuickJumper:true}}
                  loading={loading}
                  />
                </Card>
            </div>
          </div>
        )
    }
}