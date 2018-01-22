/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import map from 'lodash.map';

import Button  from 'antd/lib/button';
import {
    ui_index_addcollection,
    ui_index_unaddcollection,
    ui_alarm_selcurdevice,
} from '../../actions';


class Page extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillMount () {
        // this.props.dispatch(setalarmreaded_request(this.props.match.params.alarmid));
    }
    render() {
        const {carcollections,alaramraws} = this.props;
        const alarmid = this.props.match.params.alarmid;
        const curalarm =  alaramraws[alarmid];

        const deviceid = curalarm['车辆ID'];

        let isincollections = false;
        map(carcollections,(id)=>{
            if(id === deviceid){
                isincollections = true;
            }
        });
        const datadevice = {
            "基本信息" :[{
                    name:'报警等级',
                    value: `${curalarm['报警等级']}`,
                },
                {
                    name:'车辆ID',
                    value: `${curalarm['车辆ID']}`,
                },
                {
                    name:'报警时间',
                    value: `${curalarm['报警时间']}`,
                },
                {
                    name:'报警信息',
                    value: `${curalarm['报警信息']}`,
                },
            ],
            // "位置信息":[
            //     {
            //         name:'报警位置',
            //         value: `${curalarm['报警位置']}`,
            //     },
            // ],
        };
        return (
            <div className="mydevicePage AppPage"
                style={{
                    backgroundSize: "100% 100%",
                    height : `${window.innerHeight}px`
                }}>
                <div className="navhead">
                    <a onClick={()=>{this.props.history.goBack()}} className="back"></a>
                    <span className="title" style={{paddingRight : "30px"}}>报警详情</span>
                    <a className="moresetting"></a>
                </div>
                <div className="deviceinfocontent">
                    {
                      map(datadevice,(item,index)=>{

                        return (
                            <div key={index}>
                                <div className="tit">{index}</div>
                                {
                                    map(item,(i,k)=>{
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
                               console.log("定位车辆");
                               this.props.dispatch(ui_alarm_selcurdevice(deviceid));
                             }
                         }>定位车辆</Button>
                    </div>
            </div>
        );
    }
}

const mapStateToProps = ({device,alarmpop}) => {
    const {carcollections} = device;
    const {alaramraws} = alarmpop;
    return {carcollections,alaramraws};
}

export default connect(mapStateToProps)(Page);
