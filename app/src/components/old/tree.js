/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import {Treebeard} from 'react-treebeard';
import RaisedButton from 'material-ui/RaisedButton';

import {
  mapmain_seldistrict,
  ui_selcurdevice,
  ui_changetreestyle,
  ui_settreefilter
} from '../actions';
import {filterTree,expandFilteredNodes} from '../util/filter';

class TreeExample extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.onToggle = this.onToggle.bind(this);
    }
    onChangeTreeStyle(stylename){
      this.props.dispatch(ui_changetreestyle(stylename));
    }
    onToggle(node, toggled){
        if(this.state.cursor){this.state.cursor.active = false;}
        node.active = true;
        if(!!node.children){
            node.toggled = toggled;
            let id = node.adcode;
            if(typeof id === 'string'){
              id = parseInt(id);
            }
            const {treeviewstyle} = this.props;
            if(treeviewstyle === 'byloc'){
              this.props.dispatch(mapmain_seldistrict({adcodetop:id,toggled}));
            }
            else{

            }

        }else{
            // node.toggled = toggled;
            let deviceid = node.name;
            const {devices} = this.props;
            const deviceitem = devices[deviceid];
            if(!!deviceitem && toggled){
              this.props.dispatch(ui_selcurdevice({DeviceId:deviceitem.DeviceId,deviceitem}));
            }
            console.log(deviceitem);//选择一个车辆
        }
        this.setState({ cursor: node });
    }


    onFilterMouseUp(e) {
        const filter = e.target.value.trim();
        if(!!filter){
          if(filter.length <= 3){
            return;
          }
        }
        this.props.dispatch(ui_settreefilter(filter));
    }

    render(){
        const {datatree} = this.props;
        return (
            <div style={{paddingTop:"20px", background:"rgb(33, 37, 43)"}} className="treePage">
                <div className="searchbox">
                    <div className="input-group">
                        <span className="input-group-addon">
                            <i className="fa fa-search"/>
                        </span>
                        <input className="form-control"
                               onKeyUp={this.onFilterMouseUp.bind(this)}
                               placeholder="根据车辆id搜索(至少三位)"
                               type="text"/>
                    </div>
                </div>
                <div className="btnlist">
                    <RaisedButton label="按地理位置" onTouchTap={this.onChangeTreeStyle.bind(this,'byloc')}/>
                    <RaisedButton label="按分组"  onTouchTap={this.onChangeTreeStyle.bind(this,'bygroup')}/>
                </div>
                <Treebeard
                    id="lefttree"
                    data={datatree}
                    onToggle={this.onToggle}
                />
            </div>
        );
    }
}
const mapStateToProps = ({device:{datatree:datatreeloc,treeviewstyle,treefilter,datatreegroup,devices}}) => {
  let datatree = treeviewstyle === 'byloc'?datatreeloc:datatreegroup;
  if(!!treefilter){
      const filtered = filterTree(datatree, treefilter);
      datatree = expandFilteredNodes(filtered, treefilter);
  }
  return {datatree,devices,treeviewstyle};
}

export default connect(mapStateToProps)(TreeExample);
