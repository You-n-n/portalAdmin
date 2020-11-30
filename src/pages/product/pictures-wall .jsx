import React, {Component} from 'react'
import { Upload, Icon, Modal, message } from 'antd';
import {reqUploadImage} from '../../api'

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
  handleChange = async ({file,fileList }) => {

    //一旦上传成功,就将上传的file 的信息修正
    if(file.status === 'done'){
      const result = file.response //{status: 0 ; data: {name : '' , url : ''}}
      if(result.status === '0'){
        message.success('上传图片成功')
        const {name, url} = result.data
        file = fileList[fileList.length-1]
        file.name = name
        file.url = url
      }else{
        message.error('上传图片失败')
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
          action="/manage/product/uploadImages  " //上传图片的地址
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
