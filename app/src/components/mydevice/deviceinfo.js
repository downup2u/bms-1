/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import map from 'lodash.map';
import get from 'lodash.get';
import Devicestar from "../../img/16.png";
import Moresetting from "../../img/17.png";
import Searchimg from '../../img/13.png';
import Footer from "../index/footer.js";
import {ui_sel_tabindex} from '../../actions';
import Button  from 'antd/lib/button';
import {
    ui_index_addcollection,
    ui_index_unaddcollection
} from '../../actions';
import {bridge_deviceinfo} from '../../sagas/datapiple/bridgedb';


class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showtype : 0
        };
    }

    render() {
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
        console.log(datadevice);

        return (
            <div className="mydevicePage AppPage"
                style={{
                    backgroundSize: "100% 100%",
                    height : `${window.innerHeight}px`
                }}>
                <div className="navhead">
                    <a onClick={()=>{this.props.history.goBack()}} className="back"></a>
                    <span className="title" style={{paddingRight : "30px"}}>车辆详情</span>
                    <a className="moresetting"></a>
                </div>
                <div className="deviceinfocontent">
                    {
                      map(datadevice,(item,index)=>{
                        return (
                            <div key={index}>
                                <div className="tit">{item.groupname}</div>
                                {
                                    map(item.kv,(i,k)=>{
                                        return (<div key={k} className="li"><span>{`${i.name}`}</span><span>{`${i.value}`}</span></div>);
                                    })
                                }
                            </div>
                        );
                      })
                    }


                </div>
                <div className="mydevicebtn">
                        {!isincollections &&
                        <Button type="primary" icon="star" onClick={()=>{
                            this.props.dispatch(ui_index_addcollection(deviceid));
                          }
                        }>收藏车辆</Button>}
                        {isincollections &&
                        <Button type="primary" icon="star" onClick={()=>{
                            this.props.dispatch(ui_index_unaddcollection(deviceid));
                          }
                        }>取消收藏</Button>}
                        <Button icon="play-circle-o" style={{background : "#5cbeaa", color: "#FFF"}}
                           onClick={
                             ()=>{
                               console.log("轨迹回放");
                               this.props.dispatch(ui_sel_tabindex(4));
                               this.props.history.replace(`/playback/${deviceid}`);
                             }
                         }>轨迹回放</Button>
                    </div>
            </div>
        );
    }
}

const mapStateToProps = ({device,app}) => {
    const {carcollections,g_devicesdb} = device;
    const {mapdetailfields,mapdict} = app;
    return {carcollections,g_devicesdb,mapdetailfields,mapdict};
}

export default connect(mapStateToProps)(Page);
