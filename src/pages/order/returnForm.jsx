import React, {Component} from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd'
import LinkButton from "../../components/link-button/index"

export default class ReturnForm extends Component{
    initColumns = () => {
        this.columns = [
          {
            title: '退单号',
            dataIndex: 'id',
            key: 'id'
          },
          {
            title: '下单时间',
            dataIndex: 'createOrderTime',
            key: 'createOrderTime',
            // defaultSortOrder: 'descend',
            // sorter: (a, b) => a.createOrderTime - b.createOrderTime,
          },
          {
            title: '客户名称',
            dataIndex: 'customerName',
            key: 'customerName'
          },
    
          {
            title: '金额',
            dataIndex: 'price',
            key: 'price',
            render: (price) => '¥' + price
          },
          {
            title: '状态',
            dataIndex: 'orderState',
            key: 'orderState'
          },
          {
            title: '退款状态',
            dataIndex: 'returnState',
            key: 'returnState'
          },
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
    
    
     
      UNSAFE_componentWillMount () {
        this.initColumns()
      }

      onChange(pagination, filters, sorter, extra) {
        //console.log('params', pagination, filters, sorter, extra);
      }
    
      render() {

        const dataSource = [
            {
                id: 'DH-O-20201204-319084',
                createOrderTime: '2020-12-04 12:06',
                customerName: '个人超市',
                price: '62.19',
                orderState: '待出库审核',
                returnState: '已退款'
            },
            {
                id: 'DH-O-20201204-319455',
                createOrderTime: '2020-12-04 12:00',
                customerName: '胡彦兵',
                price: '10.00',
                finalInfo: '已出库/已发货',
                orderState: '待出库审核',
                returnState: '已退款'
            },
          ];
    
    
        const title = <Button type='primary' onClick={this.showAdd}>新增订单</Button>
    
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
              dataSource={dataSource}
              columns={this.columns}
              pagination={{defaultPageSize: 8}}
              onChange={this.onChange}
            />
          </Card>
        )
      }
}