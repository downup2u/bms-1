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

let g_querysaved;
let resizetimecontent = null;

class TableAlarm extends React.Component {

    constructor(props) {
        super(props);
        let queryalarm = {};
        queryalarm['DataTime'] = {
          $gte: moment(moment().format('YYYY-MM-DD 00:00:00')),
          $lte: moment(moment().format('YYYY-MM-DD 23:59:59')),
        };
        let warninglevel = "-1";
        if(warninglevel === '0'){
          queryalarm['warninglevel'] = '高';
        }
        else if(warninglevel === '1'){
          queryalarm['warninglevel'] = '中';
        }
        else if(warninglevel === '2'){
          queryalarm['warninglevel'] = '低';
        }
        this.state = {
          query: g_querysaved || queryalarm,
          innerHeight: window.innerHeight
        };
    }

    componentDidMount() {
        g_querysaved = null;
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
            <div className="warningPage" style={{height : this.state.innerHeight+"px"}}>

                <div className="appbar">
                    <i className="fa fa-angle-left back" aria-hidden="true" onClick={()=>{this.props.history.replace("/")}}></i>
                    <div className="title">报警信息日报</div>
                </div>
                <div className="TreeSearchBattery">
                    <TreeSearchreport onClickQuery={this.onClickQuery.bind(this)}
                      query={this.state.query}
                      onClickExport={this.onClickExport.bind(this)}/>
                </div>
                <div className="tablelist">
                    <AntdTable
                      listtypeiddata = 'alarm'
                      usecache = {!!g_querysaved}
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
