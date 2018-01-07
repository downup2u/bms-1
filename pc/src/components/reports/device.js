/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import map from 'lodash.map';

import "../../css/message.css";
import AntdTable from "../controls/antdtable.js";

import {download_excel} from '../../actions';
import moment from 'moment';

import TreeSearchreport from '../search/searchreport_device';
import {
  callthen,uireport_searchdevice_request,uireport_searchdevice_result
} from '../../sagas/pagination';
import get from 'lodash.get';

let resizetimecontent = null;

class TablePosition extends React.Component {

    constructor(props) {
        super(props);
        let query = {};
        query['UpdateTime'] = {
          $gte: moment(moment().format('YYYY-MM-DD 00:00:00')),
          $lte: moment(moment().format('YYYY-MM-DD 23:59:59')),
        };
        let DeviceId =  this.props.match.params.deviceid;
        if(DeviceId !== '0'){
          query.DeviceId = DeviceId;
        }

        this.state = {query, innerHeight: window.innerHeight};
    }

    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    onWindowResize=()=> {
        window.clearTimeout(resizetimecontent);
        resizetimecontent = window.setTimeout(()=>{
            this.setState({
                innerHeight: window.innerHeight,
            });
        },10)
    }

    onClickExport(query){
      const payload = {
          type:'report_device',
          query
      };
      //console.log(`导出excel:${JSON.stringify(payload)}`);
      this.props.dispatch(download_excel(payload));
    }

    onClickQuery(query){
      //console.log(query);

      this.setState({query});
      window.setTimeout(()=>{
        //console.log(this.refs);
        this.refs.antdtabledevice.getWrappedInstance().onRefresh();
      },0);
    }

    onItemConvert(item){
      let itemnew = {...item};
      //DeviceId Latitude Longitude GPSTime
      itemnew['key'] = get(item,'_id','');
      itemnew['设备编号'] = get(item,'DeviceId','');
      itemnew['更新时间'] = get(item,'UpdateTime','');
      itemnew['设备类型'] = get(item,'DeviceType','');
      itemnew['序列号'] = get(item,'SN64','');
      return itemnew;
    }
    render(){
        let column_data = {
          "设备编号" : "",
          "更新时间" : "",
          "设备类型" : "",
          "序列号" : "",
        };
        let columns = map(column_data, (data, index)=>{
          let column_item = {
              title: index,
              dataIndex: index,
              key: index,
              render: (text, row, index) => {
                  return <span>{text}</span>;
              },
              sorter:(a,b)=>{
                return a[data] > b[data] ? 1:-1;
              }
          };
          return column_item;
        });


        return (
            <div className="warningPage" style={{height : this.state.innerHeight+"px"}}>

                <div className="appbar">
                    <i className="fa fa-angle-left back" aria-hidden="true" onClick={()=>{this.props.history.replace("/")}}></i>
                    <div className="title">设备报表</div>
                </div>
                <div className="TreeSearchBattery">
                    <TreeSearchreport
                      onClickQuery={this.onClickQuery.bind(this)}
                      onClickExport={this.onClickExport.bind(this)}
                      query={this.state.query}
                    />
                </div>
                <div className="tablelist">
                    <AntdTable
                      ref='antdtabledevice'
                      onItemConvert={this.onItemConvert.bind(this)}
                      columns={columns}
                      pagenumber={30}
                      query={this.state.query}
                      sort={{'LastRealtimeAlarm.DataTime': -1}}
                      queryfun={(payload)=>{
                        return callthen(uireport_searchdevice_request,uireport_searchdevice_result,payload);
                      }}
                    />
                </div>
            </div>

        );
    }
}


export default connect()(TablePosition);
