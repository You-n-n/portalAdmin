import React, { Component } from 'react'
import { Form, Input } from 'antd'
import propTypes from 'prop-types'
/**
 * 添加分类的form组件
 */
const Item = Form.Item

class UpdateForm extends Component {

    static propTypes = {
        categoryName: propTypes.string.isRequired,
        setForm: propTypes.func.isRequired
    }

    UNSAFE_componentWillMount() {
        //准备将form对象通过setform()方法传递给父组件
        this.props.setForm(this.props.form)
    }

    render() {
        const { categoryName } = this.props
        const { getFieldDecorator } = this.props.form

        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator(
                            'categoryName', {
                            initialValue: categoryName,
                            rules: [
                                { required: true, message: '分类名称必须输入' }
                            ]
                        }
                        )(
                            <Input placeholder='请输入分类名称' />
                        )
                    }
                </Item>
            </Form>
        )
    }
}

export default Form.create()(UpdateForm)