import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propTypes, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { Card, CardActions } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import { Notification, translate, } from 'admin-on-rest';
import {systemLoadAction,systemSaveAction} from './action';

import Paper from 'material-ui/Paper';
import renderGroupEdit from './devicegroupedit';

import lodashget from 'lodash.get';
import renderSelect from './asyncselect';
// see http://redux-form.com/6.4.3/examples/material-ui/
const renderInput = ({ meta: { touched, error } = {}, input: { ...inputProps }, ...props }) =>
    <TextField
        errorText={touched && error}
        {...inputProps}
        {...props}
        fullWidth
    />;

class SystemConfig extends Component {


    render() {
        const { handleSubmit, submitting, translate } = this.props;
        return (
                <div >
                    <Card >
                        <form onSubmit={handleSubmit(this.props.onClickSave)}>
                            <div >
                              <div style={{padding: "15px 15px 0 15px"}}>
                                  <Field
                                      name="mappopfields"
                                      component={renderSelect}
                                      placeholder={`选择弹框的字段列表`}
                                  />
                              </div>
                              <div  style={{padding: "15px 15px 0 15px"}}>
                                  <Field
                                      name="mappopclusterfields"
                                      component={renderSelect}
                                      placeholder={`选择聚合点弹框的字段列表`}
                                  />
                              </div>
                              <div  style={{paddingTop: "15px 15px 0 15px"}}>
                                  <Field
                                      name="mapdetailfields"
                                      component={renderGroupEdit}
                                      placeholder={`编辑车辆详情显示字段列表`}
                                  />
                              </div>
                                <div style={{padding: "15px 15px 0 15px"}}>
                                    <Field
                                        name="warningrulelevel0"
                                        component={renderInput}
                                        floatingLabelText={`报警规则设置(高)`}
                                    />
                                </div>
                                <div style={{padding: "15px 15px 0 15px"}}>
                                    <Field
                                        name="warningrulelevel1"
                                        component={renderInput}
                                        floatingLabelText={`报警规则设置(中)`}
                                    />
                                </div>
                                <div style={{padding: "15px 15px 0 15px"}}>
                                    <Field
                                        name="warningrulelevel2"
                                        component={renderInput}
                                        floatingLabelText={`报警规则设置(低)`}
                                    />
                                </div>
                            </div>
                            <CardActions>
                                <RaisedButton type="submit" primary disabled={submitting} label={`保存`} fullWidth />
                            </CardActions>
                        </form>
                    </Card>
                    <Notification />
                </div>
        );
    }
}


//==========================================
let SystemconfigForm = reduxForm({
    form: 'systemconfig',
})(SystemConfig);

// SystemconfigForm = connect(
//   ({systemconfig},props)=>{
//       console.log(`systemconfig form ==>${JSON.stringify(systemconfig)}`)
//       let retboj = {
//         initialValues:{
//             warningrulelevel0:lodashget(systemconfig,'warningrulelevel0',''),
//             warningrulelevel1:lodashget(systemconfig,'warningrulelevel1',''),
//             warningrulelevel2:lodashget(systemconfig,'warningrulelevel2',''),
//             mappopfields:lodashget(systemconfig,'mappopfields',[]),
//             mapdetailfields:lodashget(systemconfig,'mapdetailfields',[]),
//         },
//       };
//       console.log(`systemconfig retboj ==>${JSON.stringify(retboj)}`)
//       return retboj;
//   }
// )(SystemconfigForm);

class Page extends Component {
  componentDidMount () {
    const {dispatch} = this.props;
    systemLoadAction({},dispatch);
  }

  systemSave = (values) => {
      const {dispatch} = this.props;
      systemSaveAction(values,dispatch);
  }

  render(){
      return (
          <div>
              <SystemconfigForm onClickSave={this.systemSave} initialValues={this.props.initialValues} enableReinitialize={true}/>
          </div>

      )
  }
}

const mapStateToProps = ({systemconfig}) => {
  // console.log(`systemconfig form ==>${JSON.stringify(systemconfig)}`)
  let retboj = {

    initialValues:{
        warningrulelevel0:lodashget(systemconfig,'warningrulelevel0',''),
        warningrulelevel1:lodashget(systemconfig,'warningrulelevel1',''),
        warningrulelevel2:lodashget(systemconfig,'warningrulelevel2',''),
        mappopfields:lodashget(systemconfig,'mappopfields',[]),
        mappopclusterfields:lodashget(systemconfig,'mappopclusterfields',[]),
        mapdetailfields:lodashget(systemconfig,'mapdetailfields',[]),
    },
  };
  // console.log(`systemconfig retboj ==>${JSON.stringify(retboj)}`)
  return retboj;
}
Page = connect(mapStateToProps)(Page);

export default Page;
