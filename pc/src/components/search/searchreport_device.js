/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import Seltime from './seltimerange.js';
import { Button } from 'antd';
import SelectDevice from '../historytrackplayback/selectdevice.js';
import get from 'lodash.get';
import map from 'lodash.map';

import moment from 'moment';
moment.locale('zh-cn');


class TreeSearchBattery extends React.Component {
    constructor(props) {
        super(props);
        let startDate = moment(moment().format('YYYY-MM-DD 00:00:00'));
        let endDate = moment(moment().format('YYYY-MM-DD 23:59:59'));
        if(!!props.query.UpdateTime){
          startDate = moment(props.query.UpdateTime['$gte']);
          endDate = moment(props.query.UpdateTime['$lte']);
        }
        let DeviceId = get(props.query,'DeviceId','');
        this.state = {
            startDate,
            endDate,
            DeviceId
        };
    }

    onSelDeviceid(DeviceId){
        this.setState({
            DeviceId
        });
    }

    onChangeSelDate(startDate,endDate){
      this.setState({
        startDate,
        endDate
      });
    }

    onClickExport=()=>{
      if(!!this.props.onClickExport){
        this.props.onClickExport(this.getQueryObj());
      }
    }
    getQueryObj = ()=>{
      let query = {};
      query['LastRealtimeAlarm.DataTime'] = {
        $gte: this.state.startDate.format('YYYY-MM-DD HH:mm:ss'),
        $lte: this.state.endDate.format('YYYY-MM-DD HH:mm:ss'),
      };
      if(this.state.DeviceId !== ''){
        query['DeviceId'] = this.state.DeviceId;
      }
      return query;
    }


    onClickQuery=()=>{
      if(!!this.props.onClickQuery){
        this.props.onClickQuery(this.getQueryObj());
      }
    }
    render(){
      const {g_devicesdb} = this.props;

      let deviceidlist = [];
      map(g_devicesdb,(item)=>{
          deviceidlist.push(item.DeviceId);
      });
        return (
            <div className="searchreport" style={{textAlign: "center"}}>
                <div className="i">

                    <Seltime  startDate = {this.state.startDate}
                      endDate = {this.state.endDate}
                     onChangeSelDate={this.onChangeSelDate.bind(this)}/>
                     <div className="selcar">
                       <span className="t">车辆ID：</span>
                       <SelectDevice
                         placeholder={"请输入设备ID"}
                         initdeviceid={this.state.DeviceId}
                         onSelDeviceid={this.onSelDeviceid.bind(this)}
                         deviceidlist={deviceidlist}
                       />
                     </div>
                </div>
                <div className="b">
                    <Button type="primary" icon="search" onClick={this.onClickQuery}>查询</Button>
                    <Button icon="download" onClick={this.onClickExport}>导出结果</Button>
                </div>
            </div>

        );
    }
}
const mapStateToProps = ({device:{g_devicesdb}}) => {
  return {g_devicesdb};
}
export default connect(mapStateToProps)(TreeSearchBattery);
