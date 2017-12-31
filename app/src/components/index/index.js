/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import './index.css';
import Avatar from "../../img/2.png";
import Userlnk from "../../img/11.png";
import Setting from "../../img/12.png";
import Searchimg from "../../img/22.png";

import Footer from "./footer.js";
import Collectiondevice from "../collectiondevice";

import {ui_index_selstatus} from '../../actions';

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            innerWidth : window.innerWidth,
            searchonfocus : false
        };
    }
    indexnavclick=(v)=>{
        this.props.dispatch(ui_index_selstatus(v));
        console.log(v);
        //this.setState({selstatus : v});
    }
    onfocusinput=()=>{
        this.setState({searchonfocus : true});
    }
    onblurinput=()=>{
        this.setState({searchonfocus : false})
    }
    render() {
        const {showmenu,showhistoryplay,showdistcluster,showhugepoints,p} = this.props;
        const pushurl = (name)=>{
            this.props.history.push(name);
        }
        const height =  window.innerHeight - 67.08- 65- 52;
        return (
            <div className="indexPage AppPage"
                style={{
                    background: "none",
                    minHeight : `${window.innerHeight}px`,
                    pointerEvents: "none",

                }}>
                <div className="navhead">
                    <a className="userlnk" onClick={()=>{this.props.history.push("/usercenter")}}><img src={Userlnk} /></a>
                </div>
                <div className="indexnav">
                    <span className={this.props.selstatus===0?"sel":''} onClick={this.indexnavclick.bind(this,0)}>所有车辆</span>
                    <span className={this.props.selstatus===1?"sel":''} onClick={this.indexnavclick.bind(this,1)}>我的收藏</span>
                </div>
                {
                    this.props.selstatus===0 &&
                        <div className="content" style={{pointerEvents: "none",background : "none"}}>

                        </div>
                }
                {
                    this.props.selstatus===1 &&
                        <Collectiondevice />
                }
                <Footer sel={0} />
            </div>
        );
    }
}

const mapStateToProps = ({app}) => {
    return {selstatus:app.selstatus};
}
export default connect(mapStateToProps)(Page);
