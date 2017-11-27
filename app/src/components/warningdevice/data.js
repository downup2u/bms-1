/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';
import {grey900} from 'material-ui/styles/colors';
import NavBar from "../tools/nav.js";
import Map from './map';
import "./map.css";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Searchimg from '../../img/13.png';
import Searchimg2 from '../../img/14.png';
import Searchimg3 from '../../img/15.png';
import Searchimg4 from '../../img/23.png';
import Car from '../../img/5.png';

import Footer from "../index/footer.js";
import Datalist from "./datalist";
import MapPage from '../admincontent';
import {searchbatteryalarm_request} from '../../actions';
import DatePicker from 'react-mobile-datepicker';
import moment from 'moment';


class Page extends React.Component {
    constructor(props) {
        super(props);
        let deviceid =  this.props.match.params.deviceid;
        if(deviceid === '0'){
          deviceid = '';
        }
        this.state = {
            warninglevel:-1,
            showdata : false,
            time: new Date(),
            isOpen: false,
            seltype : 0,
            startDate:moment().subtract(10, 'days'),
            endDate:moment(),
            mindata : new Date(1970, 0, 1),
            showset : false,
            deviceid,
        };
    }
    componentWillMount () {
        this.props.dispatch(searchbatteryalarm_request({
          query:{
            CurDay:moment().format('YYYY-MM-DD')
          }
        }));
        //this.onSearch(this.state.seltype);
    }
    onSearch(v){
      let query = {};
      const {startDate,endDate,warninglevel,deviceid} = this.state;
      if(deviceid != ''){
        query.DeviceId = deviceid;
      }
      query.DataTime = {
        $gte: startDate.format('YYYY-MM-DD HH:mm:ss'),
        $lte: endDate.format('YYYY-MM-DD HH:mm:ss'),
      }
      // query.queryalarm = {
      //   startDate:startDate.format('YYYY-MM-DD HH:mm:ss'),
      //   endDate:endDate.format('YYYY-MM-DD HH:mm:ss'),
      // };
      if(warninglevel != -1){
        if(warninglevel === 0){
          query.warninglevel = '高';
        }
        else if(warninglevel === 1){
          query.warninglevel = '中';
        }
        else if(warninglevel === 2){
          query.warninglevel = '低';
        }
      }
      // if(v === 0){
      //   query.queryalarm.isreaded = false;
      // }
      // else if(v === 1){
      //   query.queryalarm.isreaded = true;
      // }
      this.props.dispatch(searchbatteryalarm_request({query}));
    }
    onClickSearch(e){
      e.stopPropagation();
      this.setState({showdata: false});

      this.onSearch(this.state.seltype);
    }
    onChangeWarninglevel(event, index, value){
      this.setState({
        warninglevel:value
      });
    }
    seltype=(v)=>{

        this.setState({seltype : v});
        this.onSearch(v);

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
            if(this.state.starttime!==''){
                this.setState({
                    mindata: new Date(this.state.startDate)
                });
            }
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
        // console.log("sssss")
        this.setState({ showset: !this.state.showset });
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

        const formstyle={width:"100%",flexGrow:"1"};
        const textFieldStyle={width:"100%",flexGrow:"1"};
        const height =  window.innerHeight - 65 - 209;
        return (
            <div className="playbackPage AppPage warningmessagePage"
                style={{
                    height : `${window.innerHeight}px`,
                    overflow: "hidden",
                    paddingBottom:"0",

                }}
                >
                <div className="navhead">
                    <span className="title" style={{paddingLeft : "30px"}}>报警信息</span>
                    <a className="searchlnk" onClick={()=>{this.setState({showdata: !this.state.showdata})}} ><img src={Searchimg} /></a>
                </div>
                {
                    this.state.showdata &&
                    <div className="set warningmessageset">
                        <div className="title">告警车辆搜索</div>
                        <div className="formlist ">
                            <div className="seltimecontent selcarts" onClick={()=>{this.props.history.replace(`/selcart/warningdevice/${this.props.match.params.deviceid}`)}}>
                                <img src={Car} width={30} />
                                <span className="txt1">车辆信息:{`${this.state.deviceid}`}</span>
                                <span className="txt2">选择车辆</span>
                            </div>
                            <div className="li" style={{borderBottom: "1px solid #EEE"}}>
                                <img src={Searchimg2} width={26} />
                                <SelectField
                                    value={this.state.warninglevel}
                                    onChange={this.onChangeWarninglevel.bind(this)}
                                    fullWidth={true} style={{flexGrow: "1",marginLeft: "10px"}}
                                    underlineStyle={{border: "none"}}
                                    >
                                    <MenuItem value={-1} primaryText="告警等级" />
                                    <MenuItem value={0} primaryText="高" />
                                    <MenuItem value={1} primaryText="中" />
                                    <MenuItem value={2} primaryText="低" />
                                </SelectField>
                            </div>
                            <div className="seltimecontent" onClick={this.handleClick.bind(this, 0)}>
                                <img src={Searchimg3} width={26} />
                                <span>起始时间:{ this.state.startDate.format('YYYY-MM-DD HH:mm')}</span>
                            </div>
                            <div className="seltimecontent" onClick={this.handleClick.bind(this, 1)} style={{marginBottom: "10px"}}>
                                <img src={Searchimg3} width={26} />
                                <span>结束时间:{ this.state.endDate.format('YYYY-MM-DD HH:mm')}</span>
                            </div>

                            <RaisedButton
                                onClick={(e)=>{this.onClickSearch(e);}}
                                label="搜索"
                                backgroundColor={"#5cbeaa"}
                                labelStyle={{fontSize: "16px",color : "#FFF"}}
                                style={{ margin: "0 15px 20px 15px", width: "auto"}}
                                />
                        </div>
                        <div style={{flexGrow: 1}} onClick={()=>{this.setState({showdata: !this.state.showdata})}}></div>
                    </div>
                }

                <Datalist seltype={this.state.seltype} tableheight={window.innerHeight-58-65-50}/>
                <Footer sel={1} />
                <DatePicker
                    value={this.state.time}
                    isOpen={this.state.isOpen}
                    onSelect={this.handleSelect}
                    onCancel={this.handleCancel}
                    min={this.state.mindata}
                    max={new Date()}
                    showFormat='YYYY/MM/DD/hh/mm'
                    dateFormat={['YYYY年', 'MM月', 'DD日', 'hh时', 'mm分']} />
            </div>
        );
    }
}
// const mapStateToProps= ({device}) => {
//     const {g_devicesdb} = device;
//     return {g_devicesdb};
// }
export default connect()(Page);
