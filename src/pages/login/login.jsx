import React, {Component} from 'react'
import {Form, Input, Icon, Button, message} from 'antd'
import {Redirect} from 'react-router-dom'
import logo from './images/logo.png'
import './login.less'
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

const Item = Form.Item;

/* 登 陆 路 由 组 件 */
class Login extends Component {

    handleSubmit = (event) => {
        //阻止事件的默认行为
        event.preventDefault();

        //对所有表单字段进行检验
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
              //console.log('提交登录的ajax', values);
              //请求登录
              const {username, password} = values
              const result = await reqLogin(username, password)
              //console.log('请求成功',response.data)
              if(result.status==='0'){//成功
                //显示成功
                message.success('登陆成功')

                //  把user保存到内存中
                const user = result.data
                memoryUtils.user = user  //保存到内存中
                storageUtils.saveUser(user) //保存到local

                //跳转到管理界面 history.push 可回退 replace 不能回退
                this.props.history.replace('/')

              }else{//失败
                  message.error(result.msg)
              }

            }else{
                console.log('校验失败')
            }
          });
        //得到强大的form对象
        // const form = this.props.form;
        // //获取form表单项的输入数据   
        // const values = form.getFieldsValue();
        // console.log('values', values);
    }

    /**
     * 对密码进行自定义验证
     * callback() 验证通过
     */
    validatePwd = (rule, value, callback) => {
        console.log('validatePwd',rule,value)
        if(!value)
        {
        callback("必须输入密码") //验证失败,并提示文本
        } else if (value.length<4){
            callback("密码长度不能小于4位")
        } else if (value.length>12){
            callback("密码长度不能超过12位")
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)){
            callback("密码格式不正确")
        } else {
            callback()
        }
    }

    

    render() {

        //如果用户已经登录,自动跳转到管理页面
        const user = memoryUtils.user
        if(user && user.id){
            return <Redirect to='/' />
        }

        // 得到具有强大功能的form对象
        const form = this.props.form;
        const {getFieldDecorator} = form;

        return (<div className='login'>
                <header className='login-header'><img src={logo} alt="logo"/> <h1>React 项目: 后台管理系统</h1></header>
                <section className='login-content'><h1>用户登录</h1>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                            {getFieldDecorator('username', {
                                //声明式验证:直接使用别人定义好的验证规则进行验证
                                rules: [
                                    {required: true, message: '必须输入用户名'},
                                    {min: 4, message: '用户名至少4位'},
                                    {max: 12, message: '用户名至多12位'},
                                    {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名格式错误'},
                                ],
                            })(
                                <Input prefix={
                                    <Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                       placeholder="用户名"/>,
                            )}
                        </Item>
                        <Item>
                            {getFieldDecorator('password', {
                                rules: [
                                    {
                                        validator: this.validatePwd,
                                    },
                                ],
                            })(
                                <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                                       placeholder="密码"/>,
                            )}

                        </Item>
                        <Item> <Button type="primary" htmlType="submit" className="login-form-button"> 登录 </Button>
                        </Item>
                    </Form>
                </section>
            </div>
        )
    }
}


const WrapLogin = Form.create()(Login)
export default WrapLogin

/**
 * async 和 await
 */