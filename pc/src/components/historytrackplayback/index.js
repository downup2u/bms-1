/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Day from 'material-ui/svg-icons/action/date-range';
import Time from 'material-ui/svg-icons/device/access-time';
import IconButton from 'material-ui/IconButton';
import {grey900} from 'material-ui/styles/colors';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import Map from './map';
import "./map.css";
import Seltime from '../search/seltime.js';
import moment from 'moment';
import map from 'lodash.map';
import SelectDevice from './selectdevice.js';
import { Select } from 'antd';
import {
  mapplayback_start,
  mapplayback_end
} from '../../actions';

const Option = Select.Option;
moment.locale('zh-cn');

let resizetimecontent = null;

class Setspeed extends React.Component {
    handleChange=(value)=>{
      console.log(value);
    }
    render() {
      return (
        <div className="Setspeed">
          <span>播放速度: </span>
          <Select labelInValue defaultValue={{ key: '50' }} style={{ width: 40 }} onChange={this.handleChange}>
            <Option value="5">5</Option>
            <Option value="10">10</Option>
            <Option value="15">15</Option>
            <Option value="20">20</Option>
            <Option value="25">25</Option>
            <Option value="30">30</Option>
            <Option value="35">35</Option>
            <Option value="40">40</Option>
            <Option value="45">45</Option>
            <Option value="50">50</Option>
            <Option value="55">55</Option>
            <Option value="60">60</Option>
            <Option value="65">65</Option>
            <Option value="70">70</Option>
            <Option value="75">75</Option>
            <Option value="80">80</Option>
            <Option value="85">85</Option>
            <Option value="90">90</Option>
            <Option value="95">95</Option>
            <Option value="100">100</Option>
          </Select>
        </div>
      )
    }
}

const fGetCurrentWeek=function(m){
        let sWeek=m.format('dddd');
        switch (sWeek){
            case 'Monday': sWeek='星期一';
                break;
            case 'Tuesday': sWeek='星期二';
                break;
            case 'Wednesday': sWeek='星期三';
                break;
            case 'Thursday': sWeek='星期四';
                break;
            case 'Friday': sWeek='星期五';
                break;
            case 'Saturday': sWeek='星期六';
                break;
            case 'Sunday': sWeek='星期日';
                break;
            default:
                break;
        }
        return sWeek;
    }

class Page extends React.Component {

      constructor(props) {
          super(props);
          let deviceid =  this.props.match.params.deviceid;
          if(deviceid === '0'){
            deviceid = '';
          }
          this.state = {
            startDate:moment().subtract(5, 'hours'),
            endDate:moment(),
            deviceid,
            speed: 60,
            innerHeight : window.innerHeight
          }
      }
      onSelDeviceid(deviceid){
          this.setState({
              deviceid
          });
      }
    onChangeSelDate(startDate,endDate){
      this.setState({
        startDate,
        endDate
      });
    }

    handleChange=(value)=>{
      this.setState({speed: parseInt(value.key)});
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

    onClickStart(){
      const {deviceid,startDate,endDate} = this.state;
      
      const query = {
        DeviceId:deviceid
      };
      query.GPSTime = {
        $gte: startDate.format('YYYY-MM-DD HH:mm:ss'),
        $lte: endDate.format('YYYY-MM-DD HH:mm:ss'),
      }
      query.Latitude = {
        $ne:0
      };
      query.Longitude = {
        $ne:0
      };
      this.props.dispatch(mapplayback_start({isloop:false,speed:this.state.speed,query}));

    }
    onClickEnd(){
      this.props.dispatch(mapplayback_end({}));
    }
    render() {
        const {deviceid} = this.state;
        const {g_devicesdb} = this.props;
        let DeviceId;
        let deviceitem = g_devicesdb[deviceid];
        if(!!deviceitem){
          DeviceId = deviceitem.DeviceId;
        }
        let deviceidlist = [];
        map(g_devicesdb,(item)=>{
            deviceidlist.push(item.DeviceId);
        });
        const formstyle={width:"10px",flexGrow:"1"};
        const startdate_moment = this.state.startDate;
        const enddate_moment = this.state.endDate;

        return (
            <div className="historytrackplayback" id="historytrackplayback" style={{height: this.state.innerHeight+"px"}} >
                <div className="appbar" style={{height: "72px"}}>
                    <i className="fa fa-angle-left back" aria-hidden="true" onClick={()=>{this.props.history.goBack();}}></i>
                    <div className="deviceinfo">

                        <span>车辆信息</span>
                    </div>
                    <div className="selcar">
                      <span className="t">车辆ID：</span>
                      <SelectDevice
                        placeholder={"请输入设备ID"}
                        initdeviceid={this.state.deviceid}
                        onSelDeviceid={this.onSelDeviceid.bind(this)}
                        deviceidlist={deviceidlist}
                      />
                    </div>


                    <div className="anddday">
                        <div className="seldayli">
                            <Day color={"#333"} style={{width: "26px", height : "26px"}} />
                            <div className="dayinfo">
                                <span>{startdate_moment.format("YYYY年MM月DD日")}</span>
                                <span><span>{fGetCurrentWeek(startdate_moment)}</span><span>{startdate_moment.format("HH:mm")}</span></span>
                            </div>
                        </div>
                        <div className="seldayli">
                            <Day color={"#333"} style={{width: "26px", height : "26px"}} />
                            <div className="dayinfo">
                                <span>{enddate_moment.format("YYYY年MM月DD日")}</span>
                                <span><span>{fGetCurrentWeek(enddate_moment)}</span><span>{enddate_moment.format("HH:mm")}</span></span>
                            </div>
                        </div>
                        <Seltime width="225"
                          startDate = {this.state.startDate}
                          endDate = {this.state.endDate}
                         onChangeSelDate={this.onChangeSelDate.bind(this)}/>
                        
                        <div className="Setspeed">
                          <span>播放速度: </span>
                          <Select labelInValue defaultValue={{ key: '60' }} style={{ width: 40 }} onChange={this.handleChange}>
                            <Option value="5">5</Option>
                            <Option value="10">10</Option>
                            <Option value="15">15</Option>
                            <Option value="20">20</Option>
                            <Option value="25">25</Option>
                            <Option value="30">30</Option>
                            <Option value="35">35</Option>
                            <Option value="40">40</Option>
                            <Option value="45">45</Option>
                            <Option value="50">50</Option>
                            <Option value="55">55</Option>
                            <Option value="60">60</Option>
                            <Option value="65">65</Option>
                            <Option value="70">70</Option>
                            <Option value="75">75</Option>
                            <Option value="80">80</Option>
                            <Option value="85">85</Option>
                            <Option value="90">90</Option>
                            <Option value="95">95</Option>
                            <Option value="100">100</Option>
                          </Select>
                        </div>
                    </div>


                    <div className="controlbtn">
                        <span onClick={this.onClickStart.bind(this)}>开始</span>
                        <span onClick={this.onClickEnd.bind(this)}>结束</span>
                    </div>
                </div>

                <Map height={this.state.innerHeight-72} />
            </div>
        );
    }
}
const mapStateToProps = ({device:{g_devicesdb}}) => {
  return {g_devicesdb};
}
export default connect(mapStateToProps)(Page);
