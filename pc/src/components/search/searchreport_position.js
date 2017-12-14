/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import Seltime from './seltime.js';
import { Button } from 'antd';
import moment from 'moment';
moment.locale('zh-cn');


class TreeSearchBattery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate:moment(moment().format('YYYY-MM-DD 00:00:00')),
            endDate:moment(moment().format('YYYY-MM-DD 23:59:59')),
        };
    }


    onChangeSelDate(startDate,endDate){
      this.setState({
        startDate,
        endDate
      });
    }

    onClickExport=()=>{
      if(!!this.props.onClickExport){
        this.props.onClickExport(this.getQueryObj());
      }
    }
    getQueryObj = ()=>{
      let query = {};
      query['GPSTime'] = {
        $gte: this.state.startDate.format('YYYY-MM-DD HH:mm:ss'),
        $lte: this.state.endDate.format('YYYY-MM-DD HH:mm:ss'),
      };
      return query;
    }


    onClickQuery=()=>{
      if(!!this.props.onClickQuery){
        this.props.onClickQuery(this.getQueryObj());
      }
    }
    render(){
        return (
            <div className="searchreport" style={{textAlign: "center"}}>
                <div className="i">

                    <Seltime  startDate = {this.state.startDate}
                      endDate = {this.state.endDate}
                     onChangeSelDate={this.onChangeSelDate.bind(this)}/>

                </div>
                <div className="b">
                    <Button type="primary" icon="search" onClick={this.onClickQuery}>查询</Button>
                    <Button icon="download" onClick={this.onClickExport}>导出结果</Button>
                </div>
            </div>

        );
    }
}
export default connect()(TreeSearchBattery);
