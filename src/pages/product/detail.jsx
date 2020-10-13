import React, {Component} from 'react'
import {Card, Icon, List} from 'antd'
import imgs from '../../assets/images/ad1.jpg'
import LinkButton from '../../components/link-button'
import {reqCategory} from '../../api'

const Item = List.Item
/**
 * product 的详情页的子路由
 */

 export default class ProductDetail extends Component{

    state = {
        cName1:'',//一级分类名称
        cName2:'',//二级分类名称
    }

    async componentDidMount (){
        //得到当前商品的分类Id
        const {pCategoryId, categoryId} = this.props.location.state.product
        if(pCategoryId==='0'){
            const result = await reqCategory(categoryId)
            const cName1 = result.data.categoryName
            this.setState({cName1})
        }else{
            debugger
            const result1 = await reqCategory(pCategoryId)
            const result2 = await reqCategory(categoryId)
            const cName1 = result1.data.categoryName
            const cName2 = result2.data.categoryName
            this.setState({
                cName1,
                cName2
            })
        }
    }

    render(){

        //读取携带过来的数据
        const {productName, description, price, detail} = this.props.location.state.product
        const {cName1, cName2} = this.state

        const title = (
            <span>
                <LinkButton>
                    <Icon type='arrow-left' style={{color: 'green', marginRight: 10, fontSize: 20}} 
                    onClick={() => this.props.history.goBack()} />
                </LinkButton>
                <span>商品详情</span>
            </span>
        )

        return(
            <Card title={title} className='product-detail'>
                <List>
                    <Item>
                        <span className="left">商品名称:</span>
                        <span>{productName}</span>
                    </Item>
                    <Item>
                        <span className="left">商品描述:</span>
                        <span>{description}</span>
                    </Item>
                    <Item>
                        <span className="left">商品价格:</span>
                        <span>{price}元</span>
                    </Item>
                    <Item>
                        <span className="left">所属分类:</span>
                        <span >{cName1} --{'>'} {cName2}</span>
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
                        <span dangerouslySetInnerHTML={{__html: detail}} />
                    </Item>
                </List>
            </Card>
        )
    }
 }