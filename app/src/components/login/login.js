import React, { Component } from 'react';
import { Field, reduxForm, Form, formValueSelector  } from 'redux-form';
import { connect } from 'react-redux';
import {loginsendauth_request,login_request} from '../../actions';
import NavBar from '../tools/nav.js';
import { withRouter } from 'react-router-dom';
import { set_weui } from '../../actions';
import './login.css';
import {
    required,
    phone,
    InputValidation,
    length4
} from "../tools/formvalidation-material-ui"
import Loginbg from "../../img/1.png";

export class PageForm extends Component {
    render(){
        const { handleSubmit,onClickLogin,pristine,submitting } = this.props;

        return (
            <Form
                className="loginForm"
                onSubmit={handleSubmit(onClickLogin)}
                >
                <div className="logo">
                    <span className="logoimg"></span>
                    <span className="logospan">CATL</span>
                </div>
                <div className="li" >
                    <Field
                        name="phonenumber"
                        id="phonenumber"
                        placeholder="用户名"
                        type="text"
                        component={ InputValidation }
                        validate={[ required, phone ]}
                    />
                </div>
                <div className="li">
                    <Field
                        name="password"
                        id="password"
                        placeholder="密码"
                        type="password"
                        component={ InputValidation }
                        validate={[ required ]}
                    />
                </div>

                <br/>
                <br/>

                <div className="submitBtn">
                    <span
                        className="btn Default"
                        disabled={pristine || submitting}
                        onClick={handleSubmit(onClickLogin)}
                        >
                        登录
                    </span>


                </div>
            </Form>
        )
    }
}

PageForm = reduxForm({
    form: 'LoginPageForm'
})(PageForm);

const inputconnect = formValueSelector('LoginPageForm');
PageForm = connect(
    state => {
        const phonenumber = inputconnect(state, 'phonenumber');
        return {
            phonenumber
        }
    }
)(PageForm)
PageForm = withRouter(PageForm);

export class Page extends Component {
    componentWillReceiveProps (nextProps) {
        console.log(nextProps);
        if(nextProps.loginsuccess && !this.props.loginsuccess){
            console.log("------->" + JSON.stringify(this.props.location));
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

        this.props.dispatch(login_request(payload));
        // this.props.history.push("./");
    }
    render(){
        return (
            <div className="loginPage AppPage"
                style={{
                    backgroundSize: "100% 100%",
                    height : `${window.innerHeight}px`
                }}>

                <div className="content">
                    <PageForm onClickLogin={this.onClickLogin}/>
                </div>
            </div>
        )
    }
}

const data = ({userlogin}) => { return userlogin; }
Page = connect(data)(Page);

export default Page;
