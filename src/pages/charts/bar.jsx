import React, { Component } from 'react';

import ReactEcharts from 'echarts-for-react';

class Bar extends Component {
    constructor() {
        super()
        this.state = {
            option: {
                title: {
                    text: 'ECharts 入门示例'
                },
                tooltip: {},
                legend: {
                    data: ['销量']
                },
                xAxis: {
                    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }]
            }
        }
    }
    render() {
        return (
            <div>
                <ReactEcharts option={this.state.option} style={{ height: '400px', width: '700px' }} />
            </div>
        )
    }
}

export default Bar;