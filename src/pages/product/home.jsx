import React, {Component} from 'react'
import {Card, Select, Input, Icon, Button, Table, message} from 'antd'
import LinkButton from '../../components/link-button'
import {reqProducts, reqSearchProducts,reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'
/**
 * product 的默认页面子路由
 */
const Option = Select.Option

export default class ProductHome extends Component{


    state = {
        total: 0, // 商品的总数量
        products: [], //商品的数组
        loading: false, //加载...
        searchName:'', //搜索的关键字
        searchType:'productName', //根据哪个字段进行搜索
    }

    //初始化table 的列的数组
    initColumns = () => {
        this.columns = [
            {
              title: '商品名称',
              dataIndex: 'productName',
            },
            {
              title: '商品描述',
              dataIndex: 'description',
            },
            {
              title: '价格',
              dataIndex: 'price',
              render: (price) => '¥' + price //当前指定了对应的属性, 传入的是对应的属性值
            },
            {
                width: 100,
                title: '状态',
                //dataIndex: 'productStatus',
                render: (product) => {
                    const {productStatus,id} = product
                    return (
                        <span>
                            <Button 
                                type='primary' 
                                onClick={() => this.updateStatus(id,productStatus ===1 ? 0 : 1)}
                            >
                                    {productStatus===1 ? '下架' : '上架'}
                            </Button>
                            <span>{productStatus===1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                render: (product) => {
                    return (
                        <span>
                            {/**将state传递给目标组件 */}
                            <LinkButton onClick={() => this.props.history.push('/product/detail', {product})}>详情</LinkButton>
                            <LinkButton>修改</LinkButton>
                        </span>
                    )
                }
            },
          ];
    }
    
    /**
     * 获取指定页码的列表数据显示
     */
    getProducts = async (pageNum) => {
        this.pageNum = pageNum //保存pageNum,让其他方法可以看见
        this.setState({loading: true})
        //  关键字有值
        const {searchName, searchType} = this.state
        let result
        if(searchName){
            result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
        }else{
            result = await reqProducts(pageNum, PAGE_SIZE)
        }

        if(result.status === '0'){
            this.setState({loading:false})
            //取出分页数据,更新状态,显示分页列表
            const {total,list} = result.data
            this.setState({
                total,
                products: list
            })
        }else{
            this.setState({loading:false})
            message.error(result.msg)
        }
    }

    /**
     * 更新指定商品的状态
     */
    updateStatus = async(id,productStatus) => {
        const result = await reqUpdateStatus(id,productStatus)
        if(result.status==='0'){
            message.success(result.msg)
            this.getProducts(this.pageNum)
        }else{
            message.error(result.msg)
        }
    }

    componentWillMount (){
        this.initColumns()
    }

    componentDidMount(){
        this.getProducts(1)
    }

    render(){

        // 取出状态数据
        const {products, total, loading, searchType, searchName} = this.state
          

        const title = (
            <span>
                <Select 
                    value={searchType} 
                    style={{width: 150}} 
                    onChange={value => this.setState({searchType:value})}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='description'>按描述搜索</Option>
                </Select>
                <Input 
                    placeholder='关键字' 
                    style={{width: 150, margin:'0 15px'}} 
                    value={searchName} 
                    onChange={event => this.setState({searchName:event.target.value})}
                />
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )

        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
                <Icon type='plus' />
                    添加商品
            </Button>
        )

        return(
            <Card title={title} extra={extra}>
                <Table 
                    bordered
                    rowKey="id"
                    dataSource={products} 
                    columns={this.columns} 
                    pagination={{
                        total, 
                        defaultPageSize: PAGE_SIZE, 
                        showQuickJumper: true,
                        onChange: this.getProducts
                    }}
                    loading={loading}
                />
            </Card>
        )
    }
}