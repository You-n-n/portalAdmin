import { Button } from 'antd'
import React, {Component} from 'react'
import propTypes from 'prop-types'

export default class LogDetailTwo extends Component{
    static propTypes = {
        operLogDetail: propTypes.any.isRequired,
        showName: propTypes.any.isRequired
    }
print = () => {
    const {operLogDetail} = this.props
    console.log(operLogDetail)
}
    render() {
        return(
            <div>
                <span>LogDetailTwo</span>
            </div>
        )
    }
}