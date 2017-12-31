/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import {Treebeard} from 'react-treebeard';

// import {ui_selcurdevice} from '../actions';
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

class TreeSearch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            input1:0,
            input2 : 0,
            input3 : 0,
        };
    }
    handleChange = (e,key)=>{
        console.log(key);
        this.setState({input: key});
    }
    handleChange2 = (e,key)=>{
        console.log(key);
        this.setState({input2: key});
    }
    handleChange3 = (e,key)=>{
        console.log(key);
        this.setState({input3: key});
    }
    render(){
        return (
            <div className="warningPage">
                <div className="tit">电池包搜索</div>
                <div className="searchli">
                    <div>
                        <SelectField
                            value={0}
                            onChange={this.handleChange}
                            style={{minWidth:"100px", width: "33%"}}
                            value = {this.state.input1}
                            >
                            <MenuItem value={0} primaryText="选择分组名称" />
                            <MenuItem value={1} primaryText="Every Night" />
                            <MenuItem value={2} primaryText="Weeknights" />
                            <MenuItem value={3} primaryText="Weekends" />
                            <MenuItem value={4} primaryText="Weekly" />
                        </SelectField>
                    </div>
                    <div>
                        <SelectField
                            value={0}
                            onChange={this.handleChange2}
                            style={{minWidth:"100px", width: "33%"}}
                            value = {this.state.input2}
                            >
                            <MenuItem value={0} primaryText="请选择" />
                            <MenuItem value={1} primaryText="RDB编号" />
                            <MenuItem value={2} primaryText="BMU PACK号" />
                            <MenuItem value={3} primaryText="车辆PN料号" />
                        </SelectField>
                        <TextField
                            hintText="输入RDB编号"
                            style ={{width : "30%", marginTop: "-10px", minWidth:"100px" ,display: this.state.input2===1?"inline-block":"none"}}
                        />
                        <TextField
                            hintText="BMU PACK号"
                            style ={{width : "30%", marginTop: "-10px", minWidth:"100px" ,display: this.state.input2===2?"inline-block":"none"}}
                        />
                        <TextField
                            hintText="车辆PN料号"
                            style ={{width : "30%", marginTop: "-10px", minWidth:"100px" ,display: this.state.input2===3?"inline-block":"none"}}
                        />
                    </div>
                    <div>
                        <SelectField
                            value={0}
                            onChange={this.handleChange3}
                            style={{minWidth:"100px", width: "33%"}}
                            value = {this.state.input3}
                            >
                            <MenuItem value={0} primaryText="请选择" />
                            <MenuItem value={1} primaryText="警告代码" />
                            <MenuItem value={2} primaryText="故障代码" />
                        </SelectField>
                        <TextField
                            hintText="警告代码"
                            style ={{width : "30%", marginTop: "-10px", minWidth:"100px" ,display: this.state.input3===1?"inline-block":"none"}}
                        />
                        <TextField
                            hintText="故障代码"
                            style ={{width : "30%", marginTop: "-10px", minWidth:"100px" ,display: this.state.input3===2?"inline-block":"none"}}
                        />
                    </div>
                </div>
                <div className="searchbtn"><RaisedButton label="查询" primary={true} fullWidth={true} /></div>

                <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHeaderColumn>车辆号</TableHeaderColumn>
                        <TableHeaderColumn>报警时间</TableHeaderColumn>
                        <TableHeaderColumn>报警等级</TableHeaderColumn>
                        <TableHeaderColumn>报警内容</TableHeaderColumn>
                        <TableHeaderColumn>操作</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableRowColumn>车辆1</TableRowColumn>
                        <TableRowColumn>2017-09-09 12:20:34</TableRowColumn>
                        <TableRowColumn>严重</TableRowColumn>
                        <TableRowColumn>这里是警告内容</TableRowColumn>
                        <TableRowColumn><RaisedButton label="操作按钮" primary={true} fullWidth={true} /></TableRowColumn>
                      </TableRow>
                    </TableBody>
                  </Table>
            </div>

        );
    }
}
export default connect()(TreeSearch);
