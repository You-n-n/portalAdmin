import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Select,
  Input,
  message
} from 'antd'
import {reqToGetAcctId} from '../../api/index'

const Item = Form.Item
const Option = Select.Option

/*
添加/修改用户的form组件
 */
class UserForm extends PureComponent {

  static propTypes = {
    setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
    roles: PropTypes.array.isRequired,
    user: PropTypes.object
  }

  getAcctId = () => {
    this.props.form.validateFields( async (error,values) => {
      if(!error){
        const{accountName} = values
        const result = await reqToGetAcctId(accountName)
        if(result.status === '0'){
          const username1 = result.data
          this.props.form.setFieldsValue({
            'username':username1
          })
        }else{
          message.error(result.msg)
        }
      }
    })
  }

  UNSAFE_componentWillMount () {
    this.props.setForm(this.props.form)
  }

  render() {

    const {roles, user} = this.props
    const { getFieldDecorator } = this.props.form
    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }

    return (
      <Form {...formItemLayout}>
        <Item label='姓名'>
          {
            getFieldDecorator('accountName', {
              initialValue: user.accountName,
            })(
              <Input placeholder='请输入用户名'/>
            )
          }
        </Item>

        <Item label='主账号'>
          {
            getFieldDecorator('username', {
              initialValue: user.username,
            })(
              <Input placeholder='系统生成主账号'
                type="text"
                autoComplete="off"
                readOnly={true}
                onFocus={this.getAcctId}
             />
            )
          }
        </Item>

        <Item label='手机号'>
          {
            getFieldDecorator('telPhone', {
              initialValue: user.telPhone,
            })(
              <Input placeholder='请输入手机号'/>
            )
          }
        </Item>
        <Item label='邮箱'>
          {
            getFieldDecorator('mail', {
              initialValue: user.mail,
            })(
              <Input placeholder='请输入邮箱'/>
            )
          }
        </Item>
        <Item label='身份证号'>
          {
            getFieldDecorator('prsnIdNum', {
              initialValue: user.prsnIdNum,
            })(
              <Input placeholder='请输入身份证号'/>
            )
          }
        </Item>

        <Item label='角色'>
          {
            getFieldDecorator('role_id', {
              initialValue: user.role_id,
            })(
              <Select>
                {
                  roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(UserForm)