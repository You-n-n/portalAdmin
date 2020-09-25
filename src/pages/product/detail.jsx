import React, {Component} from 'react'
import {Card, Icon, List} from 'antd'
import imgs from '../../assets/images/ad1.jpg'

const Item = List.Item
/**
 * product 的详情页的子路由
 */

 export default class ProductDetail extends Component{
    render(){

        const title = (
            <span>
                <Icon type='arrow-left' />
                <span>商品详情</span>
            </span>
        )

        return(
            <Card title={title} className='product-detail'>
                <List>
                    <Item>
                        <span className="left">商品名称:</span>
                        <span>联想ThinkPad 翼480</span>
                    </Item>
                    <Item>
                        <span className="left">商品描述:</span>
                        <span>阿斯蒂芬看啥看你的开发商就服你看见爱上年份的</span>
                    </Item>
                    <Item>
                        <span className="left">商品价格:</span>
                        <span>6666元</span>
                    </Item>
                    <Item>
                        <span className="left">所属分类:</span>
                        <span>电脑 --{'>'} 笔记本</span>
                    </Item>
                    <Item>
                        <span className="left">商品图片:</span>
                        <span>
                            <img 
                                className="product-img"
                                src={imgs} 
                                alt="img" 
                            />
                            <img 
                                className="product-img"
                                src={imgs} 
                                alt="img" 
                            />
                        </span>
                    </Item>
                    <Item>
                        <span className="left">商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html: '<h1>商品详情的内容标题</h1>'}} />
                    </Item>
                </List>
            </Card>
        )
    }
 }