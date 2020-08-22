import React, { Component } from 'react';
import { ValidatorForm } from 'react-form-validator-core';
import TextValidator from '../../shared/components/ui/form/text-validator';
import CircularProgress from '@material-ui/core/CircularProgress';
import { apiService } from '../../services/api.service';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../store/actions';
import Alert from 'react-bootstrap/Alert';
import LogoImage from '../../assets/images/logo.png'

    
class Login extends Component {
    state = {
        loginform: {
            username: "",
            password: "",
            loading: false,
            errorMessage: "",
        },
    }
    handleChange = (e) => {
        const { loginform } = this.state;
        loginform[e.target.name] = e.target.value;
        this.setState({ loginform });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const { loginform } = this.state;
        this.setState({ loginform: { ...this.state.loginform, loading: true } });
        apiService.login(loginform.username, loginform.password)
            .then(response => {
                if (response.Success) {
                    this.props.actions.loginSuccess(response);
                    this.setState({ loginform: { ...this.state.loginform, loading: false, username: "", password: "", errorMessage: "" } });
                    if (response.PasswordExpiration) {
                        this.props.history.push('/account/changepassword');
                    }
                    else {
                        this.props.history.push('/')
                    }
                }
                else {
                    this.setState({ loginform: { ...this.state.loginform, loading: false, username: "", password: "", errorMessage: response.Message } });
                }

            },
                error => this.setState(prevState => {
                    this.setState({ loginform: { ...this.state.loginform, loading: false, errorMessage: error } });
                })

            );
    }

    hadleCloseAlert = (e) => {
        this.setState({ loginform: { ...this.state.loginform, errorMessage: "" } });
    }


    render() {
        const { loginform } = this.state;
        return (
            <section className="login-block">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">

                            <ValidatorForm className="md-float-material form-material" onSubmit={this.handleSubmit}>
                                <div className="text-center">
                                    <img src={LogoImage} alt="Logo" />
                                </div>
                                <div className="errorMsg">
                                    {
                                        loginform.errorMessage &&
                                        <Alert variant="danger" onClose={() => this.hadleCloseAlert(false)} dismissible>{loginform.errorMessage}</Alert>
                                    }
                                </div>
                                <div className="auth-box card">
                                    <div className="card-block">
                                        <div className="row m-b-20">
                                            <div className="col-md-12">
                                                <h3 className="text-center">Sign In</h3>
                                            </div>
                                        </div>
                                        <div className="form-group form-primary">
                                            <TextValidator
                                                onChange={this.handleChange}
                                                name="username"
                                                type="text"
                                                validators={['required']}
                                                errorMessages={['UserName is Required.']}
                                                value={loginform.username}
                                                className="form-control"
                                                placeholder="UserName" />
                                            <span className="form-bar"></span>
                                        </div>
                                        <div className="form-group form-primary">
                                            <TextValidator
                                                onChange={this.handleChange}
                                                name="password"
                                                type="password"
                                                validators={['required']}
                                                errorMessages={['Password is Required.']}
                                                value={loginform.password}
                                                className="form-control"
                                                placeholder="Password" />
                                            <span className="form-bar"></span>
                                        </div>
                                        <div className="row m-t-30">
                                            <div className="col-md-12">
                                                <button type="submit" className="btn btn-primary btn-md btn-block waves-effect waves-light text-center">Sign in</button>
                                            </div>
                                        </div>
                                        <hr />
                                    </div>
                                    {loginform.loading && <div className="loaderDiv"><div className="loader"><CircularProgress /></div></div>}
                                </div>
                            </ValidatorForm>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}
const mapDispatchToProps = dispatch => {
    return {
        actions: {
            loginSuccess: bindActionCreators(
                actions.loginSuccess,
                dispatch
            )
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);
