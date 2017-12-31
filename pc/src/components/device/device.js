/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';

import map from 'lodash.map';


import "../css/message.css";
import TableComponents from "../controls/table.js";



import TreeSearchreport from '../search/searchreport';
import {
  searchbatteryalarm_request
} from '../actions';
import get from 'lodash.get';

class MessageAllDevice extends React.Component {

    constructor(props) {
        super(props);
    }
    onClickQuery(query){
      const startDate = get(query,'query.queryalarm.startDate','');
      const endDate = get(query,'query.queryalarm.endDate','');
      // 【searchreport】查询条件:{"querydevice":{},"queryalarm":{"startDate":"2017-11-18 10:51:10","endDate":"2017-11-25 10:51:10","warninglevel":0}}
      let queryalarm = {};
      queryalarm['DataTime'] = {
        $gte: startDate,
        $lte: endDate,
      };
      console.log(`查询报表报警信息:${JSON.stringify(queryalarm)}`);
      this.props.dispatch(searchbatteryalarm_request({query:queryalarm}));
    }

    render(){
        const {alaram_data,columns} = this.props;

        return (
            <div className="warningPage" style={{height : window.innerHeight+"px"}}>

                <div className="appbar">
                    <i className="fa fa-angle-left back" aria-hidden="true" onClick={()=>{this.props.history.push("./")}}></i>
                    <div className="title">查询报表</div>
                </div>
                <div className="TreeSearchBattery">
                    <TreeSearchreport onClickQuery={this.onClickQuery.bind(this)} warninglevel={"-1"} />
                </div>
                <div className="tablelist">
                    <TableComponents data={alaram_data} columns={columns}/>
                </div>
            </div>

        );
    }
}


const mapStateToProps = ({device:{g_devicesdb},searchresult:{searchresult_alaram,alarms}}) => {
    const alaram_data = [{
        key: 1,
        "车辆ID" : "001",
        "PACK号码" : "pack001",
        "PDB编号" : "pdb001",
        "料号" : "liaohao001",
        "省市区" : "江苏常州武进区"
    },
    {
        key: 2,
        "车辆ID" : "002",
        "PACK号码" : "pack002",
        "PDB编号" : "pdb002",
        "料号" : "liaohao002",
        "省市区" : "江苏常州武进区"
    },
    {
        key: 3,
        "车辆ID" : "003",
        "PACK号码" : "pack003",
        "PDB编号" : "pdb003",
        "料号" : "liaohao003",
        "省市区" : "江苏常州武进区"
    }];

    let columns = map(alaram_data[0], (data, index)=>{
        return {
            title: index,
            dataIndex: index,
            key: index,
            render: (text, row, index) => {
                return <span>{text}</span>;
            }
        }
    })
    let delrow = (row)=>{
        console.log(row);
    }
    let columns_action ={
        title: "操作",
        dataIndex: '',
        key: 'x',
        render: (text, row, index) => {
            return (<a onClick={()=>{delrow(row)}}>删除</a>);
        }
    }
    columns.push(columns_action);

    return {g_devicesdb,alarms,searchresult_alaram, alaram_data, columns};
}
export default connect(mapStateToProps)(MessageAllDevice);
