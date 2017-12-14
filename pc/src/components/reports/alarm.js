/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import map from 'lodash.map';

import "../../css/message.css";
import AntdTable from "../controls/antdtable.js";

// import {bridge_alarminfo} from '../../sagas/datapiple/bridgedb';
import moment from 'moment';

import TreeSearchreport from '../search/searchreport_alarm';
import {download_excel} from '../../actions';
import {
  callthen,uireport_searchalarm_request,uireport_searchalarm_result
} from '../../sagas/pagination';



class TableAlarm extends React.Component {

    constructor(props) {
        super(props);
        let query = {};
        query['DataTime'] = {
          $gte: moment(moment().format('YYYY-MM-DD 00:00:00')),
          $lte: moment(moment().format('YYYY-MM-DD 23:59:59')),
        };
        let warninglevel = props.warninglevel || "-1";
        if(warninglevel === '0'){
          query['warninglevel'] = '高';
        }
        else if(warninglevel === '1'){
          query['warninglevel'] = '中';
        }
        else if(warninglevel === '2'){
          query['warninglevel'] = '低';
        }

        this.state = {query};
    }

    onClickExport(query){
      const payload = {
          type:'report_alarm',
          query
      };
      console.log(`导出excel:${JSON.stringify(payload)}`);
      this.props.dispatch(download_excel(payload));
    }

    onClickQuery(query){
      console.log(`查询报警信息:${JSON.stringify(query)}`);
      this.setState({query});
      window.setTimeout(()=>{
        console.log(this.refs);
        this.refs.antdtablealarm.getWrappedInstance().onRefresh();
          // this.refs.alarmdatalist.getWrappedInstance().onRefresh();
      },0);
      // this.props.dispatch(searchbatteryalarm_request({query:queryalarm}));
    }
    onItemConvert(item){
      // return bridge_alarminfo(item);
      return item;
    }
    render(){
        let warninglevel = this.props.match.params.warninglevel;
        if(warninglevel === 'all'){
          warninglevel = "-1";
        }

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
                    <i className="fa fa-angle-left back" aria-hidden="true" onClick={()=>{this.props.history.replace("/")}}></i>
                    <div className="title">报警报表</div>
                </div>
                <div className="TreeSearchBattery">
                    <TreeSearchreport onClickQuery={this.onClickQuery.bind(this)} warninglevel={warninglevel}
                      onClickExport={this.onClickExport.bind(this)}/>
                </div>
                <div className="tablelist">
                    <AntdTable
                      ref='antdtablealarm'
                      onItemConvert={this.onItemConvert.bind(this)}
                      columns={columns}
                      pagenumber={30}
                      query={this.state.query}
                      sort={{DataTime: -1}}
                      queryfun={(payload)=>{
                        return callthen(uireport_searchalarm_request,uireport_searchalarm_result,payload);
                      }}
                    />
                </div>
            </div>

        );
    }
}

export default connect()(TableAlarm);
