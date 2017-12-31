/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import {
  carmapshow_createmap,
  carmapshow_destorymap,
} from '../../actions';
const divmapid = 'mapmain';
class Page extends React.Component {
  componentWillMount () {
    console.log('地图---->componentWillMount---------');
  }
  componentWillUnmount(){
    console.log('地图---->componentWillUnmount---------');
    this.props.dispatch(carmapshow_destorymap({divmapid}));
  }
  componentDidMount () {
    console.log('地图---->componentDidMount---------');
    this.props.dispatch(carmapshow_createmap({divmapid}));
 }
 render() {
     const height = this.props.height || window.innerHeight+"px";
     console.log('地图---->render---------height:'+height);
     return (
         <div className="AdminContent">
             <div id={divmapid} style={{height:height}}/>
         </div>
     );
 }
}

export default connect()(Page);
