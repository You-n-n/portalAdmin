import { Table } from 'antd'
import propTypes from 'prop-types'
import React, { Component } from 'react'

export default class LogDetail extends Component {
  static propTypes = {
    operLogDetail: propTypes.any.isRequired,
    showName: propTypes.any.isRequired
  }

  state = {
    detail: [],
    detailList: []
  }
  initColumns = () => {
    this.columns = [
      {
        title: '要素名称',
        dataIndex: 'key',
        width: 225,
        ellipsis: true,
      },
      {
        title: '要素值',
        dataIndex: 'value',
        width: 225,
        ellipsis: true,
      },
    ]
  }

  componentDidMount() {
    const { operLogDetail } = this.props
    const { afterCntt } = operLogDetail
    const { beforeCntt } = operLogDetail
    let cntt = ''
    if (null != afterCntt) {
      cntt = afterCntt
    } else {
      cntt = beforeCntt
    }
    try {
      const showName = this.props.showName
      const cntts = JSON.parse(cntt)
      let listData = [];
      Object.keys(cntts).forEach(key => {
        let jsonObj = { "key": "", "value": "" };
        jsonObj.key = showName.get(key) ? showName.get(key) : key;
        jsonObj.value = cntts[key];
        listData.push(jsonObj)
      })
      this.setState({
        detailList: listData
      })
    } catch (e) {
      this.setState({ showData: [] });
      alert("json格式解析失败")
    }
    this.initColumns()
  }

  render() {
    const { detail } = this.state
    return (
      <div>
        <Table
          dataSource={this.state.detailList}
          columns={this.columns}
          bordered
          pagination={false}
        />
      </div>
    )
  }
}