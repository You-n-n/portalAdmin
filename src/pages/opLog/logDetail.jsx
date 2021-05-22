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
    if (undefined !== afterCntt) {
      cntt = afterCntt
    } else {
      cntt = beforeCntt
    }
    try {
      const showName = this.props.showName
      const cntts = JSON.parse(cntt)
      let listData = [];
      //使用for循环将cnnts（json数据，操作内容）进行解析，将json数据=>Map集合
      Object.keys(cntts).forEach(key => {
        //声明一个Map集合
        let jsonObj = { "key": "", "value": "" };
        //key值存放数据名称，showName是为了转换数据，例如：name->姓名，age->年龄。对应“a”的内容
        jsonObj.key = showName.get(key) ? showName.get(key) : key;
        //value存放“b”的内容
        jsonObj.value = cntts[key];
        //将解析玩的数据存入list中用于最后的展示
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