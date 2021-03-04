import React, { Component } from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd'
import LinkButton from "../../components/link-button/index"

export default class OrderForm extends Component {

  initColumns = () => {
    this.columns = [
      {
        title: '订单号',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '下单时间',
        dataIndex: 'createOrderTime',
        key: 'createOrderTime'
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
        title: '出库/发货',
        dataIndex: 'finalInfo',
        key: 'finalInfo'
      },
      {
        title: '状态',
        dataIndex: 'orderState',
        key: 'orderState'
      },
      {
        title: '收款状态',
        dataIndex: 'paymentState',
        key: 'paymentState'
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



  UNSAFE_componentWillMount() {
    this.initColumns()
  }

  render() {

    const dataSource = [
      {
        id: 'DH-O-20201204-319084',
        createOrderTime: '2020-12-04 12:06',
        customerName: '个人超市',
        price: '62.19',
        finalInfo: '备货中/代发货',
        orderState: '待出库审核',
        paymentState: '未收款'
      },
      {
        id: 'DH-O-20201204-319455',
        createOrderTime: '2020-12-04 12:00',
        customerName: '胡彦兵',
        price: '10.00',
        finalInfo: '已出库/已发货',
        orderState: '待收货确认',
        paymentState: '已收款'
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
          pagination={{ defaultPageSize: 8 }}
        />
      </Card>
    )
  }
}