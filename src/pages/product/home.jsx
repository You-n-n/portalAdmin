import React, {Component} from 'react'
import {Card, Select, Input, Icon, Button, Table, message, Cascader} from 'antd'
import LinkButton from '../../components/link-button'
import {reqProducts, reqSearchProducts,reqUpdateStatus,reqCategorys,reqGetProductById} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'
import memoryUtils from '../../utils/memoryUtils'
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
        options: [],
        searchCategoryId:''
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
                            <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
                        </span>
                    )
                }
            },
          ];
    }

    /**
     * 获取一级/二级分类列表
     */
    getCategorys = async (parentId) =>{
        const result = await reqCategorys(parentId)
        if(result.status === '0'){
            const categorys = result.data
            //如果是一级分类
            if(parentId === '0') {
                this.initOptions(categorys)
            }else {// 二级列表
                return categorys //返回二级列表
            }
            
        }
    }

    //级联
    initOptions = async (categorys) => {
        // 根据categorys 生成Options 数据
        const options = categorys.map(c => ({
            value: c.id,
            label: c.categoryName,
            isLeaf: false,
        }))
        //更新options状态
        this.setState({
            options
        })
    }

    /**用于加载下级的函数-级联 */
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true;
    
        //根据选中的分类,请求过去下级分类
        const subCategorys = await this.getCategorys(targetOption.value)
        // 隐藏loading
        targetOption.loading = false;

        if(subCategorys && subCategorys.length>0){
            //生成一个二级列表的options
            const childOptions= subCategorys.map(c =>({
                value: c.id,
                label: c.categoryName,
                isLeaf: true,
            }))//有二级分裂
            // 关联到当前options
            targetOption.children = childOptions
        }else {
            targetOption.isLeaf = true//没有二级分类
        }

        this.setState({
            options: [...this.state.options],
        });
    };

    /**
     * 获取指定页码的列表数据显示
     */
    getProducts = async (pageNum) => {
        this.pageNum = pageNum //保存pageNum,让其他方法可以看见
        this.setState({loading: true})
        //  关键字有值
        const {searchName, searchType,searchCategoryId} = this.state
        let result
        if(searchCategoryId.length>0 || searchName){
            if(searchCategoryId.length>0){
                const value = searchCategoryId
                let list = []
                for(var i =1; i<value.length;i++){
                    list.push(value[i])
                }
                const id = list.toString()
                result = await reqGetProductById(pageNum,PAGE_SIZE,id)
            }
            if(searchName){
                result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
            }
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
        const {username} = memoryUtils.user;
        const result = await reqUpdateStatus(id,productStatus,username)
        if(result.status==='0'){
            message.success(result.msg)
            this.getProducts(this.pageNum)
        }else{
            message.error(result.msg)
        }
    }

    UNSAFE_componentWillMount (){
        this.initColumns()
    }

    componentDidMount(){
        this.getCategorys('0');
        this.getProducts(1)
    }

    render(){

        // 取出状态数据
        const {products, total, loading, searchType, searchName, searchCategoryId} = this.state
          

        const title = (
                <span>
                  搜索栏
                </span>
        )

        const extra = (
            <div>
                    <span>
                        <Cascader
                            style={{width: 150, margin:'0 15px'}} 
                            options = {this.state.options} /**需要显示的列表数组 */
                            loadData = {this.loadData} /**记载的下级列表 */
                            placeholder='根据商品分类搜索'
                            value={searchCategoryId}
                            onChange={value => this.setState({searchCategoryId:value})}
                        />
                        <Select 
                            style={{width: 150, margin:'0 15px'}} 
                            value={searchType} 
                            style={{width: 150}} 
                            onChange={value => this.setState({searchType:value})}
                        >
                            <Option value='productName'>按名称搜索 : </Option>
                            <Option value='description'>按描述搜索 : </Option>
                        </Select>
                        <Input 
                            placeholder='搜索内容' 
                            style={{width: 150, margin:'0 15px'}} 
                            value={searchName} 
                            onChange={event => this.setState({searchName:event.target.value})}
                        />
                        <Button type='primary' onClick={() => this.getProducts(1)} style={{margin:'0 50px'}}>搜索</Button>
                    </span>

                    <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
                        <Icon type='plus' />
                        添加商品
                    </Button>
            </div>
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