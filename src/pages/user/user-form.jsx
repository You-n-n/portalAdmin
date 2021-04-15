import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Select,
  Input,
  message,
  Radio,
  Cascader
} from 'antd'
import { reqToGetAcctId, reqCheckPhone, reqGetOrgaInfo } from '../../api/index'

const Item = Form.Item
const Option = Select.Option

/*
添加/修改用户的form组件
 */
class UserForm extends PureComponent {

  static propTypes = {
    setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
    //roles: PropTypes.array.isRequired,
    user: PropTypes.object,
  }

  state = {
    accountNameState: '',
    phoneState: '',
    usernameState: '',
    mailState: '',
    prsnIdNumState: '',
    sexState: '',
    orgaState: '',
    options: [], //用于级联选择的组织机构
    sexs: ''
  }

  getAcctId = () => {
    this.props.form.validateFields(async (error, values) => {
      if (!error) {
        const { accountName } = values
        const result = await reqToGetAcctId(accountName)
        if (result.status === '0') {
          const username1 = result.data
          this.props.form.setFieldsValue({
            'username': username1
          })
          this.setState({ usernameState: 'success' })
        } else {
          message.error(result.msg)
          this.setState({ usernameState: 'error' })
        }
      }
    })
  }

  checkPhone = () => {
    this.props.form.validateFields(async (error, values) => {
      if (!error) {
        const { telPhone } = values
        if (null !== telPhone && '' !== telPhone && undefined !== telPhone) {
          const result = await reqCheckPhone(telPhone)
          if (result.status !== '0') {
            message.error(result.msg)
            this.setState({ phoneState: 'error' })
          } else {
            this.setState({ phoneState: 'success' })
          }
        } else {
          this.setState({ phoneState: '' })
        }
      }
    })
  }

  onAccountName = () => {
    this.props.form.validateFields(async (error, values) => {
      if (!error) {
        const { accountName } = values
        if (null !== accountName && '' !== accountName && undefined !== accountName) {
          this.setState({ accountNameState: 'success' })
        } else {
          this.setState({ accountNameState: '' })
        }
      }
    })
  }

  onMail = () => {
    this.props.form.validateFields(async (error, values) => {
      if (!error) {
        const { mail } = values
        if (null !== mail && '' !== mail && undefined !== mail) {
          console.log(mail)
          this.setState({ mailState: 'success' })
        } else {
          this.setState({ mailState: '' })
        }
      }
    })
  }

  onOrga = () => {
    this.props.form.validateFields(async (error, values) => {
      if (!error) {
        const { orgaName } = values
        if (null !== orgaName && '' !== orgaName && undefined !== orgaName) {
          this.setState({ orgaState: 'success' })
        } else {
          this.setState({ orgaState: '' })
        }
      }
    })
  }

  onPrsnIdNum = () => {
    this.props.form.validateFields(async (error, values) => {
      if (!error) {
        const { prsnIdNum } = values
        if (null !== prsnIdNum && '' !== prsnIdNum && undefined !== prsnIdNum) {
          this.setState({ prsnIdNumState: 'success' })
        } else {
          this.setState({ prsnIdNumState: '' })
        }
      }
    })
  }

  getOrgaInfo = async () => {
    const result = await reqGetOrgaInfo()
    const options = result.data.map(c => ({
      value: c.orgaName,
      label: c.orgaName,
    }))
    this.setState({
      options: options
    })
  }

  sexState = () => {
    const sexState = this.props.user.sex
    if (sexState === "男") {
      this.setState({
        sexs: '男'
      })
    } else if (sexState === "女") {
      this.setState({
        sexs: '女'
      })
    } else {
      this.setState({
        sexs: ''
      })
    }
  }

  UNSAFE_componentWillMount() {
    this.props.setForm(this.props.form)
    this.getOrgaInfo()
    this.sexState()
  }

  render() {

    const { roles, user, isUpdate } = this.props
    const { getFieldDecorator } = this.props.form
    const { accountNameState, usernameState, phoneState, mailState, prsnIdNumState, sexState, orgaState, options, sexs } = this.state

    //用来接收级联分类Id的数组
    const orgaName = []
    if (isUpdate) {
      orgaName.push(user.orgaName)
    }

    const content = (
      <Radio.Group name="radiogroup" defaultValue={sexs}>
        <Radio value='男'>男</Radio>
        <Radio value='女'>女</Radio>
      </Radio.Group>
    )

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
              <span>{content}</span>
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
                onBlur={this.checkPhone}
              />
            )
          }
        </Item>

        <Item label='组织机构'
          hasFeedback
          validateStatus={orgaState}>
          {
            getFieldDecorator('orgaName', {
              initialValue: orgaName
            })(
              <Cascader options={options} placeholder="请选择所属组织机构" />
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