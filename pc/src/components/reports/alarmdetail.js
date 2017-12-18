/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';

import "../../css/message.css";
import AntdTable from "../controls/antdtable.js";

import {download_excel} from '../../actions';

import TreeSearchreport from '../search/searchreport_alarmdetail';

import {
  callthen,uireport_searchalarmdetail_request,uireport_searchalarmdetail_result
} from '../../sagas/pagination';
import map from 'lodash.map';
import moment from 'moment';

let resizetimecontent = null;
let g_querysaved;

class TableAlarmDetail extends React.Component {

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
          innerHeight : window.innerHeight
        };
    }

    onClickExport(query){
       const payload = {
            type:'report_alarmdetail',
            query
       };
      console.log(`导出excel:${JSON.stringify(payload)}`);
      this.props.dispatch(download_excel(payload));
    }
    // ReviceId,DataTime,SaveTime,BAT_U_Out_HVS,BAT_U_TOT_HVS,BAT_I_HVS,BAT_SOC_HVS,BAT_SOH_HVS,BAT_Ucell_Max,BAT_Ucell_Min,BAT_Ucell_Max_CSC,BAT_Ucell_Max_CELL,BAT_Ucell_Min_CSC,BAT_Ucell_Min_CELL,BAT_T_Max,BAT_T_Min,BAT_T_Avg,BAT_T_Max_CSC,BAT_T_Min_CSC,BAT_User_SOC_HVS,BAT_Ucell_Avg,ALARM,ALIV_ST_SW_HVS,ST_AC_SW_HVS,ST_Aux_SW_HVS,ST_Main_Neg_SW_HVS,ST_Pre_SW_HVS,ST_Main_Pos_SW_HVS,ST_Chg_SW_HVS,ST_Fan_SW_HVS,ST_Heater_SW_HVS,BAT_U_HVS,BAT_Allow_Discharge_I,BAT_Allow_Charge_I,BAT_ISO_R_Pos,BAT_ISO_R_Neg,KeyOnVoltage,PowerVoltage,ChargeACVoltage,ChargeDCVoltage,CC2Voltage,ChargedCapacity,TotalWorkCycle,CSC_Power_Current,BAT_MAX_SOC_HVS,BAT_MIN_SOC_HVS,BAT_WEI_SOC_HVS,BAT_Chg_AmperReq,BPM_24V_Uout,ST_NegHeater_SW_HVS,ST_WirelessChg_SW,ST_SpearChg_SW_2,ST_PowerGridChg_SW,CC2Voltage_2,DIAG_H,DIAG_L
    onClickQuery(query){
      console.log(query);
      this.setState({query});
      window.setTimeout(()=>{
        console.log(this.refs);
        this.refs.antdtablealarm.getWrappedInstance().onRefresh();
      },0);
    }
    onItemConvert(item){
      console.log(`item--->${JSON.stringify(item)}`)
      // return bridge_alarminfo(item);
      return item;
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

        return (
            <div className="warningPage" style={{height : this.state.innerHeight+"px"}}>

                <div className="appbar">
                    <i className="fa fa-angle-left back" aria-hidden="true" onClick={()=>{this.props.history.replace("/")}}></i>
                    <div className="title">报警明细报表</div>
                </div>
                <div className="TreeSearchBattery">
                    <TreeSearchreport
                      onClickQuery={this.onClickQuery.bind(this)}
                      mapdict={this.props.mapdict}
                      query={this.state.query}
                      onClickExport={this.onClickExport.bind(this)}
                    />
                </div>
                <div className="tablelist">
                    <AntdTable
                      listtypeiddata = 'alarmdetail'
                      usecache = {!!g_querysaved}
                      ref='antdtablealarm'
                      onItemConvert={this.onItemConvert.bind(this)}
                      columns={columns}
                      pagenumber={30}
                      query={this.state.query}
                      sort={{DataTime: -1}}
                      queryfun={(payload)=>{
                        return callthen(uireport_searchalarmdetail_request,uireport_searchalarmdetail_result,payload);
                      }}
                    />
                </div>
            </div>

        );
    }
}

const mapStateToProps = ({app:{mapdict}}) => {
    return {mapdict};
}
export default connect(mapStateToProps)(TableAlarmDetail);
