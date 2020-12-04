import { Button } from 'antd'
import React, {Component} from 'react'

export default class LogDetail extends Component{
    static propTypes = {
        operLogDetail:[]
    }
print = () => {
    const {operLogDetail} = this.props
    console.log(operLogDetail)
}
    render() {
        return(
            <div>
                <span>LogDetail</span>
            </div>
        )
    }
}