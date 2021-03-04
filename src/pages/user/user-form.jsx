import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Select,
  Input,
  message,
  Radio 
} from 'antd'
import {reqToGetAcctId,reqCheckPhone} from '../../api/index'

const Item = Form.Item
const Option = Select.Option

/*
添加/修改用户的form组件
 */
class UserForm extends PureComponent {

  static propTypes = {
    setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
    roles: PropTypes.array.isRequired,
    user: PropTypes.object,
  }

  state = {
    accountNameState:'',
    phoneState:'',
    usernameState:'',
    mailState: '',
    prsnIdNumState:'',
    sexState:'',
    orgaState:''
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
          this.setState({usernameState:'success'})
        }else{
          message.error(result.msg)
          this.setState({usernameState:'error'})
        }
      }
    })
  }

  checkPhone = () => {
    this.props.form.validateFields( async (error,values) => {
      if(!error){
        const{telPhone} = values
        const result = await reqCheckPhone(telPhone)
        if(null != telPhone && '' != telPhone){
          if(result.status != '0'){
            message.error(result.msg)
            this.setState({phoneState:'error'})
          }else{
            this.setState({phoneState:'success'})
          }
        }else{
          this.setState({phoneState:''})
        }
      }
    })
  }

  onAccountName = () => {
    this.props.form.validateFields( async (error,values) => {
      if(!error){
        const{accountName} = values
        if(null != accountName && '' != accountName){
          this.setState({accountNameState:'success'})
        }else{
          this.setState({accountNameState:''})
        }
      }
    })
  }

  onMail = () => {
    this.props.form.validateFields( async (error,values) => {
      if(!error){
        const{mail} = values
      if(null != mail && '' != mail){
        this.setState({mailState:'success'})
      }else{
        this.setState({mailState:''})
      }
      }
    })
  }

  onOrga = () => {
    this.props.form.validateFields( async (error,values) => {
      if(!error){
        const{orgaName} = values
      if(null != orgaName && '' != orgaName){
        this.setState({orgaState:'success'})
      }else{
        this.setState({orgaState:''})
      }
      }
    })
  }

  onPrsnIdNum = () => {
    this.props.form.validateFields( async (error,values) => {
      if(!error){
        const{prsnIdNum} = values
      if(null != prsnIdNum && '' != prsnIdNum){
        this.setState({prsnIdNumState:'success'})
      }else{
        this.setState({prsnIdNumState:''})
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
    const {accountNameState,usernameState,phoneState,mailState,prsnIdNumState,sexState,orgaState} = this.state
    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }

    return (
      <Form {...formItemLayout}>
        <Item label='姓名'
          hasFeedback
          validateStatus={accountNameState}
        >
          {
            getFieldDecorator('accountName', {
              initialValue: user.accountName,
            })(
              <Input placeholder='请输入用户名'
                onBlur={this.onAccountName}
              />
            )
          }
        </Item>

        <Item label='主账号'
          hasFeedback
          validateStatus={usernameState}
        >
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

        <Item label='性别'
          hasFeedback
          validateStatus={sexState}>
          {
            getFieldDecorator('sex', {
              initialValue: user.sex,
            })(
              <Radio.Group name="radiogroup" value = {user.sex}>
                <Radio value={1}>男</Radio>
                <Radio value={2}>女</Radio>
              </Radio.Group>
            )
          }
        </Item>

        <Item label='手机号'
          hasFeedback
          validateStatus={phoneState}>
          {
            getFieldDecorator('telPhone', {
              initialValue: user.telphone,
            })(
              <Input placeholder='请输入手机号'
                onBlur = {this.checkPhone}
              />
            )
          }
        </Item>

        <Item label='组织机构'
          hasFeedback
          validateStatus={orgaState}>
          {
            getFieldDecorator('orgaName', {
              initialValue: user.orgaName,
            })(
              <Input placeholder='请输入所属组织'
                onBlur = {this.onOrga}
              />
            )
          }
        </Item>
        
        <Item label='邮箱'
          hasFeedback
          validateStatus={mailState}
        >
          {
            getFieldDecorator('mail', {
              initialValue: user.mail,
            })(
              <Input placeholder='请输入邮箱'
                onBlur={this.onMail}
              />
            )
          }
        </Item>
        <Item label='身份证号'
          hasFeedback
          validateStatus={prsnIdNumState}
        >
          {
            getFieldDecorator('prsnIdNum', {
              initialValue: user.prsnIdNum,
            })(
              <Input placeholder='请输入身份证号'
                onBlur={this.onPrsnIdNum}
              />
            )
          }
        </Item>

        {/* <Item label='角色'>
          {
            getFieldDecorator('roleid', {
              initialValue: user.roleid,
            })(
              <Select>
                {
                  roles.map(role => <Option key={role.id} value={role.id}>{role.name}</Option>)
                }
              </Select>
            )
          }
        </Item> */}
      </Form>
    )
  }
}

export default Form.create()(UserForm)