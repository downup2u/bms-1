/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import map from 'lodash.map';
import Seltime from './seltime.js';
import { Input,Select, AutoComplete,Button } from 'antd';

import moment from 'moment';
moment.locale('zh-cn');

const InputGroup = Input.Group;
const Option = Select.Option;

class TreeSearchBattery extends React.Component {
    constructor(props) {
        super(props);

        let warninglevel = "-1";
        if(!!props.query.warninglevel){
          if(props.query.warninglevel = '高'){
            warninglevel = '0';
          }
          else if(props.query.warninglevel = '中'){
            warninglevel = '1';
          }
          else if(props.query.warninglevel = '低'){
            warninglevel = '2';
          }
        }
        let startDate = moment(moment().format('YYYY-MM-DD 00:00:00'));
        let endDate = moment(moment().format('YYYY-MM-DD 23:59:59'));
        if(!!props.query.DataTime){
          startDate = moment(props.query.DataTime['$gte']);
          endDate = moment(props.query.DataTime['$lte']);
        }

        this.state = {
            alarmlevel: warninglevel,
            startDate,
            endDate
          };
    }

    onChangeSelDate(startDate,endDate){
      this.setState({
        startDate,
        endDate
      });
    }

    onChange_alarmlevel(alarmlevel){
      this.setState({alarmlevel});
    }

    onClickExport=()=>{
      if(!!this.props.onClickExport){
        this.props.onClickExport(this.getQueryObj());
      }
    }
    getQueryObj = ()=>{
      let query = {};
      query['DataTime'] = {
        $gte: this.state.startDate.format('YYYY-MM-DD HH:mm:ss'),
        $lte: this.state.endDate.format('YYYY-MM-DD HH:mm:ss'),
      };
      if(this.state.alarmlevel === '0'){
        query['warninglevel'] = '高';
      }
      else if(this.state.alarmlevel === '1'){
        query['warninglevel'] = '中';
      }
      else if(this.state.alarmlevel === '2'){
        query['warninglevel'] = '低';
      }
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

                    <Select defaultValue={this.state.alarmlevel} onChange={this.onChange_alarmlevel.bind(this)}>
                        <Option value={"-1"}>选择警告级别</Option>
                        <Option value={"0"} >严重报警</Option>
                        <Option value={"1"} >紧急报警</Option>
                        <Option value={"2"} >一般报警</Option>
                    </Select>
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
