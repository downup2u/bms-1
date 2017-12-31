import React from 'react';
import {connect} from 'react-redux';
import {Treebeard,decorators} from '../controls/react-treebeard-ex/src/index.js';
import treestyle from './treestyle.js';
import HeaderCo from './treeheader';
import map from 'lodash.map';
import {
    ui_selcurdevice_request,
} from '../../actions';

const treeviewstyle = 'bysearchresult';
decorators.Header = HeaderCo;

class Tree extends React.Component {
    // constructor(props){
    //     // super(props);
    //     // this.state = {};
    //     // this.onToggle = this.onToggle.bind(this);
    // }

    // onToggle(node, toggled){
    //     // if(this.state.cursor){this.state.cursor.active = false;}
    //     // node.active = true;
    //     // if(node.type === 'device'){
    //     //   let deviceid = node.name;
    //     //   const {g_devicesdb} = this.props;
    //     //   const deviceitem = g_devicesdb[deviceid];
    //     //   if(!!deviceitem){
    //     //     console.log(`sel devid:${deviceitem.DeviceId}`);
    //     //     this.props.dispatch(ui_selcurdevice_request({DeviceId:deviceitem.DeviceId,deviceitem}));
    //     //   }
    //     // }
    //     // this.setState({ cursor: node });
    // }
    onclick(id){
        this.props.dispatch(ui_selcurdevice_request({DeviceId:id}));
    }
    render(){
        const {treesearchlist} = this.props;
        return (
          <div className="treesearchlist">
            {map(treesearchlist, (id, key)=>{
              return <div key={key} onClick={this.onclick.bind(this, id)}>{id}</div>
            })}
          </div>
      );
  }
}

const mapStateToProps = ({device:{treesearchlist}}) => {
  return {treesearchlist};
}

export default connect(mapStateToProps)(Tree);
