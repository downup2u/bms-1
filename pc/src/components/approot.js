/**
 * Created by wangxiaoqing on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import {map_setmapinited} from '../actions';
import { Route,Redirect,Switch} from 'react-router-dom';

import Index from './home';

import Message from './message/message.js';

// import Device from './device/device.js';
import Deviceinfo from './device/deviceinfo.js';


import Historyplay from './historytrackplayback';


import Login from './login/login.js';
import WeuiTool from './tools/weuitool';

import Alaraminfo from './alarm/alarminfo';

import ReportAlarm from './reports/alarm';
import ReportPosition from './reports/position';
import ReportAlarmDetail from './reports/alarmdetail';
import ReportDevice from './reports/historydevice';
import Setting from './settings';

import {requireAuthentication} from './requireauthentication';

import "../css/common.css";

class AppRoot extends React.Component {
    componentWillMount() {
        const script = document.createElement("script");
        script.src = "http://webapi.amap.com/maps?v=1.4.1&key=788e08def03f95c670944fe2c78fa76f&callback=init&&plugin=AMap.Geocoder,AMap.Scale,AMap.OverView,AMap.ToolBar,AMap.Geocoder,AMap.Driving,AMap.MarkerClusterer";
        script.async = true;
        window.init = ()=>{
              const scriptui = document.createElement("script");
              scriptui.src = "http://webapi.amap.com/ui/1.0/main.js?v=1.0.10";
              scriptui.async = true;
              document.body.appendChild(scriptui);
              scriptui.onload = ()=>{
                 window.initamaploaded = true;
                this.props.dispatch(map_setmapinited(true));
              }
        }
        document.body.appendChild(script);
    }
    componentWillUnmount() {
        this.props.dispatch(map_setmapinited(false));
        window.initamaploaded = false;
    }
    render() {

        return (
            <div className="AppContainer">
                <WeuiTool />
                <Switch>
                    <Route exact path="/" component={()=>(<Redirect to="/index"/>)} />
                    <Route path="/reports/alarm/:deviceid" component={requireAuthentication(ReportAlarm)} />
                    <Route path="/reports/alarmdetail/:deviceid" component={requireAuthentication(ReportAlarmDetail)} />
                    <Route path="/reports/position/:deviceid" component={requireAuthentication(ReportPosition)} />
                    <Route path="/reports/historydevice/:deviceid" component={requireAuthentication(ReportDevice)} />
                    <Route path="/index" component={requireAuthentication(()=>(<div></div>))} />
                    <Route path="/login" component={Login} />
                    <Route path="/message/:warninglevel/:deviceid" component={requireAuthentication(Message)} />
                    <Route path="/deviceinfo/:deviceid" component={requireAuthentication(Deviceinfo)} />
                    <Route path="/alarminfo/:alarmid" component={Alaraminfo} />
                    <Route path="/historyplay/:deviceid" component={requireAuthentication(Historyplay)} />
                    <Route path="/setting" component={requireAuthentication(Setting)} />

                    {/* // <Route path="/device" component={requireAuthentication(Device)} />
                    // <Route path="/chartlist/:id" component={requireAuthentication(Chartlist)} />
                    // <Route path="/devicedata/:id" component={requireAuthentication(Devicedata)} />
                    // <Route path="/chargingpileinfo/:id" component={requireAuthentication(Chargingpileinfo)} />
                    // <Route path="/workorder" component={requireAuthentication(Workorder)} />
                    // <Route path="/datatable" component={requireAuthentication(Datatable)} />
                    // <Route path="/workorderinfo/:workid" component={Workorderinfo} /> */}
                </Switch>
                <div>
                    <Index history={this.props.history}/>
                </div>
            </div>
        );
    }
}
export default connect()(AppRoot);
