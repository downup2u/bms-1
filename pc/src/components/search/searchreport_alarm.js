/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';

import Seltime from './seltimerange.js';
import { Select,Button } from 'antd';
import SelectDevice from '../historytrackplayback/selectdevice.js';
import get from 'lodash.get';
import map from 'lodash.map';

import moment from 'moment';
moment.locale('zh-cn');


const Option = Select.Option;

class TreeSearchBattery extends React.Component {
    constructor(props) {
        super(props);

        let warninglevel = "-1";
        if(!!props.query.warninglevel){
          if(props.query.warninglevel === '高'){
            warninglevel = '0';
          }
          else if(props.query.warninglevel === '中'){
            warninglevel = '1';
          }
          else if(props.query.warninglevel === '低'){
            warninglevel = '2';
          }
        }
        let startDate = moment(moment().format('YYYY-MM-DD 00:00:00'));
        let endDate = moment(moment().format('YYYY-MM-DD 23:59:59'));
        if(!!props.query.DataTime){
          startDate = moment(props.query.DataTime['$gte']);
          endDate = moment(props.query.DataTime['$lte']);
        }
        let DeviceId = get(props.query,'DeviceId','');
        this.state = {
            alarmlevel: warninglevel,
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

    onChange_alarmlevel(alarmlevel){
      this.setState({alarmlevel});
    }

    onClickExport=()=>{
      if(!!this.props.onClickExport){
        this.props.onClickExport(this.getQueryObj());
      }
    }
    getQueryObj = ()=>{
      let query = {};
      query['DataTime'] = {
        $gte: this.state.startDate.format('YYYY-MM-DD HH:mm:ss'),
        $lte: this.state.endDate.format('YYYY-MM-DD HH:mm:ss'),
      };
      if(this.state.alarmlevel === '0'){
        query['warninglevel'] = '高';
      }
      else if(this.state.alarmlevel === '1'){
        query['warninglevel'] = '中';
      }
      else if(this.state.alarmlevel === '2'){
        query['warninglevel'] = '低';
      }
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

                    <Select className="Selectalarmlevel" defaultValue={this.state.alarmlevel} onChange={this.onChange_alarmlevel.bind(this)}>
                        <Option value={"-1"}>选择报警等级</Option>
                        <Option value={"0"} >高</Option>
                        <Option value={"1"} >中</Option>
                        <Option value={"2"} >低</Option>
                    </Select>
                    <div className="selcar">
                      <span className="t">车辆ID：</span>
                      <SelectDevice
                        placeholder={"请输入设备ID"}
                        initdeviceid={this.state.DeviceId|| this.props.DeviceId}
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
