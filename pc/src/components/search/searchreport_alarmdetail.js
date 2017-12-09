/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import map from 'lodash.map';
import Seltime from './seltime.js';
import { Input,Select, AutoComplete,Button } from 'antd';
import MultiSelect from 'react-select';
import moment from 'moment';

import 'react-select/dist/react-select.css';

moment.locale('zh-cn');

const InputGroup = Input.Group;
const Option = Select.Option;

//sample:https://github.com/JedWatson/react-select/blob/master/examples/src/components/Multiselect.js


class TreeSearchBattery extends React.Component {
    constructor(props) {
        super(props);
        let warninglevel = props.warninglevel || "-1";
        this.state = {
            alarmlevel: warninglevel,
            startDate:moment(moment().format('YYYY-MM-DD 00:00:00')),
            endDate:moment(moment().format('YYYY-MM-DD 23:59:59')),
            selectedvalue: [],
          };
    }
    onSelectChange (value) {
      let sz = value.split(',');
  		console.log(`${JSON.stringify(sz)}`);
  		this.setState({ selectedvalue:sz });
      this.props.setListColumnFields(sz);
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
        this.props.onClickExport();
      }
    }
    onClickQuery=()=>{
      let query = {
        querydevice:{},
        queryalarm:{}
      };


      query.queryalarm['startDate'] = this.state.startDate.format('YYYY-MM-DD HH:mm:ss');
      query.queryalarm['endDate'] = this.state.endDate.format('YYYY-MM-DD HH:mm:ss');
      if(this.state.alarmlevel !== '-1'){
        query.queryalarm['warninglevel'] = parseInt(this.state.alarmlevel);
      }

      console.log(`【searchreport】查询条件:${JSON.stringify(query)}`);
      if(!!this.props.onClickQuery){
        this.props.onClickQuery({query});
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
                <div className="i">
                    <MultiSelect
                        closeOnSelect={true}
                        multi
                        onChange={this.onSelectChange.bind(this)}
                        options={this.props.selectoptions}
                        placeholder="选择报警字段"
                        simpleValue
                        value={this.state.selectedvalue}
                      />
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
