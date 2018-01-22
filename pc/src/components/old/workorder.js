/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import {Treebeard} from 'react-treebeard';
import map from 'lodash.map';
// import {ui_selcurdevice_request} from '../actions';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import Deraultimg from "../img/1.png";
import "../css/message.css";
import TableComponents from "./table.js";
import Seltime from "./search/seltime.js";

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import TreeSearchreport from './search/searchreport_workorder';
import {
  ui_selcurdevice_request,
  searchbatteryalarm_request,

  getallworkorder_request,
  queryworkorder_request
} from '../actions';

class MessageAllDevice extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
      this.props.dispatch(getallworkorder_request({}));
    }

    onClickQuery(query){
        this.props.dispatch(queryworkorder_request(query));
    }

    render(){
        let {g_devicesdb,workorder_data,columns} = this.props;

        let delrow = (row)=>{
            //console.log(row);
            this.props.history.push(`/workorderinfo/${row._id}`);
        }
        let columns_action ={
            title: "操作",
            dataIndex: '',
            key: 'x',
            render: (text, row, index) => {
                return (<a onClick={()=>{delrow(row)}}>查看</a>);
            }
        }
        columns.push(columns_action);
        return (
            <div className="warningPage" style={{height : window.innerHeight+"px"}}>

                <div className="appbar">
                    <div className="title">工单查询</div>
                    <i className="fa fa-times-circle-o back" aria-hidden="true" onClick={()=>{this.props.history.push("./")}}></i>
                </div>
                <div className="TreeSearchBattery">
                    <TreeSearchreport onClickQuery={this.onClickQuery.bind(this)}/>
                </div>
                <div className="tablelist">
                    <TableComponents data={workorder_data} columns={columns}/>
                </div>
            </div>

        );
    }
}

//序号、工单号、营运公司、车牌号、故障地点、故障代码、部位、故障描述、责任人
const mapStateToProps = ({device:{g_devicesdb},workorder:{searchresult_workorder,workorders}}) => {
  const column_data = {
    "工单号" : "",
    "营运公司" : "",
    "车辆ID" : "",
    "故障地点" : "",
    "故障代码" : "",
    "部位" : "",
    "故障描述" : "",
    "责任人" : "",
  };
  const workorder_data = [];
  map(searchresult_workorder,(aid)=>{
    workorder_data.push(workorders[aid]);
  });

  let columns = map(column_data, (data, index)=>{
        let column_item = {
            title: index,
            dataIndex: index,
            key: index,
            render: (text, row, index) => {
                return <span>{text}</span>;
            },
            sorter:(a,b)=>{
              return a[data] > b[data] ? 1:-1;
            }
        };
        return column_item;
    })

    //console.log(workorder_data);
    return {g_devicesdb,workorders,searchresult_workorder, workorder_data, columns};
}
export default connect(mapStateToProps)(MessageAllDevice);
