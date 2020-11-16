import React, {Component} from 'react'
import { Table, Divider, Tag, message } from 'antd';
import LinkButton from '../../components/link-button'
import {reqGetOperations} from '../../api/'
/**
 * 用户路由
 */
const data = [
    {
        acctId: "超级管理员",
        logCntt: "修改: “茶品” ==> “茶品1”",
        opMenu: "品类管理",
        opType: "修改"
    },
    {
        acctId: "超级管理员",
        logCntt: "新增: 一级分类==>“茶品”",
        opMenu: "品类管理",
        opType: "新增"
    },
    {
        acctId: "超级管理员",
        logCntt: "新增: 商品==>“呢绒大衣”",
        opMenu: "商品管理",
        opType: "新增"
    },
    {
        acctId: "用户1",
        logCntt: "删除: 二级分类==>“龙井”",
        opMenu: "品类管理",
        opType: "删除"
    },
    {
        acctId: "超级管理员",
        logCntt: "修改: “衣服1” ==> “衣服”",
        opMenu: "品类管理",
        opType: "修改"
    },
    {
        acctId: "超级管理员",
        logCntt: "新增: 一级分类==>“衣服1”",
        opMenu: "品类管理",
        opType: "新增"
    },
];
export default class Log extends Component{

    state = {
      total: 0, // 日志的总数量
      operations: [], //日志的数组
      loading: false, //加载...
      searchName:'', //搜索的关键字
      searchType:'productName', //根据哪个字段进行搜索
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
        {
          title: 'Action',
          key: 'action',
          render: () => (
          <span>
          <LinkButton onClick={'/'}>详情</LinkButton>
          </span>
          ),
        },
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
      const {operations, loading} = this.state
        return (
            <Table columns={this.columns} 
            rowKey="logId"
            bordered
            dataSource={operations} 
            pagination={{defaultPageSize:8, showQuickJumper:true}}
            loading={loading}
            />
        )
    }
}