/**
 * Created by jiaowenhui on 2017/7/28.
    车辆详情
 */
import React from 'react';
import {connect} from 'react-redux';
import map from 'lodash.map';
import get from 'lodash.get';
import RaisedButton from 'material-ui/RaisedButton';
import {ui_showhistoryplay,ui_showmenu} from '../actions';
import translate from 'redux-polyglot/translate';

class Page extends React.Component {
    onClickMenu(menuitemstring){
        this.props.dispatch(ui_showmenu(menuitemstring));
    }
    showhistoryplay(){
      this.props.dispatch(ui_showhistoryplay(true));
    }
    render(){
      const datasz = [
        {
          groupname:'基本参数',
          fieldnames:[
            {name:'RealtimeAlarm.SN'},
            {name:'RealtimeAlarm.BAT_U_Out_HVS'},
            {name:'RealtimeAlarm.BAT_U_TOT_HVS'},
            {name:'RealtimeAlarm.BAT_I_HVS'},
            {name:'RealtimeAlarm.BAT_SOC_HVS'},
            {name:'RealtimeAlarm.BAT_SOH_HVS'},
          ]
        },
        {
          groupname:'电压参数',
          fieldnames:[
            {name:'RealtimeAlarm.BAT_Ucell_Max'},
            {name:'RealtimeAlarm.BAT_Ucell_Min'},
            {name:'RealtimeAlarm.BAT_Ucell_Max_CSC'},
            {name:'RealtimeAlarm.BAT_Ucell_Max_CELL'},
            {name:'RealtimeAlarm.BAT_Ucell_Min_CSC'},
            {name:'RealtimeAlarm.BAT_Ucell_Min_CELL'},
          ]
        },
        {
          groupname:'温度参数',
          fieldnames:[
            {name:'RealtimeAlarm.BAT_T_Max'},
            {name:'RealtimeAlarm.BAT_T_Min'},
            {name:'RealtimeAlarm.BAT_T_Avg'},
            {name:'RealtimeAlarm.BAT_T_Max_CSC'},
            {name:'RealtimeAlarm.BAT_T_Min_CSC'},
          ]
        },
        {
          groupname:'继电器状态',
          fieldnames:[
            {name:'RealtimeAlarm.ST_AC_SW_HVS'},
            {name:'RealtimeAlarm.ST_Aux_SW_HVS'},
            {name:'RealtimeAlarm.ST_Main_Neg_SW_HVS'},
            {name:'RealtimeAlarm.ST_Pre_SW_HVS'},
            {name:'RealtimeAlarm.ST_Main_Pos_SW_HVS'},
          ]
        },
        {
          groupname:'位置参数',
          fieldnames:[
            {name:'LastHistoryTrack.Longitude'},
            {name:'LastHistoryTrack.Latitude'},
            {name:'LastHistoryTrack.Speed'},
            {name:'LastHistoryTrack.Course'},
            {name:'LastHistoryTrack.DeviceStatus'},
          ]
        },
        {
          groupname:'地理参数',
          fieldnames:[
            {name:'LastHistoryTrack.Province'},
            {name:'LastHistoryTrack.City'},
            {name:'LastHistoryTrack.County'},
          ]
        },
      ];


      // const data = {
      //       "车辆名称" : "123XG车辆",
      //       "最高单体温度" : "80",
      //       "最低单体温度" : "0",
      //       "最高单体电压" : "100V",
      //       "最低单体电压" : "30V",
      //       "真实SOC" : "SOC",
      //       "箱体电流" : "20A",
      //   }
      const {mapseldeviceid,devices,p} = this.props;
      let deviceitem = devices[mapseldeviceid];

      return (
            <div className="warningPage devicePage">
                <div className="tit">车辆详情</div>
                <div className="devicebtnlist">
                    <RaisedButton label="轨迹监控" primary={true} onTouchTap={this.showhistoryplay.bind(this)} className="showDeviceInfo" />
                    <RaisedButton label="历史警告" primary={true} onTouchTap={this.onClickMenu.bind(this,"warningbox")} className="showDeviceInfo" />
                </div>
                <div className="lists">
                  {
                    map(datasz,(item,gindex)=>{
                      let groupname = item.groupname;
                      return (
                        map(item.fieldnames, (fielditem, key)=>{
                            let name = p.tc(fielditem.name);
                            let value = get(deviceitem,name,'');
                            // console.log(`name:${name},value:${value}`);
                            return (
                                <div className="li" key={`${gindex}_${key}`}>
                                    <div className="name">{name}</div><div className="text">{value}</div>
                                </div>
                            )
                        })
                      )
                  })
                }
                </div>

            </div>
        );
    }
}

const mapStateToProps = ({device:{mapseldeviceid,devices}}) => {
  return {mapseldeviceid,devices};
}
const DeviceComponentWithPProps = translate('showdevice')(Page);
export default connect(mapStateToProps)(DeviceComponentWithPProps);
