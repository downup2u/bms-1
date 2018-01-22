/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';

import {ui_selworkorder} from '../../actions';
import PicturesWall  from '../controls/pictureswall.js';


class Page extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pics:[],
        };
    }

    componentWillMount(){
      const {workorders} = this.props;
      let data = workorders[this.props.match.params.workid];
      if(!!data){
        this.setState({
          pics:data.pics || []
        });
      }
    }

    pointdevice =(id)=>{
        //console.log(id);
        //定位设备
        this.props.dispatch(ui_selworkorder(id));
    }

    render() {
        const {workorders} = this.props;
        const {pics} = this.state;
        let data = workorders[this.props.match.params.workid];
        const colorred = {color: "#C00"};
        let title = data.isdone?`已处理工单:${data._id}`:`待处理工单:${data._id}`
        return (


            <div className="warningPage devicePage deviceinfoPage workorderinfoPage" style={{height : window.innerHeight+"px"}}>

                <div className="appbar">

                    <div className="title">{title}</div>
                    <div className="devicebtnlist">
                        <Button type="primary" icon="environment" onClick={this.pointdevice.bind(this, data.DeviceId)}>定位设备</Button>
                    </div>
                    <i className="fa fa-times-circle-o back" aria-hidden="true" onClick={()=>{this.props.history.goBack()}}></i>

                </div>
                <div
                    className="lists deviceinfolist"
                    style={{overflowY: "scroll"}}
                    >
                    <div className="li"><div><div className="name">车牌</div><div className="text">{data['车牌']}</div></div></div>
                    <div className="li"><div><div className="name">派单时间</div><div className="text">{data['派单时间']}</div></div></div>
                    <div className="li"><div><div className="name">项目</div><div className="text">{data['项目']}</div></div></div>
                    <div className="li"><div><div className="name">故障类型</div><div className="text">{data['故障类型']}</div></div></div>
                    <div className="li"><div><div className="name">电池厂商</div><div className="text">{data['电池厂商']}</div></div></div>
                    <div className="li"><div><div className="name">工单来源</div><div className="text">{data['工单来源']}</div></div></div>
                    <div className="li"><div><div className="name">电机厂商</div><div className="text">{data['电机厂商']}</div></div></div>
                    <div className="li"><div><div className="name">单号</div><div className="text">{data['单号']}</div></div></div>
                    <div className="li"><div><div className="name">联系人</div><div className="text">{data['联系人']}</div></div></div>
                    <div className="li"><div><div className="name">联系方式</div><div className="text">{data['联系方式']}</div></div></div>
                    <div className="li"><div><div className="name">当前位置</div><div className="text">{data['当前位置']}</div></div></div>
                    <div className="li"><div><div className="name">故障描述</div><div className="text">{data['故障描述']}</div></div></div>
                    <div className="li"><div><div className="name">备注</div><div className="text">{data['备注']}</div></div></div>
                </div>
                <div className="control">
                    <div className="tit">维修反馈</div>
                    <div className="infoimg">
                        {
                            data.isdone ? <div className="statusbtn">已完成</div>:<div className="statusbtn nodone">未处理</div>
                        }
                        { data.isdone && <div>{data['feedbacktxt']}</div>}
                        { data.isdone && <PicturesWall value={pics} isdone={true} candel={false} />}
                    </div>

                </div>
            </div>

        );
    }
}

const mapStateToProps = ({workorder}) => {
  const {workorders} = workorder;
  return {workorders};
}
export default connect(mapStateToProps)(Page);
