/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import map from 'lodash.map';
import get from 'lodash.get';

import AntdTable from "../controls/antdtable.js";

import {bridge_alarminfo} from '../../sagas/datapiple/bridgedb';
import moment from 'moment';


import TreeSearchreport from '../search/search_message';

import {
  callthen,ui_searchalarm_request,ui_searchalarm_result
} from '../../sagas/pagination';


import "../../css/message.css";


let g_querysaved;
class MessageAllDevice extends React.Component {

    constructor(props) {
        super(props);
        let warninglevel = props.match.params.warninglevel || "-1";
        let queryalarm = {};
        queryalarm['DataTime'] = {
          $gte: moment(moment().format('YYYY-MM-DD 00:00:00')),
          $lte: moment(moment().format('YYYY-MM-DD 23:59:59')),
        };
        if(warninglevel === '0'){
          queryalarm['warninglevel'] = '高';
        }
        else if(warninglevel === '1'){
          queryalarm['warninglevel'] = '中';
        }
        else if(warninglevel === '2'){
          queryalarm['warninglevel'] = '低';
        }
        let DeviceId =  this.props.match.params.deviceid;
        if(DeviceId !== '0' && !!DeviceId){
          queryalarm['DeviceId'] = DeviceId;
        }

        this.state = {
          query: g_querysaved || queryalarm
        }
    }
    componentDidMount () {
      g_querysaved = null;
    }
    onClickQuery(query){
      console.log(query);

      this.setState({query});
      window.setTimeout(()=>{
        console.log(this.refs);
        this.refs.antdtablealarm.getWrappedInstance().onRefresh();
      },0);
    }
    
    onItemConvert(item){
      return bridge_alarminfo(item);
    }
    render(){
        let warninglevel = this.props.match.params.warninglevel;
        if(warninglevel === 'all'){
          warninglevel = "-1";
        }
        // else{
        //   // warninglevel = parseInt(warninglevel);
        // }
        let column_data = {
          "车辆ID" : "",
          "报警时间" : "",
          "报警等级" : "",
          "报警信息" : "绝缘故障",
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


        let viewrow = (row)=>{
            console.log(row);
            g_querysaved = this.state.query;
            this.props.history.push(`/alarminfo/${row.key}`);
        }

        let columns_action ={
            title: "操作",
            dataIndex: '',
            key: 'x',
            render: (text, row, index) => {
                return (<a onClick={()=>{viewrow(row)}}>查看</a>);
            }
        }
        columns.push(columns_action);
        return (
            <div className="warningPage" style={{height : window.innerHeight+"px"}}>

                <div className="appbar">
                    <i className="fa fa-angle-left back" aria-hidden="true" onClick={()=>{this.props.history.push("./")}}></i>
                    <div className="title">新消息</div>
                </div>
                <div className="TreeSearchBattery">
                    <TreeSearchreport onClickQuery={this.onClickQuery.bind(this)} query={this.state.query}/>
                </div>
                <div className="tablelist">
                    <AntdTable
                      listtypeiddata = 'message'
                      usecache = {!!g_querysaved}
                      ref='antdtablealarm'
                      onItemConvert={this.onItemConvert.bind(this)}
                      columns={columns}
                      pagenumber={30}
                      query={this.state.query}
                      sort={{DataTime: -1}}
                      queryfun={(payload)=>{
                        return callthen(ui_searchalarm_request,ui_searchalarm_result,payload);
                      }}
                    />
                </div>
            </div>

        );
    }
}


export default connect()(MessageAllDevice);
