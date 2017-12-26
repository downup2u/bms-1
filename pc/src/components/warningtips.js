/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import CarOnline from "../img/1.png";
import CarOutline from "../img/3.png";
import D1 from "../img/d1.png";
import D2 from "../img/d2.png";
import D3 from "../img/d3.png";
import Pow1 from "../img/pow1.png";
import Pow2 from "../img/pow2.png";
import Pow3 from "../img/pow3.png";
import { ui_showmenu } from '../actions';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import ContentLink from 'material-ui/svg-icons/content/link';
import Divider from 'material-ui/Divider';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import Download from 'material-ui/svg-icons/file/file-download';
import Delete from 'material-ui/svg-icons/action/delete';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import MapsPlace from 'material-ui/svg-icons/maps/place';
import Settings from "material-ui/svg-icons/action/settings";
import Car from "material-ui/svg-icons/maps/directions-car";
import Chart from "material-ui/svg-icons/editor/insert-chart";
import Assignment from "material-ui/svg-icons/action/assignment";

import Exit from "material-ui/svg-icons/action/exit-to-app";
import Avatar from "../img/t1.png";

import Userlist_4 from "../img/4.png";
import Userlist_5 from "../img/5.png";
import Userlist_6 from "../img/6.png";
import Userlist_7 from "../img/7.png";
import Userlist_8 from "../img/8.png";

import RaisedButton from 'material-ui/RaisedButton';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import withRouter from 'react-router-dom/withRouter';
import { Icon } from "antd";

import {
  ui_btnclick_deviceonline,
  ui_btnclick_deviceoffline,
  ui_btnclick_alaramall,
  ui_btnclick_alaramred,
  ui_btnclick_alaramorange,
  ui_btnclick_alaramyellow,
  ui_clickplayback,
  ui_changemodeview,
  ui_menuclick_settings,
  ui_menuclick_logout
}from '../actions';

import map from 'lodash.map';
import countBy from 'lodash.countby';
import {jsondata_bms_chargingpile} from '../test/bmsdata.js';

/**
 * The `maxHeight` property limits the height of the menu, above which it will be scrollable.
 */

// const UserMenu = () => (
//     <IconMenu
//         iconButtonElement={
//           <IconButton>
//             <div className="topuser">
//                 <span>jwhklk</span>
//                 <img src={Avatar}  />
//             </div>
//           </IconButton>
//         }
//         targetOrigin={{horizontal: 'left', vertical: 'top'}}
//         anchorOrigin ={{ vertical: 'bottom', horizontal: 'left'}}
//         >
//         <MenuItem primaryText="设置" leftIcon={<Settings />} />
//         <MenuItem primaryText="退出登录" leftIcon={<Exit />} />
//     </IconMenu>
// );

