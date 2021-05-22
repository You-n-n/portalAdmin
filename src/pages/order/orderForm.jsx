import React, { Component } from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message,
  Descriptions
} from 'antd'
import { reqGetOrder } from '../../api/';
import LinkButton from "../../components/link-button/index"

export default class OrderForm extends Component {

  state = {
    order: [], //获取所有订单列表
    orderModal: false,
    myOrder: []
  }

  initColumns = () => {
    this.columns = [
      {
        title: '订单号',
        dataIndex: 'orderId',
        key: 'orderId'
      },
      {
        title: '下单时间',
        dataIndex: 'createTime',
        key: 'createTime'
      },
      {
        title: '客户名称',
        dataIndex: 'customer',
        key: 'customer'
      },

      {
        title: '实付金额',
        dataIndex: 'price',
        key: 'price',
        render: (price) => '¥' + price
      },
      {
        title: '出库/发货',
        dataIndex: 'isReady',
        key: 'isReady'
      },
      {
        title: '状态',
        dataIndex: 'orderState',
        key: 'orderState'
      },
      {
        title: '收款状态',
        dataIndex: 'payment',
        key: 'payment'
      },
      {
        title: '操作',
        render: (order) => (
          <span>
            <LinkButton onClick={() => this.showModal(order)}>详情</LinkButton>
          </span>
        )
      },
    ]
  }

  showModal = (order) => {
    this.setState({
      orderModal: true,
      myOrder: order
    })
  }

  getAllOrder = async () => {
    const result = await reqGetOrder('1')
    if (result.status === '0') {
      this.setState({
        order: result.data
      })
    } else {
      message.error('获取订单列表信息失败')
    }
  }



  UNSAFE_componentWillMount() {
    this.initColumns()
    this.getAllOrder()
  }


  render() {

    const { order, orderModal, myOrder } = this.state

    const title = (<span>
      搜索栏
    </span>)

    const extra = (
      <span>
        <Button type='primary' onClick={this.getAllOrder}>导出</Button>
      </span>
    )

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
      <Card title={title} extra={extra}>
        <Table
          rowSelection={rowSelection}
          bordered
          rowKey='id'
          dataSource={order}
          columns={this.columns}
          pagination={{ defaultPageSize: 8 }}
        />

        <Modal
          title="订单详情"
          visible={orderModal}
          onOk={() => { this.setState({ orderModal: false }) }}
          onCancel={() => { this.setState({ orderModal: false }) }}
          okText="确认"
          cancelText="取消"
          width={750}
        >
          <Descriptions
            layout="vertical"
            bordered
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
          >
            <Descriptions.Item label="客户名称">{myOrder.customer}</Descriptions.Item>
            <Descriptions.Item label="电话号">{myOrder.telPhone}</Descriptions.Item>
            <Descriptions.Item label="商品名称">{myOrder.productName}</Descriptions.Item>
            <Descriptions.Item label="商品价格\¥">{myOrder.productPrice}</Descriptions.Item>
            <Descriptions.Item label="收货地址">{myOrder.address}</Descriptions.Item>
          </Descriptions>
        </Modal>
      </Card>
    )
  }
}