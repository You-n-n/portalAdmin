import React, { Component } from 'react';

import ReactEcharts from 'echarts-for-react';

class Line extends Component {
    constructor() {
        super()
        this.state = {
            option: {
                xAxis: {
                    type: "category",
                    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                },
                yAxis: {},
                series: [{
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: "line"
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

export default Line;