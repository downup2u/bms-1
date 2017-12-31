/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import {Treebeard} from 'react-treebeard';

// import {ui_selcurdevice_request} from '../actions';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import TreeSearchBattery from './search/searchbattery';

import {
  ui_selcurdevice_request,
  searchbattery_request
} from '../actions';


class TreeSearch extends React.Component {

    constructor(props) {
        super(props);
    }

    onClickQuery(query){
      this.props.dispatch(searchbattery_request(query));
    }
    render(){
        const {g_devicesdb,searchresult_battery} = this.props;
        return (
            <div className="warningcontentPage">
                <TreeSearchBattery onClickQuery={this.onClickQuery.bind(this)} />
            </div>
        );
    }
}

const mapStateToProps = ({
    device:{
        g_devicesdb
    },
    searchresult:{
        searchresult_battery,
    }
}) => {
    return {g_devicesdb,searchresult_battery};
}

export default connect(mapStateToProps)(TreeSearch);
