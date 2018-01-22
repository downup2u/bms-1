
/**
 * Created by jiaowenhui on 2017/7/28.
    车辆详情
 */
import React from 'react';
import {connect} from 'react-redux';
import map from 'lodash.map';
import get from 'lodash.get';
import translate from 'redux-polyglot/translate';

import {
  ui_showhistoryplay,
  ui_showmenu,
  searchbatteryalarm_request,
  ui_clickplayback
} from '../../actions';
// import TableComponents from "../controls/table.js";

import { Button } from 'antd';
import {bridge_deviceinfo} from '../../sagas/datapiple/bridgedb';


class Page extends React.Component {
    onClickMenu(menuitemstring){
        this.props.dispatch(ui_showmenu(menuitemstring));
    }
    showhistoryplay(){
      this.props.dispatch(ui_showhistoryplay(true));
    }
    onClickQuery(query){
      this.props.dispatch(searchbatteryalarm_request(query));
    }
    render(){
      const {carcollections,g_devicesdb,mapdetailfields,mapdict} = this.props;
        let deviceid = this.props.match.params.deviceid;
        let isincollections = false;
        map(carcollections,(id)=>{
            if(id === deviceid){
                isincollections = true;
            }
        });
        let deviceitem = bridge_deviceinfo(g_devicesdb[deviceid]);
        let datadevice = [];
        map(mapdetailfields,(v)=>{
          let record = {};
          let kv = [];
          map(v.fieldslist,(fieldname)=>{
            if(!!mapdict[fieldname]){
              kv.push({
                name:mapdict[fieldname].showname,
                value:get(deviceitem,mapdict[fieldname].name,'')
              });
            }
          });
          record = {
            groupname:v.groupname,
            kv:kv
          };

          datadevice.push(record);
        });
        //console.log(datadevice);
      return (

            <div className="warningPage devicePage deviceinfoPage">

                <div className="appbar">
                    
                    <div className="title">车辆详情</div>
                    <div className="devicebtnlist">
                      {/*   <Button type="primary" icon="play-circle-o" onClick={
                          ()=>
                          {
                            this.props.dispatch(ui_clickplayback(this.props.match.params.deviceid));
                          }

                        }>车辆轨迹监控</Button>
                        <Button type="primary" icon="area-chart" onClick={
                          ()=>
                          {
                            // this.props.dispatch(ui_clickplayback(mapseldeviceid));
                            const id = this.props.match.params.deviceid;
                            this.props.history.push(`/devicedata/${id}`);// ./devicedata.js
                          }

                        }>车辆历史数据</Button>
                        <Button type="primary" icon="clock-circle-o" onClick={()=>{
                          const id = this.props.match.params.deviceid;
                          this.props.dispatch(ui_btnclick_devicemessage({DeviceId:id}));
                          //this.props.history.push(`/devicemessage/${mapseldeviceid}`)
                        }}>历史警告</Button> */}
                      <i className="fa fa-times-circle-o back" aria-hidden="true" onClick={()=>{this.props.history.goBack()}}></i>
                    </div>
                </div>

                <div className="lists deviceinfolist"
                    style={{
                        flexGrow: 0,
                    }}
                    >
                    {
                      map(datadevice,(item,index)=>{
                        return (
                            <div key={index} className="li">
                            <div>
                                <div className="tit">{item.groupname}</div>
                                {
                                    map(item.kv,(i,k)=>{
                                        return (<div key={k} ><span>{`${i.name}`}</span><span>{`${i.value}`}</span></div>);
                                    })
                                }
                                </div>
                            </div>
                        );
                      })
                    }
                    {
                      // map(datadevice,(item,i)=>{
                      //     return (
                      //         <div className="li" key={i}>
                      //             <div>
                      //             <div className="name">{item.name}</div><div className="text">{item.value}</div>
                      //             </div>
                      //         </div>
                      //     )
                      // })
                  }
                </div>

            </div>
        );
    }
}


const mapStateToProps = ({device,app}) => {
    const { carcollections, g_devicesdb, mapseldeviceid } = device;
    const { mapdetailfields, mapdict } = app;
    return { carcollections, g_devicesdb, mapdetailfields, mapdict, mapseldeviceid };
}
const DeviceComponentWithPProps = translate('showdevice')(Page);
export default connect(mapStateToProps)(DeviceComponentWithPProps);
