/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import map from 'lodash.map';
import Devicestar from "../../img/16.png";
import Moresetting from "../../img/17.png";
import Footer from "../index/footer.js";

import {ui_mycar_showtype,ui_viewdevicedetail} from '../../actions';
import Searchimg from "../../img/22.png";
import SelectDevice from '../mydevice/selectdevice.js';

const innerHeight = window.innerHeight;

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchonfocus : false,
            deviceid:''
        };
    }
    onfocusinput=()=>{
        this.setState({searchonfocus : true});
    }
    onblurinput=()=>{
        this.setState({searchonfocus : false})
    }
    onSelDeviceid(deviceid){
        this.setState({
          deviceid
        });
    }
    rowClick = (id)=>{
      this.props.dispatch(ui_viewdevicedetail({DeviceId:id}));
        // this.props.history.push(`/deviceinfo/${id}`);
    }
    render() {
        let deviceidlist = [];
        const height =  innerHeight - 70 - 60 - 66.08;
        const mydevicecontentstyle = {pointerEvents: "none",background : "#FFF", flexGrow : "1"};
        let groupid = this.props.match.params.groupid;
        const {groups,g_devicesdb} = this.props;
        map(groups[groupid].deviceids,(deviceinfo)=>{
          deviceidlist.push(deviceinfo.DeviceId);
        });
        // let count_connected = 0;
        // let count_running = 0;
        // let count_error = 0;
        // map(g_devicesdb,(item)=>{
        //   if(item.groupid === groupid){
        //     deviceidlist.push(item.DeviceId);
        //     if(item.isconnected){
        //       count_connected++;
        //     }
        //     if(item.isrunning){
        //       count_running++;
        //     }
        //     if(item.iserror){
        //       count_error++;
        //     }
        //   }
        // });
        const columns = [{
            title: '车牌',
            dataIndex: 'DeviceId',
            key: 'DeviceId',
            render: text => <p>{text}</p>
        }]
        let mydevices = [];
        if(!!g_devicesdb[this.state.deviceid]){
            let item = {...g_devicesdb[this.state.deviceid],key:this.state.deviceid};
            mydevices.push(item);
        }
        console.log(groups[groupid]);
        return (
            <div
                className="mydevicePage AppPage customtable"
                style={{
                    background: "none",
                    minHeight : `${innerHeight}px`,
                    pointerEvents: "none",
                }}>
                <div className="navhead">
                    <a onClick={()=>{this.props.history.goBack()}} className="back"></a>
                    <div className="title" style={{paddingRight: "30px"}}>
                        {groups[groupid].name}
                    </div>
                </div>
                <div className="searchcontent headsearch" style={{display: "none"}}>
                    <SelectDevice
                        placeholder={"请输入设备ID"}
                        initdeviceid={this.state.deviceid}
                        onSelDeviceid={this.onSelDeviceid.bind(this)}
                        deviceidlist={deviceidlist}
                    />
                </div>
                <div className="mydevicecontent" style={mydevicecontentstyle}>
                    <div className="mydevicecontentlist">
                        {  !!groups[groupid].deviceids && groups[groupid].deviceids.length >0 &&
                            map(groups[groupid].deviceids,(data)=>{
                                return <div key={data.DeviceId}
                                   onClick={()=>{this.rowClick(data.DeviceId)}} style={{textAlign: "center",lineHeight : "46px", borderBottom:"1px solid #EEE",fontSize: "16px"}}>{data.DeviceId}</div>
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = ({app,device}) => {
  const {ui_mydeivce_showtype} = app;
  const {groups, g_devicesdb} = device;
  return {ui_mydeivce_showtype,groups, g_devicesdb};
}

export default connect(mapStateToProps)(Page);
