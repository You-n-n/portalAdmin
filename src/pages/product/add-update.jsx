import React, {Component} from 'react'
import {Card, Form, message, Input, Cascader, Upload, Icon, Button}from 'antd'
import LinkButton from '../../components/link-button'

const {Item} = Form 
const { TextArea} = Input

/**
 * product 的添加和更新的子路由
 */

 export default class ProductAddUpdate extends Component{
     render(){

        //指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 2},
            wrapperCol: { span: 14},
        }

         const title = (
             <span>
                 <LinkButton>
                 <Icon type='arrow-left' style={{fontSize: 20}} />
                 </LinkButton>
                 <span>
                     添加商品
                 </span>
             </span>
         )

         return(
             <Card title={title} >
                 <Form {...formItemLayout}>
                     <Item label="商品名称">
                         <Input placeholder='请输入商品名称' />
                     </Item>
                 </Form>
             </Card>
         )
     }
 }