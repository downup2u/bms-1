/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import { connect } from 'react-redux';
// import "onsenui/css/onsenui.min.css";
// import "onsenui/css-components-src/src/onsen-css-components.css";
// import ons from 'onsenui';
import {SpeedDial,Fab,SpeedDialItem,Page} from 'react-onsenui';
import map from 'lodash.map';
import Draggable from 'react-draggable';
import { withRouter } from 'react-router-dom';
import {ui_showmenu} from '../../actions';
let resizetime = null;


class Menu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            innerWidth : window.innerWidth,
            innerHeight : window.innerHeight,
            dragx : window.innerWidth-100,
            dragy : window.innerHeight-160,
            showitemtext : {
                power : '',
                history : '',
                address : '',
            }
        };
    }
    componentWillMount() {
        window.onresize = ()=>{
            window.clearTimeout(resizetime);
            resizetime = window.setTimeout(()=>{
                this.setState({
                    innerWidth: window.innerWidth,
                    innerHeight: window.innerHeight,
                    dragx : window.innerWidth-100,
                    dragy : window.innerHeight-160,
                });

            }, 10)
        }
    }
    onClickMenu(menuitemstring){
        this.props.dispatch(ui_showmenu(menuitemstring));
    }
    showtext(index){
        let showstyle = {
            power : '',
            history : '',
            address : '',
        }
        showstyle[index] = "show";
        this.setState({showitemtext: {...showstyle}});
    }
    hidetext(index){
        let showstyle = {
            power : '',
            history : '',
            address : '',
        }
        this.setState({showitemtext: {...showstyle}});
    }

    renderFixed() {
        const menuData = {
            power : {name : "电池包", icon : "fa fa-microchip", click : ()=>{this.props.history.push("/device")}},
            // history : {name : "历史报警", icon : "fa fa-history", click : this.onClickMenu.bind(this,'warningbox')},
            address : {name : "地理位置", icon : "fa fa-globe", click : this.onClickMenu.bind(this,'addressbox')}
        }
        return (
            <SpeedDial position='bottom right' className="box no-cursor">
                <Fab className="menuMain cursor" >
                    <i className="fa fa-bars" aria-hidden="true"></i>
                </Fab>
                {map(menuData, (menu, index)=>{
                    return (

                        <SpeedDialItem
                            key={index}
                            onClick={menu.click}
                            className="menuitem"
                            style={{
                                marginRight : "-6px",
                                width: "50px",
                                height: "50px",
                                lineHeight: "50px",
                                borderRadius: "60px",
                                background: "#4283cc",
                                textAlign:"center",
                            }}
                            onMouseOver={this.showtext.bind(this,index)}
                            onMouseOut={this.hidetext.bind(this,index)}
                        >
                            <i className={menu.icon} aria-hidden="true" style={{fontSize:"20px"}}></i>
                            <span className={`name ${this.state.showitemtext[index]}`}>{menu.name}</span>
                        </SpeedDialItem>

                    )
                })}
            </SpeedDial>
        );
    }

    eventLogger = (e: MouseEvent, data: Object) => {


    };

    menuclick(name) {
        //ons.notification.confirm(`Do you want to share on "${name}"?`);
    }

    onStop(e, ui) {

        this.setState({
            dragx : ui.x,
            dragy : ui.y,
        });
    }

    render() {
        const dragHandlers = {onStop: this.onStop.bind(this)};
        return (
            <Draggable
                defaultPosition={{x: this.state.innerWidth-100, y: this.state.innerHeight-100}}
                position={{x: this.state.dragx, y: this.state.dragy}}

                {...dragHandlers}
                >
                <div style={{display:"none"}}>
                    <Page renderFixed={this.renderFixed.bind(this)}></Page>
                </div>
            </Draggable>
        );
    }
};
Menu = withRouter(Menu);
export default connect()(Menu);
