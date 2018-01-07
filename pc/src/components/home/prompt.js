import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {ui_alarm_selcurdevice} from '../../actions';

class Prompt extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            curmessage : 0,
            mini: false
        };
    }
    //快速定位
    getaddress=(DeviceId)=>{
        //console.log(DeviceId);
        // let DeviceId = '1727208808';
        this.props.dispatch(ui_alarm_selcurdevice(DeviceId));
    }
    //查看详情
    getdeviceinfo=(DeviceId)=>{
        //console.log(DeviceId);
        // let DeviceId = '1727208808';
        this.props.history.push(`/deviceinfo/${DeviceId}`);
    }
    //查看下一条
    next=()=>{
        let setcur = this.state.curmessage+1;
        if(setcur<=this.props.promptdata.length-1){
            this.setState({curmessage : setcur})
        }
    }

    mini=(v)=>{
        if(!v){
            this.setState({curmessage : 0})
        }
        this.setState({mini : v});
    }

    render(){
        const {promptdata} = this.props;
        const promptstyle = promptdata.length>0 ? "prompt show": "prompt hide";

        if(promptdata.length>0){
            let curpromtinfo = promptdata[this.state.curmessage];

            if(this.state.mini){
                return (
                    <div className={`${promptstyle} min`} onClick={this.mini.bind(this, false)}>车辆报警中</div>
                );
            }else{
                return (
                    <div className={promptstyle}>
                        <div className="head">
                            <span>严重警告</span>
                            <a onClick={this.mini.bind(this, true)}>最小化</a>
                        </div>
                        <div className="body">
                            <p><span>车辆ID:</span><span>{curpromtinfo['车辆ID']}</span></p>
                            <p><span>报警时间:</span><span>{curpromtinfo['报警时间']}</span></p>
                            <p><span>报警信息:</span><span>{curpromtinfo['报警信息']}</span></p>
                        </div>
                        <div className="btn">
                            <a onClick={()=>{
                              this.getaddress(curpromtinfo['车辆ID']);
                            }
                            }>快速定位</a>
                            <a onClick={this.next} className={(this.state.curmessage+1===promptdata.length)?"cancle":""}>{`${this.state.curmessage+1}/${promptdata.length}`}下一条</a>
                        </div>
                    </div>
                )
            }
        }else{
            return (<div style={{display: "none"}}></div>)
        }
    }
}

const data = ({alarmpop:{promptdata}}) => {
    return { promptdata };
}
Prompt = withRouter(Prompt);
export default connect(data)(Prompt);
