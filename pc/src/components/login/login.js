import React, { Component } from 'react';
import { Field, reduxForm, Form, formValueSelector  } from 'redux-form';
import { connect } from 'react-redux';
import { login_request } from '../../actions';
import { withRouter } from 'react-router-dom';
import { set_weui } from '../../actions';
import '../../css/login.css';
import RaisedButton from 'material-ui/RaisedButton';
import Loginbg from "../../img/9.png";
import Loginlogo from "../../img/10.png";
import Config from "../../env/config";

import {
    required,
    phone,
    InputValidation,
    length4
    } from "../tools/formvalidation"

 class PageForm extends Component {
    render(){
        const { handleSubmit,onClickLogin,pristine,submitting } = this.props;

        return (
            <Form
                className="loginForm formStyle1"
                onSubmit={handleSubmit(onClickLogin)}
                >

                <div className="li" >
                    <Field
                        name="phonenumber"
                        id="phonenumber"
                        placeholder="请输入您的账号"
                        type="text"
                        component={ InputValidation }
                        validate={[ required ]}
                    />
                </div>
                <div className="li">
                    <Field
                        name="password"
                        id="password"
                        placeholder="请输入密码"
                        type="password"
                        component={ InputValidation }
                        validate={[ required ]}
                    />

                </div>

                <div className="submitBtn">
                    <RaisedButton
                        label="登录"
                        fullWidth={true}
                        primary={true}
                        disabled={pristine || submitting}
                        onClick={handleSubmit(onClickLogin)}
                    />
                </div>

                <div style={{textAlign: "center",lineHeight: "30px", color: "#FFF"}}>当前版本：{Config.appversion}</div>
            </Form>
        )
    }
}

PageForm = reduxForm({
    form: 'LoginPageForm'
})(PageForm);

// const inputconnect = formValueSelector('LoginPageForm');
// PageForm = connect(
//     state => {
//         const phonenumber = inputconnect(state, 'phonenumber');
//         return {
//             phonenumber
//         }
//     }
// )(PageForm)
// PageForm = withRouter(PageForm);
export class Page extends Component {
    componentWillReceiveProps (nextProps) {

        if(nextProps.loginsuccess && !this.props.loginsuccess){
          //search:?next=/devicelist
            var fdStart = this.props.location.search.indexOf("?next=");
            if(fdStart === 0){
                const redirectRoute = this.props.location.search.substring(6);
                this.props.history.replace(redirectRoute);
            }
            else{
                this.props.history.replace('/');
            }
            return;
        }
    }
    onClickReturn =()=>{
        this.props.history.goBack();
    }

    componentWillUnmount(){
        this.props.dispatch(set_weui({
            loading : {
                show : false
            },
        }));
    }

    onClickLogin = (values)=>{
        let payload = {
            username:values.phonenumber,
            password:values.password,
        };
        //console.log(`onClickLogin:${JSON.stringify(payload)}`);
        this.props.dispatch(login_request(payload));
    }
    render(){
        return (
            <div className="loginPage AppPage">
                <img src={Loginbg} className="bg" />
                <div className="content">
                    <div className="head">
                        <img src={Loginlogo} className="logo" />
                    </div>
                    <PageForm onClickLogin={this.onClickLogin}/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({userlogin}) => {
  return {...userlogin};
}
Page = connect(mapStateToProps)(Page);

export default Page;
