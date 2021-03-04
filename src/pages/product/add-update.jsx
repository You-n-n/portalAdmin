import React, { Component } from 'react'
import { Card, Form, message, Input, Cascader, Icon, Button } from 'antd'
import LinkButton from '../../components/link-button'
import { reqUploadAndUpdateProduct, reqCategorys } from '../../api'
import PicturesWall from './pictures-wall '
import RichTextEditor from './rich-text-editor'
import memoryUtils from '../../utils/memoryUtils'

const { Item } = Form
const { TextArea } = Input

/**
 * product 的添加和更新的子路由
 */

const fileList = [
    // {
    //   uid: '-1',
    //   name: 'image.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
    // {
    //   uid: '-2',
    //   name: 'image.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
];

class ProductAddUpdate extends Component {

    state = {
        options: [],
        previewVisible: false,
        previewImage: '',
        fileList
    }

    constructor(props) {
        super(props)

        // 创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    initOptions = async (categorys) => {
        // 根据categorys 生成Options 数据
        const options = categorys.map(c => ({
            value: c.id,
            label: c.categoryName,
            isLeaf: false,
        }))
        // 如果是一个二级分类商品的更新
        const { isUpdate, product } = this
        const { pCategoryId } = product
        if (isUpdate && pCategoryId !== '0') {
            // 获取对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId)
            // 生成二级下拉列表的options
            const childOptions = subCategorys.map(c => ({
                value: c.id,
                label: c.categoryName,
                isLeaf: true
            }))

            // 找到当前商品对应的一级option对象
            var i = parseInt(pCategoryId)
            const targetOption = options.find(option => option.value === i)

            // 关联对应的一级option上
            targetOption.children = childOptions
        }
        //更新options状态
        this.setState({
            options
        })
    }

    /**
     * 获取一级/二级分类列表
     */
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        if (result.status === '0') {
            const categorys = result.data
            //如果是一级分类
            if (parentId === '0') {
                this.initOptions(categorys)
            } else {// 二级列表
                return categorys //返回二级列表
            }

        }
    }



    /**用于加载下级的函数 */
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true;

        //根据选中的分类,请求过去下级分类
        const subCategorys = await this.getCategorys(targetOption.value)
        // 隐藏loading
        targetOption.loading = false;

        if (subCategorys && subCategorys.length > 0) {
            //生成一个二级列表的options
            const childOptions = subCategorys.map(c => ({
                value: c.id,
                label: c.categoryName,
                isLeaf: true,
            }))//有二级分裂
            // 关联到当前options
            targetOption.children = childOptions
        } else {
            targetOption.isLeaf = true//没有二级分类
        }

        this.setState({
            options: [...this.state.options],
        });
    };

    /**上传商品 */
    upload = () => {
        this.props.form.validateFields(async (error, values) => {
            if (!error) {
                // 1. 收集数据, 并封装成product对象
                const { productName, description, price, categoryIds } = values
                const { username } = memoryUtils.user;
                let pCategoryId, categoryId
                if (categoryIds.length === 1) {
                    var l = categoryIds[0]
                    pCategoryId = l.toString()
                } else {
                    var i = categoryIds[0]
                    var j = categoryIds[1]
                    pCategoryId = i.toString()
                    categoryId = j.toString()
                }

                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()

                const product = { productName, description, price, imgs, detail, pCategoryId, categoryId }

                // 如果是更新, 需要添加id
                if (this.isUpdate) {
                    product.id = this.product.id
                }

                // 2. 调用接口请求函数去添加/更新
                const result = await reqUploadAndUpdateProduct(product, username)

                // 3. 根据结果提示
                if (result.status === '0') {
                    message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`)
                    this.props.history.goBack()
                } else {
                    message.error(result.msg)
                }
            }
        })

    }



    //验证价格的函数
    validatePrice = (rule, value, callback) => {
        if (value * 1 > 0) {
            callback() //验证通过
        }
        else {
            callback('(1~99999)') //验证不通过
        }

    }

    componentDidMount() {
        this.getCategorys('0')
    }

    UNSAFE_componentWillMount() {
        const product = this.props.location.state
        //保存一个是否是更新标识   两个叹号强制转换布尔值 
        this.isUpdate = !!product
        this.product = product || {}
    }
    render() {

        const { isUpdate, product } = this
        const { pCategoryId, categoryId, imgs, detail } = product
        //用来接收级联分类Id的数组
        const categoryIds = []
        if (isUpdate) {
            if (pCategoryId === '0') {
                //一级分类的商品
                categoryIds.push(categoryId)
            } else {
                //二级分类的商品
                //将string类型转为 int
                var i = parseInt(pCategoryId)
                var j = parseInt(categoryId)
                categoryIds.push(i)
                categoryIds.push(j)
            }

        }

        //指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 10 },
        }

        const title = (
            <span>
                <LinkButton>
                    <Icon type='arrow-left' style={{ fontSize: 20 }} onClick={() => this.props.history.goBack()} />
                </LinkButton>
                <span>
                    {isUpdate ? '修改商品' : '添加商品'}
                </span>
            </span>
        )

        const { getFieldDecorator } = this.props.form

        return (
            <Card title={title} >
                <Form {...formItemLayout}>
                    <Item label="商品名称">
                        {
                            getFieldDecorator('productName', {
                                initialValue: product.productName,
                                rules: [
                                    { required: true, message: '请输入商品名称' }
                                ]
                            })(<Input placeholder='请输入商品名称' />)
                        }
                    </Item>

                    <Item label="商品描述">
                        {
                            getFieldDecorator('description', {
                                initialValue: product.description,
                                rules: [
                                    { required: true, message: '请输入商品描述' }
                                ]
                            })(<TextArea placeholder="请输入商品描述" autoSize={{ minRows: 2, maxRows: 5 }} />)
                        }
                    </Item>

                    <Item label="商品价格">
                        {
                            getFieldDecorator('price', {
                                initialValue: product.price,
                                rules: [
                                    { required: true, message: '请输入商品价格' },
                                    { validator: this.validatePrice }
                                ]
                            })(<Input type='number' placeholder='请输入商品价格' addonAfter="元" />)
                        }
                    </Item>

                    <Item label="商品分类">
                        {
                            getFieldDecorator('categoryIds', {
                                initialValue: categoryIds,
                                rules: [
                                    { required: true, message: '请选择商品分类' }
                                ]
                            })(<Cascader
                                options={this.state.options} /**需要显示的列表数组 */
                                loadData={this.loadData} /**记载的下级列表 */
                                placeholder='请选择商品分类'
                            />)
                        }

                    </Item>

                    <Item label="商品图片">
                        <PicturesWall ref={this.pw} imgs={imgs} />
                    </Item>

                    <Item label="商品详情">
                        <RichTextEditor ref={this.editor} detail={detail} />
                    </Item>

                    <Item>
                        <Button type='primary' style={{ float: 'right' }} onClick={this.upload}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}

export default Form.create()(ProductAddUpdate)