class UserMenu extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };
// this.props.history.push("/device")
  render() {
    const {username,role,avatar} = this.props;
    const defaultavatar = Avatar;
    let mapcontent = {
      '0':{
        title:'运营分析',
        link:"https://app.powerbi.com/view?r=eyJrIjoiNmMzYjA1ZGEtMTJlMi00YTIzLTllOWEtMzA5ZTkwY2YxYWVhIiwidCI6IjQwMjJlMDNlLTU4MjAtNDhhNS1iODQ5LWNkZThjZDc3ZThmYyIsImMiOjF9"
      },
      '1':{
        title:'充电桩分布',
        link:'https://app.powerbi.com/view?r=eyJrIjoiYTJlZDRiMWMtYjY3Yy00NzdmLThlODMtN2EyMGI3NmZhYjg4IiwidCI6IjQwMjJlMDNlLTU4MjAtNDhhNS1iODQ5LWNkZThjZDc3ZThmYyIsImMiOjF9'
      },
      '2':{
        title:'减排量统计',
        link:'https://app.powerbi.com/view?r=eyJrIjoiMTA4MmJlZTMtNGQ2OS00MTMxLTliMDUtZDIwMmRmMTUwZWJkIiwidCI6IjQwMjJlMDNlLTU4MjAtNDhhNS1iODQ5LWNkZThjZDc3ZThmYyIsImMiOjF9'
      },
      '3':{
        title:'仪表盘1',
        link:'https://app.powerbi.com/view?r=eyJrIjoiOWFiZGQ5NDMtZGIyMy00MWVmLWEzODQtNzhkNTUwODA3ODExIiwidCI6IjQwMjJlMDNlLTU4MjAtNDhhNS1iODQ5LWNkZThjZDc3ZThmYyIsImMiOjF9'
      },
      '4':{
        title:'仪表盘2',
        link:'https://app.powerbi.com/view?r=eyJrIjoiNWQ3NWU3NzUtYmU3Yi00NWZmLWEzMjItMjA1ZDYxZjFiOWNkIiwidCI6IjQwMjJlMDNlLTU4MjAtNDhhNS1iODQ5LWNkZThjZDc3ZThmYyIsImMiOjF9'
      },
      '5':{
        title:'仪表盘3',
        link:'https://app.powerbi.com/view?r=eyJrIjoiMGRmZDY5NzAtMmU0YS00OTQyLWFiMzMtMjRiZGIwYWQzNWU2IiwidCI6IjQwMjJlMDNlLTU4MjAtNDhhNS1iODQ5LWNkZThjZDc3ZThmYyIsImMiOjF9'
      },
    };
    let menuitems = [];
    if(role === 'admin'){
      menuitems.push(<MenuItem key={'3'} primaryText={`${mapcontent[3].title}`} leftIcon={<img src={Userlist_7} />} onClick={()=>{
            this.handleRequestClose();
            // this.props.history.push("/chartlist/1");
            window.open(`${mapcontent[3].link}`,'_blank');
        }}/>);
      menuitems.push(<MenuItem key={'4'} primaryText={`${mapcontent[4].title}`} leftIcon={<img src={Userlist_7} />} onClick={()=>{
            this.handleRequestClose();
            // this.props.history.push("/chartlist/1");
            window.open(`${mapcontent[4].link}`,'_blank');
        }}/>);
      menuitems.push(<MenuItem key={'5'} primaryText={`${mapcontent[5].title}`} leftIcon={<img src={Userlist_7} />} onClick={()=>{
            this.handleRequestClose();
            // this.props.history.push("/chartlist/1");
            window.open(`${mapcontent[3].link}`,'_blank');
        }}/>);
    }
    return (
      <div>
        <div className="topuser" onClick={this.handleTouchTap}>
            <span>{username}</span>
            <img src={defaultavatar}  />
        </div>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
          animation={PopoverAnimationVertical}
        >
          <Menu>
            {/* {menuitems} */}
            {/* <MenuItem primaryText="运营分析" leftIcon={<img src={Userlist_6} />} onClick={()=>{
                this.handleRequestClose();
                // this.props.history.push("/chartlist/1");
                window.open(`${mapcontent[0].link}`,'_blank');
            }}/>
            <MenuItem primaryText="充电桩分布" leftIcon={<img src={Userlist_5} />} onClick={()=>{
                this.handleRequestClose();
                // this.props.history.push("/chartlist/1");
                window.open(`${mapcontent[1].link}`,'_blank');
            }}/>
             <MenuItem primaryText="减排量统计" leftIcon={<img src={Userlist_8} />} onClick={()=>{
                    this.handleRequestClose();
                    window.open(`${mapcontent[2].link}`,'_blank');
            }}/> */}
            <MenuItem primaryText="车辆轨迹监控" leftIcon={<img src={Userlist_4} />} onClick={()=>{
                this.handleRequestClose();
                this.props.dispatch(ui_changemodeview('device'));
                this.props.history.push(`/historyplay/0`);
                //this.props.dispatch(ui_clickplayback(0));
            }}/>
            {/* <MenuItem primaryText="工单查询" leftIcon={<Assignment />} onClick={()=>{
                this.handleRequestClose();
                this.props.dispatch(ui_changemodeview('device'));
                this.props.history.push("/workorder");
            }}/> */}
          {<MenuItem primaryText="查询报表【位置】" leftIcon={<Car />} onClick={()=>{
                this.handleRequestClose();
                this.props.history.push("/reports/position");
            }}/>}
          {<MenuItem primaryText="报警信息日报" leftIcon={<Car />} onClick={()=>{
                this.handleRequestClose();
                this.props.history.push("/reports/alarm");
            }}/>}
          {<MenuItem primaryText="报警历史查询" leftIcon={<Car />} onClick={()=>{
                this.handleRequestClose();
                this.props.history.push("/reports/alarmdetail");
            }}/>}
            {/* <MenuItem primaryText="后台管理" leftIcon={<Settings />} onClick={()=>{
                this.handleRequestClose();
                window.open('http://catldemo.com28.cn/admin/build/','_blank');
                // this.props.dispatch(ui_menuclick_settings({}));
            }}/> */}
            <MenuItem primaryText="退出登录" leftIcon={<Exit />} onClick={()=>{
                this.handleRequestClose();
                this.props.dispatch(ui_menuclick_logout({}));
            }}/>
          </Menu>
        </Popover>
      </div>
    );
  }
}

const mapStateToProps = ({userlogin}) => {
   const {username,role,avatar} = userlogin;
   return {username,role,avatar};
}
UserMenu = withRouter(UserMenu);
UserMenu = connect(mapStateToProps)(UserMenu);

