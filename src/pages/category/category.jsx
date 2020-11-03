import React, {Component} from 'react'
import {Card, Table, Button, Icon, message, Modal} from 'antd'
import LinkButton from '../../components/link-button'
import {reqCategorys, reqUpdateCategorys, reqAddCategorys, reqDelCategorys} from '../../api/'
import AddForm from './add-form'
import memoryUtils from '../../utils/memoryUtils'
import UpdateForm from './update-form'

/**
 * 分类路由
 */

export default class Category extends Component{

    state = {
        loading: false, //是否正在获取数据中
        categorys: [], //一级分类列表
        subCategorys: [], // 二级分类列表
        parentId: '0', // 当前需要显示的分类列表
        parentName: '', // 当前需要显示的分类名称
        showStatus: 0, //标识添加/更新的确认框是否显示, 0: 都不显示, 1: 添加, 2: 更新
    }


    //初始化table所有列的数组
    initColumns = () =>{
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'categoryName', // 显示数据对应的属性名
            },{
                title: '操作',
                width: 300,
                dataIndex: '',
                key: 'x',
                render: (category) => ( // 返回需要显示的界面标签
                    <span>
                        {this.state.parentId==='0' ? <LinkButton onClick={() => {this.showSubCatogorys(category)}}>查看子分类</LinkButton>: null}
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                        <LinkButton onClick={() => this.delCategory(category)}>删除分类</LinkButton>
                        
                    </span>
                )
            },
        ]
    }

    //异步获取一级/二级分类列表显示
    // parentId: 如果没有指定就根据状态中的parentId请求
    getCategorys = async (parentId) =>{
        //发送请求前,显示loading
        this.setState({loading: true})
        parentId = parentId || this.state.parentId
        const result = await reqCategorys(parentId)
        //在请求结束后,loading结束
        this.setState({loading: false})
        if(result.status==='0'){
            //得到的可能是一级也可能是二级
            const categorys = result.data
            if(parentId==='0'){
                // 更新一级分类状态
                this.setState({
                    categorys
                })
            }else{
                // 更新二级分类状态
                this.setState({
                    subCategorys: categorys
                })
            }
        }else {
            console.log('categorys',result.status)
            message.error('获取分类列表失败')
        }
    }

    //显示一级分类列表
    showCategorys= () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: [],
        })
    }

    //显示一级分类对应的二级列表
    showSubCatogorys= (category) => {
        this.setState({
            parentId: category.id,
            parentName: category.categoryName
        }, () => {
            //console.log('parentId',this.state.parentId)
            //获取二级分类
            this.getCategorys()
        })
    }
    
    //点击隐藏对话框
    handleCancel= () => {

        //清除输入数据
        this.form.resetFields()

        this.setState({
            showStatus: 0
        })
    }

    //显示添加的对话框
    showAdd= () => {
        this.setState({
            showStatus: 1
        })
    }

    //显示修改的对话框
    showUpdate= (category) => {
        //保存分类对象
        this.category = category
        //console.log('category', category.categoryName)
        //更新状态
        this.setState({
            showStatus: 2
        })
    }

    //添加分类
    addCategory=  () => {
        this.form.validateFields( async (err, values) => {
            if(!err){
                this.setState({
                    showStatus: 0
                })
        
                //收集数据并提交请求
                const parentId = this.form.getFieldValue('parentId').toString()
                const parentId1 = this.form.getFieldValue('parentId')
                const {categoryName} = values
                const {account_name} = memoryUtils.user;
                // 清除输入数据
                this.form.resetFields()
        
                const result = await reqAddCategorys(categoryName, parentId,account_name)
                //console.log('result',result)
                if(result.status ==='0'){
                    message.success(result.msg)
                    //3. 重新显示当前分类列表
                    if(parentId1===this.state.parentId){
                        this.getCategorys()
                    }else if(parentId==='0'){ // 在二级分类下添加一级分类
                        this.getCategorys('0')
                    }
                }else{
                    message.error(result.msg)
                }
            }
            
        })
        
    }


    //更新分类
    updateCategory=  () => {
        //console.log('updateCategory')
        //进行表单验证,只有通过了才处理
        this.form.validateFields( async (err, values) => {
            if(!err){

                //关闭弹窗
                this.setState({
                    showStatus: 0
                })
    
                debugger
                //准备数据
                const id = this.category.id
                const {categoryName} = values
                const {account_name} = memoryUtils.user;
                //清楚输入数据
                this.form.resetFields()
        
                //2. 发送请求更新分类
                const result = await reqUpdateCategorys(categoryName,id,account_name)
                //console.log('result',result)
                //console.log('object',result.PromiseValue)
                if (result.status ==='0'){
                    message.success(result.msg)
                    //3. 重新显示列表
                    this.getCategorys()
                }else{
                    message.error(result.msg)
                }
            }
        }) 
    }

    //删除分类
    delCategory= async (category) => {
        //debugger
        const id = category.id
        const {account_name} = memoryUtils.user;
        const result = await reqDelCategorys(id,account_name)
        //console.log(result.status)
        if(result.status === '0'){
            message.success(result.msg)
            this.getCategorys()
        }else{
            message.error(result.msg)
        }
    }

    componentWillMount () {
        this.initColumns()
    }

    //发送异步ajax请求
    componentDidMount () {
        this.getCategorys()
    }

    //用于捕捉异常(不过不会用)
    componentDidCatch(error, info){
        // Display fallback UI
        this.setState({ hasError: true });
    }

    render() {

            
        //读取指定的分类
        const category = this.category || {}

        //读取状态数据
        const {categorys, subCategorys, parentId, parentName, loading, showStatus} = this.state 
        //card的左侧标题
        const title = parentId ==='0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <Icon type='arrow-right' style={{marginRight:5}}></Icon>
                <span>{parentName}</span>
            </span>
        )
        //card的右侧标题
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <Icon type='plus' />
                添加
            </Button>
        )
        

        return (
            <Card title={title} extra={extra}>
                <Table 
                    bordered
                    rowKey= 'id'
                    dataSource={parentId==='0' ?categorys : subCategorys}  
                    columns={this.columns}
                    pagination={{defaultPageSize:5, showQuickJumper:true}}
                    loading={loading}
                    />
                    <Modal
                        title="添加分类"
                        visible={showStatus===1}
                        onOk={this.addCategory}
                        onCancel={this.handleCancel}
                        >
                        <AddForm 
                            categorys={categorys} 
                            parentId={parentId} 
                            setForm= {(form) => {this.form = form}}/>
                        </Modal>

                    <Modal
                        title="更新分类"
                        visible={showStatus===2}
                        onOk={this.updateCategory}
                        onCancel={this.handleCancel}
                        >
                        <UpdateForm 
                            categoryName={category.categoryName} 
                            setForm= {(form) => {this.form = form}}/>
                    </Modal>
            </Card>
        )
    }
}