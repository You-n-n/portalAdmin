import React, { Component } from 'react'
import { Form, Input, message } from 'antd'
import memoryUtils from '../../utils/memoryUtils'
import { reqCheckOldPwd, reqCheckNewPwd } from '../../api/index'

const { Item } = Form
/*
修改密码
 */
class Password extends Component {

  state = {
    oldPwdState: '',
    newPwdState: '',
    confirmPwdState: '',
    helpOldPwd: '',
  }

  checkOldPwd = () => {
    this.props.form.validateFields(async (error, values) => {
      const { oldPwd } = values
      const { username } = memoryUtils.user
      const result = await reqCheckOldPwd(oldPwd, username)
      if (null !== oldPwd) {
        if ('' === oldPwd) {
          this.setState({
            oldPwdState: ""
          })
          return
        }
        if (result.status === '0') {
          this.setState({
            oldPwdState: "success"
          })
        } else {
          message.warning(result.msg)
          this.setState({
            oldPwdState: "warning",
            helpOldPwd: ' '
          })
        }
      }
    })
  }

  checkNewPwd = () => {
    this.props.form.validateFields(async (error, values) => {
      if (values) {
        const { newPwd, confirmPwd } = values
        const result = await reqCheckNewPwd(newPwd, confirmPwd)
        if (null !== confirmPwd) {
          if ('' === confirmPwd) {
            this.setState({
              confirmPwdState: ""
            })
            return
          }
          if (result.status === '0') {
            this.setState({
              confirmPwdState: "success"
            })
          } else {
            message.warning(result.msg)
            this.setState({
              confirmPwdState: "warning"
            })
          }
        }
      }
    })
  }

  onBlur = () => {
    this.props.form.validateFields(async (error, values) => {
      if (values) {
        const { newPwd } = values
        if (null !== newPwd) {
          if ('' === newPwd) {
            this.setState({
              newPwdState: ""
            })
            return
          } else {
            this.setState({
              newPwdState: "success"
            })
          }
        }
      }
    })
  }

  validateOldPwd = (rule, value, callback) => {
    if (value) {
      if ("warning" === this.state.oldPwdState) {
        callback(" ")
      } else if ("" === this.state.oldPwdState) {
        callback(" ")
      } else {
        callback()
      }
    }
  }

  UNSAFE_componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const formItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const { getFieldDecorator } = this.props.form
    const { oldPwdState, helpOldPwd, newPwdState, confirmPwdState } = this.state
    return (
      <div>
        <Form {...formItemLayout}>
          <Item label='原密码'
            hasFeedback
            validateStatus={oldPwdState}
            help={helpOldPwd}
          >
            {
              getFieldDecorator('oldPwd', {
                //initialValue: user.accountName,
                validateTrigger: 'onBlur',
                rules: [
                  {
                    required: true,
                  },
                ]
              })
                (
                  <Input placeholder='请输入原密码'
                    onBlur={this.checkOldPwd}
                    autoComplete="off"
                  />
                )

            }
          </Item>

          <Item label='新密码'
            hasFeedback
            validateStatus={newPwdState}
          >
            {
              getFieldDecorator('newPwd', {
                //initialValue: user.username,
                rules: [
                  { required: true, message: ' ' }
                ]
              })(
                <Input placeholder='请输入新密码'
                  type="text"
                  autoComplete="off"
                  onBlur={this.onBlur}
                />
              )
            }
          </Item>

          <Item label='确认密码'
            hasFeedback
            validateStatus={confirmPwdState}
          >
            {
              getFieldDecorator('confirmPwd', {
                //initialValue: user.telPhone,
                rules: [
                  { required: true, message: ' ' }
                ]
              })(
                <Input placeholder='请再次确认密码'
                  onBlur={this.checkNewPwd}
                  autoComplete="off"
                />
              )
            }
          </Item>
        </Form>
      </div>
    )
  }
}
export default Form.create()(Password)