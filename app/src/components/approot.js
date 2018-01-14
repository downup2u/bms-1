/**
 * Created by wangxiaoqing on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import {map_setmapinited, carmapshow_destorymap, ui_setmapstyle} from '../actions';
import { Route,Redirect,Switch} from 'react-router-dom';


import Index from './index/';
import Login from './login/login';
import Changepwd from './login/changepwd';
import Overview from './overview/overview';
import Carlist from './mycars/carlist';
import Collection from './collection/collection';
import Playback from './playback';
import Warning from './warning/';
import Warningdevice from './warningdevice/data.js';
import Warningdevicelist from './warningdevice/data.js';
import Mydevice from './mydevice';
import Myproject from './mydevice/project';
import Selcart from './selcart';

import Systems from './system';
import Deviceinfo from './mydevice/deviceinfo';
import Workorder from './workorder';
import Workorderinfo from './workorder/info';
import Usercenter from './user';
import Setting from './index/setting';
import Settinguser from './index/settinguser';
import Settingmessage from './index/settingmessage';
import MapPage from './map';
import Alaraminfo from './warningdevice/alarminfo';
import {requireAuthentication} from './requireauthentication';
import "../css/common.css";
import WeuiTool from './tools/weuitool';

class AppMap extends React.Component {
    componentWillMount() {
        this.props.dispatch(ui_setmapstyle({height : (window.innerHeight-98-66) + "px", top: "98px"}))
    }
    render (){
        return (
            <div className="commonmap" style={this.props.mapstyle}>
                <MapPage height={this.props.mapstyle.height}/>
            </div>
        )
    }
}
const mapstyledata = ({app: {mapstyle}}) => {
    return {mapstyle};
}
AppMap = connect(mapstyledata)(AppMap);

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

                <Switch>
                    <Route exact path="/" component={()=>(<Redirect to="/index"/>)} />
                    <Route path="/index" component={requireAuthentication(Index)} />
                    <Route path="/login" component={Login} />
                    <Route path="/changepwd" component={Changepwd} />
                    <Route path="/overview" component={requireAuthentication(Overview)} />
                    <Route path="/carlist" component={requireAuthentication(Carlist)} />
                    <Route path="/collection" component={requireAuthentication(Collection)} />
                    <Route path="/historyplay/:deviceid" component={requireAuthentication(Playback)} />
                    <Route path="/playback/:deviceid" component={requireAuthentication(Playback)} />
                    <Route path="/warningdevice/:deviceid" component={requireAuthentication(Warningdevice)} />
                    <Route path="/warningdevicelist" component={requireAuthentication(Warningdevicelist)} />
                    <Route path="/warning" component={requireAuthentication(Warning)} />
                    <Route path="/system" component={Systems} />
                    <Route path="/mydevice" component={requireAuthentication(Mydevice)} />
                    <Route path="/project/:groupid" component={requireAuthentication(Myproject)} />
                    <Route path="/deviceinfo/:deviceid" component={requireAuthentication(Deviceinfo)} />
                    <Route path="/usercenter" component={requireAuthentication(Usercenter)} />
                    <Route path="/setting" component={requireAuthentication(Setting)} />
                    <Route path="/settinguser" component={requireAuthentication(Settinguser)} />
                    <Route path="/settingmessage" component={requireAuthentication(Settingmessage)} />
                    <Route path="/alarminfo/:alarmid" component={requireAuthentication(Alaraminfo)} />
                    <Route path="/selcart/:prevuri/:deviceid" component={requireAuthentication(Selcart)} />
                </Switch>
                <WeuiTool />
                <AppMap />
            </div>
        );
    }
}
export default connect()(AppRoot);
