
/**
 * Created by jiaowenhui on 2017/7/28.
    车辆详情
 */
import React from 'react';
import {connect} from 'react-redux';
import map from 'lodash.map';
import RaisedButton from 'material-ui/RaisedButton';
import {ui_showhistoryplay,ui_showmenu,searchbatteryalarm_request} from '../actions';
import translate from 'redux-polyglot/translate';
import TableComponents from "./table.js";
import TreeSearchmessage from './search/searchmessage';
import { Button } from 'antd';
import {gmap_chargingpile} from '../test/bmsdata';

class Page extends React.Component {

    render(){

      let id = this.props.match.params.id;
      let chargingpileinfo = [id];
      const data = gmap_chargingpile[id];
      console.log(data);
      const datapower = [
        {
            name:'采集时间',
            value: data['采集时间']
        },
        {
            name:'额定功率（kW）',
            value : data['额定功率（kW）']
        },
        {
            name:'额定电压（V）',
            value : data['额定电压（V）']
        },
        {
            name:'最大输出电流（A）',
            value : data['最大输出电流（A）']
        },
        {
            name:'定位状态',
            value : data['定位状态']
        },
        {
            name:'纬度信息',
            value : data['纬度信息']
        },
        {
            name:'经度信息',
            value : data['经度信息']
        },
        {
            name:'经度',
            value : data['经度']
        },
        {
            name:'纬度',
            value : data['纬度']
        },
        {
            name:'位置描述',
            value : data['位置描述']
        },
        {
            name:'当前状态',
            value : data['当前状态']
        },
        {
            name:'累计充电次数',
            value : data['累计充电次数']
        },
        {
            name:'累计充电量（MWh）',
            value : data['累计充电量（MWh）']
        },
        {
            name:'累计放电量（MWh）',
            value : data['累计放电量（MWh）']
        },
        {
            name:'充电模式',
            value : data['充电模式']
        },
        {
            name:'绝缘阻抗',
            value : data['绝缘阻抗']
        },
        {
            name:'当前电流（A）',
            value : data['当前电流（A）']
        },
        {
            name:'当前功率（kW）',
            value : data['当前功率（kW）']
        },
        {
            name:'开机时长（h）',
            value : data['开机时长（h）']
        }

    ];

    return (

            <div className="warningPage devicePage deviceinfoPage">

                <div className="appbar">
                    <i className="fa fa-angle-left back" aria-hidden="true" onClick={()=>{this.props.history.goBack()}}></i>
                    <div className="title">充电桩详情</div>
                </div>

                <div className="lists deviceinfolist">
                    {
                        map(datapower,(item,i)=>{
                            return (
                                <div className="li" key={i}>
                                    <div>
                                    <div className="name">{item.name}</div><div className="text">{item.value}</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

            </div>
        );
    }
}


const DeviceComponentWithPProps = translate('showdevice')(Page);
export default connect()(DeviceComponentWithPProps);
