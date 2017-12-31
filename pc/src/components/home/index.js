/**`
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';

import AdminContent from "./admincontent";
import Menu from "./menu";
import Tree from "./tree";
import Warningtips from "./warningtips";
import Prompt from "./prompt";

import Logo from "../../img/logo.png";
import {
    ui_showmenu,
    ui_showhistoryplay,
    ui_changemodeview
} from '../../actions';
import translate from 'redux-polyglot/translate';

let resizetime = null;
let resizetimecontent = null;
// this.props.dispatch(ui_showmenu(menuitemstring));

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            innerWidth : window.innerWidth,
            innerHeight : window.innerHeight,
            openaddress : false,
        };
    }
    componentWillMount() {
        // window.onresize = ()=>{
        //     window.clearTimeout(resizetime);
        //     resizetime = window.setTimeout(()=>{
        //         this.setState({
        //             innerWidth: window.innerWidth,
        //             innerHeight: window.innerHeight,
        //         });
        //     }, 10)
        // }
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
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
            });

        }, 10)
    }
    //主菜单点击事件
    menuevent = () => this.props.dispatch(ui_showmenu(""));
    //显示电池包搜索
    showPowersearch =()=> this.props.dispatch(ui_showmenu("powersearch"));
    showWarningbox =()=> this.props.dispatch(ui_showmenu("warningbox"));
    showAddressbox =()=> this.props.dispatch(ui_showmenu("addressbox"));
    showMessage =()=> this.props.dispatch(ui_showmenu("showmessage"));
    showDeviceInfo =()=> this.props.dispatch(ui_showmenu("showdevice"));
    //现实历史轨迹点击时间
    showhistoryplay = () => this.props.dispatch(ui_showhistoryplay(true));
    hidehistoryplay = () => this.props.dispatch(ui_showhistoryplay(false));

    onTouchTap=()=>{

    }

    getdrawstyle=(width)=>{
        return ({
            drawopenstyle : {
                marginLeft: 0,
                order: -1,
                transition: 'margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
            },
            drawclosestyle : {
                marginLeft: `-${width}`,
                order: -1,
                transition: 'margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
            },
        })
    }

    titleNavClick =(v)=>{
        if(v===0){
          this.props.dispatch(ui_changemodeview('device'));
        }
        else{
          this.props.dispatch(ui_changemodeview('chargingpile'));
        }
    }

    render() {
        const {showmenu,p,modeview} = this.props;
        const treestyle = this.getdrawstyle("400px");

        return (
            <div className="AppPage" id="AppPage" style={{height : `${this.state.innerHeight}px`}}>
                <div className="content">
                    <div className="headcontent">
                        <AppBar
                            title={
                                <div className="titlenav">
                                    <span className={modeview==='device'?"":""} onClick={this.titleNavClick.bind(this, 0)}>监控平台</span>
                                </div>
                            }
                            onLeftIconButtonTouchTap={this.menuevent}
                            style={{
                                backgroundColor: "#FFF",
                                paddingLeft:"0",
                                height : "64px",
                                paddingRight:"0",
                            }}
                            iconStyleLeft={{
                                marginTop: "0",
                                marginLeft: "0"
                            }}
                            iconElementLeft={<div className="logo" onClick={()=>{this.props.dispatch(ui_showmenu("addressbox"))}}><img src={Logo} /></div>}
                            className="appbar"
                        />
                    </div>

                    <div className="bodycontainer" style={{height: `${this.state.innerHeight-64}px`, overflow: "hidden"}}>

                        <Drawer
                            open={showmenu==="addressbox" || true}
                            containerStyle={{
                                top: "64px",
                                zIndex: 1000,
                                position: "inherit"
                            }}
                            width={400}
                            style={showmenu==="addressbox"?treestyle.drawopenstyle:treestyle.drawclosestyle}
                            >
                            <Tree />

                            <span className="myclose white" onClick={this.menuevent}></span>
                        </Drawer>

                        <div className="admincontainer">
                            <AdminContent />
                        </div>


                        <div className="warningtips">
                            <Warningtips/>
                        </div>


                        <Menu lesswidth={showmenu==="addressbox"?400:100} />

                    </div>
                </div>
                <Prompt />
            </div>
        );
    }
}

const mapStateToProps = ({app:{showmenu,showhistoryplay,showdistcluster,showhugepoints,modeview}}) => {
    return {showmenu,showhistoryplay,showdistcluster,showhugepoints,modeview};
};

const DummyComponentWithPProps = translate('warningbox')(Page);
export default connect(mapStateToProps)(DummyComponentWithPProps);
