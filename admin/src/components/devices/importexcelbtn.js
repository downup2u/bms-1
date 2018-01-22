import React from 'react';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionBack from 'material-ui/svg-icons/navigation/arrow-back';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import config from '../../env/config.js';
import { Upload, message, Button, Icon } from 'antd';


import { ListButton, DeleteButton } from 'admin-on-rest';
const cardActionStyle = {
    zIndex: 2,
    display: 'inline-block',
    float: 'right',
};

const ImportExcelButton = () => {
  const usertoken = localStorage.getItem('admintoken');
  const onChange =(info)=> {
    console.log(info);
    // console.log("handleChange info:" + JSON.stringify(info));
    if (info.file.status !== 'uploading') {
      // console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      // message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      // message.error(`${info.file.name} file upload failed.`);
    }
  }


  return (
      <Upload
          name='file'
          action={`${config.serverurl}/importexcel`}
          headers={{
             'Authorization':'Bearer '+ usertoken,
          }}
          onChange={onChange}
          showUploadList={false}
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        >
        <FlatButton
         primary
         label="导入Excel"
         icon={<ActionBack />}
         style={{ overflow: 'inherit' }}  >
       </FlatButton>
    </Upload>
  );
};
{/* <FlatButton
  primary
  label="导入Excel"
  icon={<ActionBack />}
  style={{ overflow: 'inherit' }}  >
</FlatButton> */}
export default ImportExcelButton;
