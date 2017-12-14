/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';
import {grey900} from 'material-ui/styles/colors';
import DatePicker from 'react-mobile-datepicker';
import NavBar from "../tools/nav.js";
import Map from './map';
import "./map.css";
import {mapplayback_start,mapplayback_end} from '../../actions';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Searchimg from '../../img/13.png';
import Searchimg2 from '../../img/15.png';
import Searchimg4 from '../../img/23.png';
import Searchimg5 from '../../img/24.png';
import Slider from 'material-ui/Slider';
import Car from '../../img/5.png';
import Footer from "../index/footer.js";
import Seltime from "../tools/seltime.js";
import Button  from 'antd/lib/button';
import moment from 'moment';
import get from 'lodash.get';
import SelectDevice from '../mydevice/selectdevice.js';

const innerHeight = window.innerHeight;

class Page extends React.Component {
    constructor(props) {
        super(props);
        let deviceid =  this.props.match.params.deviceid;
        if(deviceid === '0'){
          deviceid = '';
        }
        this.state = {
            time: new Date(),
            isOpen: false,
            seltype : 0,
            startDate:moment().subtract(5, 'hours'),
            endDate:moment(),
            deviceid,
            mindata : new Date(1970, 0, 1),
            showset : true,
            speed:50,
        };
    }
    onSelDeviceid(deviceid){
        this.setState({
            deviceid
        });
    }
    onClickStart(){
        const {deviceid,startDate,endDate,speed} = this.state;

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
        this.props.dispatch(mapplayback_start({isloop:false,speed,query}));
        this.showset();

    }
    onClickEnd(){
        this.showset();
        this.props.dispatch(mapplayback_end({}));
    }

    handleClick = (v) => {
        this.setState({
            isOpen: true,
            seltype : v
        });

        //选中当前时间
        if(v === 0){
          this.setState({
              time: new Date(this.state.startDate)
          });
        }
        else{
          this.setState({
              time: new Date(this.state.endDate)
          });
        }
        //限制时间
        if(v===1){
            this.setState({
                mindata: new Date(this.state.startDate)
            });

        }else{
            this.setState({
                mindata: new Date(1970, 0, 1)
            });
        }
    }
    handleCancel = () => {
        this.setState({ isOpen: false });

    }
    showset =()=>{
        this.setState({
            showset: !this.state.showset
        });
    }
    handleSelect = (time) => {
        const t = moment(time);
        if(this.state.seltype===0){
            this.setState({ startDate: t, isOpen: false});
        }
        if(this.state.seltype===1){
            this.setState({ endDate: t, isOpen: false });
        }
    }
    render() {
        const {g_devicesdb} = this.props;

        const formstyle={width:"100%",flexGrow:"1"};
        const textFieldStyle={width:"100%",flexGrow:"1"};
        const height = innerHeight-(66+58);
        return (
            <div className="playbackPage AppPage"
                style={{height : `${innerHeight}px`,overflow: "hidden",paddingBottom:"0"}}
                >
                <div className="navhead">
                    <span className="title" style={{paddingLeft : "30px"}}>轨迹回放</span>
                    <a className="searchlnk" onClick={this.showset}>
                        <img src={Searchimg} /></a>
                </div>
                {
                    this.state.showset &&
                    <div className="set seltimewamp" style={{height: "260px"}}>
                        <div className="seltimecontent selcarts" onClick={()=>{this.props.history.replace(`/selcart/playback/${this.props.match.params.deviceid}`)}}>
                                <img src={Car} width={30} />
                                <span className="txt1">车辆信息:{`${this.state.deviceid}`}</span>
                                <span className="txt2">选择车辆</span>
                            </div>
                        <div className="seltimecontent" onClick={this.handleClick.bind(this, 0)}>
                            <img src={Searchimg2} width={26} />
                            <span>起始时间:{ this.state.startDate.format('YYYY-MM-DD HH:mm')}</span>
                        </div>
                        <div className="seltimecontent" onClick={this.handleClick.bind(this, 1)}>
                            <img src={Searchimg2} width={26} />
                            <span>结束时间:{ this.state.endDate.format('YYYY-MM-DD HH:mm')}</span>
                        </div>
                        <div className="seltimecontent setsudu" style={{marginBottom: "10px"}}>
                            <img src={Searchimg5} width={26} />
                            <span>播放速度:</span>
                            <Slider
                                step={1}
                                value={this.state.speed}
                                max={500}
                                min={1}
                                onChange={(e,v)=>{console.log(v)}}
                                style={{flexGrow: 1, margin: "10px"}}
                                sliderStyle={{margin: 0,marginTop: "10px"}}
                                onChange={(e,v)=>{this.setState({speed:v})}}
                                />
                            <span className="shownumber">{this.state.speed}</span>
                        </div>
                        <div className="seltimebtn">
                            <RaisedButton label="开始"
                                backgroundColor={"#67bd82"} labelColor={"#FFF"}
                                onClick={this.onClickStart.bind(this)}
                                buttonStyle={{width:"100px",height : "30px", lineHeight : "30px"}}
                                />
                            <RaisedButton label="结束"
                                backgroundColor={"#3a52a2"} labelColor={"#FFF"}
                                onClick={this.onClickEnd.bind(this)}
                                style={{marginLeft: "30px"}}
                                buttonStyle={{width:"100px",height : "30px", lineHeight : "30px"}}
                                />
                        </div>
                    </div>
                }

                <Map height={height}/>
                <Footer sel={4} />
                <DatePicker
                    value={this.state.time}
                    isOpen={this.state.isOpen}
                    onSelect={this.handleSelect}
                    onCancel={this.handleCancel}
                    min={this.state.mindata}
                    max={new Date()}
                    showFormat='YYYY/MM/DD hh:mm'
                    dateFormat={['YY年', 'MM月', 'DD日', 'hh时', 'mm分']}
                    theme="ios" />
            </div>
        );
    }
}
// const mapStateToProps= ({device}) => {
//     const {g_devicesdb} = device;
//     return {g_devicesdb};
// }
export default connect()(Page);
