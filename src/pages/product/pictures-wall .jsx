import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal, message } from 'antd';
import { reqDeleteImg } from '../../api'
import { BASE_IMG_URL } from '../../utils/constants';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    console.log(resolve)
  });
}

/**
 * 用于图片上传
 */

export default class PicturesWall extends Component {

  static propTypes = {
    imgs: PropTypes.array
  }

  state = {
    previewVisible: false,  //标识是否显示大图预览 Modal
    previewImage: '', //大图的url
    fileList: [
      // {
      //   uid: '-1',
      //   name: 'image.png',
      //   status: 'done',   //uploading,removed
      //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      // },
    ],
  };

  constructor(props) {
    super(props)
    let fileList = [] //如果传入的有 则生成默认
    const { imgs } = this.props
    if (imgs && imgs.length > 0) {
      fileList = imgs.map((img, index) => ({
        uid: -index,
        name: img,
        status: 'done',
        url: BASE_IMG_URL + img
      }))
    }

    //初始化状态
    this.state = {
      previewVisible: false,  //标识是否显示大图预览 Modal
      previewImage: '', //大图的url
      fileList // 所有已上传的图片
    }
  }

  //获取所有已上传图片文件名
  getImgs = () => {
    return this.state.fileList.map(file => file.name)
  }

  /**
   * 隐藏Modal
   */
  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = async file => {
    //显示指定file的大图
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  /**
   * 
   * 所有图片上传的数组 
   */
  handleChange = async ({ file, fileList }) => {

    //一旦上传成功,就将上传的file 的信息修正
    if (file.status === 'done') {
      const result = file.response //{status: 0 ; data: {name : '' , url : ''}}
      if (result.status === '0') {
        message.success('上传图片成功')
        const { name, url } = result.data
        file = fileList[fileList.length - 1]
        file.name = name
        file.url = url
      } else {
        message.error('上传图片失败')
      }
    } else if (file.status === 'removed') {
      const result = await reqDeleteImg(file.name)
      if (result.status === '0') {
        message.success('删除图片成功')
      } else {
        message.error('删除图片失败')
      }
    }

    this.setState({ fileList });
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/go/manage/product/uploadImages  " //上传图片的地址
          accept='image/*'  //只接受图片格式
          listType="picture-card"
          name='file  ' //请求参数名
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
