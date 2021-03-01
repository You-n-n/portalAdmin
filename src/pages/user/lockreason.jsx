import React, {Component} from 'react'
import {Input,Form } from 'antd';

const { TextArea } = Input;
const {Item} = Form 

/*
锁定原因
 */
class LockReason extends Component {

    UNSAFE_componentWillMount () {
        this.props.setForm(this.props.form)
    }

    render(){

        const formItemLayout = {
            labelCol: {
              span: 0,
            },
            wrapperCol: {
              span: 30,
            },
        };

        const { getFieldDecorator } = this.props.form
        
        return(
            <div>
                <Form {...formItemLayout}>
                    <Item label=''
                    >
                    {
                        getFieldDecorator('lockreason', {
                        })(
                        <TextArea autoSize={true} allowClear placeholder='请输入锁定原因' />
                        )
                    }
                    </Item>
                </Form>
            </div>
        )
    }
}

export default Form.create()(LockReason)