class Page extends React.Component {
    onClickMenu(tiptype){
        if(tiptype === 'online'){
            this.props.dispatch(ui_btnclick_deviceonline({}));
        }
        else if(tiptype === 'offline'){
            this.props.dispatch(ui_btnclick_deviceonline({}));
        }
        else if(tiptype === 'all'){
            this.props.dispatch(ui_btnclick_alaramall({}));
        }
        else if(tiptype === 'red'){
            this.props.dispatch(ui_btnclick_alaramred({}));
        }
        else if(tiptype === 'orange'){
            this.props.dispatch(ui_btnclick_alaramorange({}));
        }
        else if(tiptype === 'yellow'){
            this.props.dispatch(ui_btnclick_alaramyellow({}));
        }
        //this.props.dispatch(ui_showmenu('showmessage'));
    }
    onClickMenuPipleinfo(tiptype){
      console.log(`onClickMenuPipleinfo:${tiptype}`)
    }

    render(){

        const iconstyle1 = {
            width:"27px",
            height:"32px",
            fontSize:"26px",
            textAlign:"center",
            display:"flex",
            alignItems: "center",
            justifyContent: "center",
            color : "#d21d24",
            marginBottom :"-6px"
        }
        const iconstyle2 = {...iconstyle1};
        iconstyle2.color = "#ed942f";

        const iconstyle3 = {...iconstyle1};
        iconstyle3.color = "#f6d06b";

        const iconstyle4 = {...iconstyle1};
        iconstyle4.color = "#5cbeaa";
        iconstyle4.fontSize = "30px";

        const {count_online,count_offline,count_all,count_yellow,count_red,count_orange,modeview} = this.props;
        if(modeview === 'device'){
            return (
              <div className="BadgeStyle">

                  <Badge
                      badgeContent={count_online}
                      className="Badge"
                      secondary={true}
                      style={{padding:"0",width:"auto",height:"36px",display: "flex", marginRight : "15px"}}
                      badgeStyle={{
                          top : "auto",
                          bottom: "-4px",
                          right: "-4px",
                          backgroundColor: "none",
                          color : "#111",
                          position: "relative",
                          bottom: "-8px",
                          fontSize: "18px",
                          width : "auto",
                          color : "#5cbeaa"
                      }}
                      onClick={this.onClickMenu.bind(this,'online')}
                      >
                      <img src={CarOnline} style={{marginBottom: "-6px", width:"32px", height:"32px"}} onClick={this.onClickMenu.bind(this,'online')} />
                  </Badge>
                  <Badge
                      badgeContent={count_offline}
                      className="Badge"
                      secondary={true}
                      style={{padding:"0",width:"auto",height:"36px",display: "flex", marginRight : "15px"}}
                      badgeStyle={{
                          top : "auto",
                          bottom: "-4px",
                          right: "-4px",
                          backgroundColor: "none",
                          color : "#111",
                          position: "relative",
                          bottom: "-8px",
                          fontSize: "18px",
                          width : "auto",
                          color : "#999"
                      }}
                      onClick={this.onClickMenu.bind(this,'offline')}
                      >
                      <img src={CarOutline} style={{marginBottom: "-6px", width:"32px", height:"32px"}} onClick={this.onClickMenu.bind(this,'offline')} />
                  </Badge>
                  <Badge
                      badgeContent={`(${count_red})`}
                      className="Badge"
                      secondary={true}
                      style={{padding:"0",width:"auto",height:"36px",display: "flex", marginRight : "15px"}}
                      badgeStyle={{
                          top : "auto",
                          bottom: "-4px",
                          right: "-4px",
                          backgroundColor: "none",
                          color : "#111",
                          position: "relative",
                          bottom: "-8px",
                          fontSize: "18px",
                          width : "auto",
                          color : "#d21d24"
                      }}
                      onClick={this.onClickMenu.bind(this,'red')}
                      >
                      <img style={{ width: "40px", height: "40px"}} src={D1} />
                  </Badge>
                  <Badge
                      badgeContent={`(${count_orange})`}
                      className="Badge"
                      secondary={true}
                      style={{padding:"0",width:"auto",height:"36px",display: "flex", marginRight : "15px"}}
                      badgeStyle={{
                          top : "auto",
                          bottom: "-4px",
                          right: "-4px",
                          backgroundColor: "none",
                          color : "#111",
                          position: "relative",
                          bottom: "-8px",
                          fontSize: "18px",
                          width : "auto",
                          color : "#ed942f"
                      }}
                      onClick={this.onClickMenu.bind(this,'orange')}
                      >
                      <img style={{ width: "40px", height: "40px"}} src={D2} />
                  </Badge>
                  <Badge
                      badgeContent={`(${count_yellow})`}
                      className="Badge"
                      secondary={true}
                      style={{padding:"0",width:"auto",height:"36px",display: "flex", marginRight : "15px"}}
                      badgeStyle={{
                          top : "auto",
                          bottom: "-4px",
                          right: "-4px",
                          backgroundColor: "none",
                          color : "#111",
                          position: "relative",
                          bottom: "-8px",
                          fontSize: "18px",
                          width : "auto",
                          color : "#f6d06b"
                      }}
                      onClick={this.onClickMenu.bind(this,'yellow')}
                      >
                      <img style={{ width: "40px", height: "40px"}} src={D3} />
                  </Badge>

                  <Badge
                      badgeContent={`${count_all}`}
                      className="Badge"
                      secondary={true}
                      style={{
                          padding:"0",width:"36px",height:"36px",display: "flex",marginRight: "10px"}}
                      badgeStyle={{
                          top: "-4px", right: "-4px",
                          backgroundColor : "#FFF",
                          color : "#C00",
                          border : "2px solid #C00",
                          width : "28px",
                          height : "28px",
                          lineHeight : "28px",
                          fontSize : "11px"
                      }}
                      onClick={this.onClickMenu.bind(this,'all')}
                      >
                      <i className="fa fa-envelope-o" aria-hidden="true" style={iconstyle1} />
                    </Badge>


                    <UserMenu />

                </div>
            );
        }
        // let count_0 = countBy(jsondata_bms_chargingpile,(item)=>{
        //   return item.imagetype == 4;
        // });
        // let count_1 = countBy(jsondata_bms_chargingpile,(item)=>{
        //   return item.imagetype == 5;
        // });
        // let count_2 = countBy(jsondata_bms_chargingpile,(item)=>{
        //   return item.imagetype == 6;
        // });
        let count_chargingpile_obj = countBy(jsondata_bms_chargingpile,'imagetype');
        //充电桩模式
        return (
            <div className="BadgeStyle">
                <Badge
                    badgeContent={`工作(${count_chargingpile_obj['4']})`}
                    className="Badge"
                    secondary={true}
                    style={{padding:"0",width:"auto",height:"36px",display: "flex", marginRight : "15px"}}
                    badgeStyle={{
                        top : "auto",
                        bottom: "-4px",
                        right: "-4px",
                        backgroundColor: "none",
                        color : "#111",
                        position: "relative",
                        bottom: "-8px",
                        fontSize: "18px",
                        width : "auto",
                        color : "#666"
                    }}
                    onClick={this.onClickMenuPipleinfo.bind(this,'4')}
                    >
                    <img src={Pow2} style={{marginBottom: "-6px", width: "24px"}} />
                </Badge>
                <Badge
                    badgeContent={`空闲(${count_chargingpile_obj['5']})`}
                    className="Badge"
                    secondary={true}
                    style={{padding:"0",width:"auto",height:"36px",display: "flex", marginRight : "15px"}}
                    badgeStyle={{
                        top : "auto",
                        bottom: "-4px",
                        right: "-4px",
                        backgroundColor: "none",
                        color : "#111",
                        position: "relative",
                        bottom: "-8px",
                        fontSize: "18px",
                        width : "auto",
                        color : "#666"
                    }}
                    onClick={this.onClickMenuPipleinfo.bind(this,'5')}
                    >
                    <img src={Pow1} style={{marginBottom: "-6px", width: "24px"}} />
                </Badge>
                <Badge
                    badgeContent={`维修(${count_chargingpile_obj['6']})`}
                    className="Badge"
                    secondary={true}
                    style={{padding:"0",width:"auto",height:"36px",display: "flex", marginRight : "15px"}}
                    badgeStyle={{
                        top : "auto",
                        bottom: "-4px",
                        right: "-4px",
                        backgroundColor: "none",
                        color : "#111",
                        position: "relative",
                        bottom: "-8px",
                        fontSize: "18px",
                        width : "auto",
                        color : "#666"
                    }}
                    onClick={this.onClickMenuPipleinfo.bind(this,'6')}
                    >
                    <img src={Pow3} style={{marginBottom: "-6px", width: "24px"}} />
                </Badge>
                <UserMenu />

            </div>
        )

    }
}


//this.onClickMenu.bind(this,'low')
Page = withRouter(Page);
const mapStateToPropsTip = ({device,app,searchresult:{curallalarm,alarms},tip}) => {
  const {modeview} = app;
   const {g_devicesdb} = device;

   let count_online = tip.count_online;
   let count_offline = tip.count_offline;

   let count_all = 0;
   let count_yellow = tip.count_alarm2;
   let count_red = tip.count_alarm0;
   let count_orange = tip.count_alarm1;

   count_all = count_red + count_orange + count_yellow;

    if(count_all>99){
        count_all = "99+";
    }


   return {count_online,count_offline,count_all,count_yellow,count_red,count_orange,modeview};
 }
export default connect(mapStateToPropsTip)(Page);
