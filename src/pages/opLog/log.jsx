import React, {Component} from 'react'
import { Table, Button, message, Card ,Select, Input,} from 'antd';
import LinkButton from '../../components/link-button'
import {reqGetOperations, reqGetOperationByAny} from '../../api/';
import {OPER_PAGE_SIZE} from '../../utils/constants'
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
      opType:'', //操作类型
      opMenu:'', // 操作菜单
      searchName: ''
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
  this.getOperations(1)
}

  getOperations = async (pageNum) => {
    this.pageNum = pageNum //保存pageNum,让其他方法可以看见
    this.setState({loading: true})
    const {searchName, opType, opMenu} = this.state
    let result
    if(searchName || opType || opMenu){
      result = await reqGetOperationByAny({pageNum,pageSize:OPER_PAGE_SIZE,searchName,opType,opMenu})
    }else{
      result = await reqGetOperations(pageNum,OPER_PAGE_SIZE)
    }
    this.setState({loading: false})
    if(result.status==='0'){
      const {total,list} = result.data
            this.setState({
                total,
                operations: list
            })
    }else {
      this.setState({loading:false})
      message.error('获取日志信息失败')
    }
}

  getSetState = () => {
    this.setState({
        searchName:'',
        opType:'',
        opMenu:''
    })
  }

    render() {
      const {operations, loading, opType, opMenu, searchName, total} = this.state

      //card的左侧标题
      const title =(
                <span>
                  搜索栏
                </span>
          )
          //card的右侧标题
          const extra = (
            <span>
              <span>操作人</span>
                <Input 
                    placeholder='操作人' 
                    style={{width: 150, margin:'0 15px'}} 
                    value={searchName} 
                    onChange={event => this.setState({searchName:event.target.value})}
                />

              <span>操作菜单</span>
                <Select 
                    value={opMenu} 
                    style={{width: 150, margin:'0 15px'}} 
                    onChange={value => this.setState({opMenu:value})}
                >
                    <Option value=''>请选择</Option>
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
                    <Option value=''>请选择</Option>
                    <Option value='1'>新增</Option>
                    <Option value='2'>修改</Option>
                    <Option value='3'>删除</Option>
                </Select>
                
                <Button type='primary' onClick={() => this.getOperations(1)} style={{margin:'0 15px 0 100px'}} >搜索</Button>
                <Button type='primary' onClick={() => this.getSetState()} >重置</Button>
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
                  pagination={{
                    total,
                    defaultPageSize:OPER_PAGE_SIZE, 
                    showQuickJumper:true,
                    onChange: this.getOperations
                  }}
                  loading={loading}
                  />
                </Card>
            </div>
          </div>
        )
    }
}