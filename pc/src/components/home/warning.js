/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import TreeSearchBatteryAlarmSingle from './search/searchbatteryalarmsingle';
import {
  searchbatteryalarmsingle_request
} from '../actions';
import map from 'lodash.map';

class Page extends React.Component {
    constructor(props){
        super(props);
    }
    handleChange = (event, index, value) => this.setState({value});

    onClickQuery(query){
      const {curseldeviceid} = this.props;
      query.querydevice = query.querydevice || {};
      query.querydevice._id = curseldeviceid;
      this.props.dispatch(searchbatteryalarmsingle_request(query));
    }

    onRowSelection(selstring){

      // this.props.dispatch(ui_selcurdevice_result({DeviceId}));
    }
    render(){
        const {alarms,curseldeviceid,searchresult_alaramsingle} = this.props;
        return (
            <div className="warningPage">
                <div className="tit">车辆：{curseldeviceid} 历史报警</div>
                <TreeSearchBatteryAlarmSingle onClickQuery={this.onClickQuery.bind(this)}/>
                <Table onRowSelection={this.onRowSelection.bind(this)}>
                    <TableHeader>
                      <TableRow selectable={false}>
                        <TableHeaderColumn>报警时间</TableHeaderColumn>
                        <TableHeaderColumn>报警内容</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        map(searchresult_alaramsingle,(alarmid,key)=>{
                          const alarm =alarms[alarmid];
                          if(!!alarm){
                            return (
                              <TableRow key={key} selectable={false}>
                              <TableRowColumn>{alarm.DataTime}</TableRowColumn>
                              <TableRowColumn>{alarm.Alarm}</TableRowColumn>
                              </TableRow>)
                          }

                        })
                      }

                    </TableBody>
                  </Table>
            </div>
        );
    }
}
const mapStateToProps = (
  {
    searchresult:
    {
      curseldeviceid,
      searchresult_alaramsingle,
      alarms
    }
  }) => {

  return {alarms,curseldeviceid,searchresult_alaramsingle};
}


export default connect(mapStateToProps)(Page);
