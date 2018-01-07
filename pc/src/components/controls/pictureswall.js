import React from 'react';
import { Field } from 'redux-form';
import Upload from 'antd/lib/upload';
import Icon from 'antd/lib/icon';
import message from 'antd/lib/message';
import Modal from 'antd/lib/modal';
import map from 'lodash.map';
import { connect } from 'react-redux';
import './pictureswall.css';
import 'antd/dist/antd.css';
import config from '../../env/config.js';
import PicaDisposePhoto from '../../util/pica_dispose_photo';


class PicturesWall extends React.Component {
  constructor(props) {
      super(props);
      let fileList = [];
      if(!!props.value){
        map(props.value, (v, l)=>{
           fileList.push({
               name : undefined,
               status : "done",
               uid : `rc-upload-${l}`,
               url : v
           });
       });
      }

      this.state = {
        fileList,
        previewVisible: false,
        previewImage: '',
      };
  };
  componentWillUnmount() {

  }

  handleCancel = () =>{
    this.setState({ previewVisible: false });
  } //this.setState({ previewVisible: false })

  handlePreview = (file) => {
    let fileobj = file;
    //console.log('onClick handlePreview file:' + JSON.stringify(file));
    if (fileobj.status === 'done') {
      let url = '';
      if(fileobj.hasOwnProperty('url')){
        url = fileobj.url;
      }
      else{
        url = fileobj.response.files[0].url;
      }
      fileobj = {
        status: 'done',
        url: url
      };
    }

    //console.log('onClick handlePreview fileobj:' + JSON.stringify(fileobj));
    this.setState({
      previewImage: fileobj.url || fileobj.thumbUrl,
      previewVisible: true,
    });
    // this.setState({
    //   previewImage: file.url || file.thumbUrl,
    //   previewVisible: true,
    // });
  }

  handleChange = ({ fileList }) => {
    //console.log('fileList' + JSON.stringify(fileList));
    let filelistnew = [];
    let uploadedfiles =[ ];
    fileList.forEach((fileobj)=>{
      if (fileobj.status === 'done') {
        if(fileobj.hasOwnProperty('url')){//已经处理过了!
          uploadedfiles.push(fileobj.url);
          filelistnew.push(fileobj);
        }
        else{
          uploadedfiles.push(fileobj.response.files[0].url);
          filelistnew.push({
            name:fileobj.name,
            uid:fileobj.uid,
            status: 'done',
            url: fileobj.response.files[0].url
          });
        }

      }
      else {
        filelistnew.push(fileobj);
      }

    });

    this.setState({ fileList:filelistnew });
    // this.props.dispatch(pic_fileuploadsetpreview({ fileList:filelistnew }));

    //console.log('uploadedfiles:' + JSON.stringify(uploadedfiles));
    this.props.onChange(uploadedfiles);
  }//this.setState({ fileList })

  render() {
    //
    //console.log('props' + JSON.stringify(this.props));

    const { width,height } = this.props;
    const {previewVisible, previewImage,fileList} = this.state;

    const uploadButton = (
        <div>
            <Icon type="plus" />
            <div className="ant-upload-text">上传</div>
        </div>
    );

    let beforeUpload =(v)=> {
        let imgInfo = {};
        let restconfig = {
            width:width || -1,
            height:height || -1,
            maxWidthOrHeight:800
        };
        return new Promise((resolve) => {
            const picaphoto = new PicaDisposePhoto(restconfig);
            picaphoto.disposePhotoWithFile(v,imgInfo).then((file)=>{
                file.uid = v.uid;
                resolve(file);
            });
        });
    }


    return (
      <div className="clearfix">
        <Upload
            beforeUpload={beforeUpload}
            action={config.serverurl + "/uploadavatar"}
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            showUploadList={
                {
                    showPreviewIcon: true,
                    showRemoveIcon: this.props.candel
                }
            }
        >
            {!this.props.isdone && uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall;
