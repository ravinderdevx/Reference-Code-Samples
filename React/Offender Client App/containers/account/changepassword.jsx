import React, { Component } from 'react';
import { ValidatorForm } from 'react-form-validator-core';
import TextValidator from '../../shared/components/ui/form/text-validator';
import CircularProgress from '@material-ui/core/CircularProgress';
import { apiService } from '../../services/api.service';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LogoImage from '../../assets/images/logo.png';

// Custom components
import * as actions from '../../store/actions';
import Alert from 'react-bootstrap/Alert';
class ChangePassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            changepassword: {
                password: '',
                confirmNewPassword: '',
                errorMessage: ''
            },

        }
    }
    handleChange = (e) => {
        const { changepassword } = this.state;
        changepassword[e.target.name] = e.target.value;
        this.setState({ changepassword });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const { changepassword } = this.state;
        const { auth } = this.props;
        this.setState({ changepassword: { ...this.state.changepassword, loading: true } });

        const data = {
            Password: changepassword.password,
            ClientId: auth.user.ClientId,
            ModifyBy: auth.user.UserName,
        }
        apiService.post('CHANGEUSERPASSWORD', data).then(response => {
            if (response.Success) {
                apiService.logout();
                this.props.actions.logout();
                this.props.history.push('/account/login');
                this.props.actions.showAlert({ message: "Password has been successfully changed. Please login using new username and password.", variant: 'success' });
            }
            else {
                this.setState({ changepassword: { ...this.state.changepassword, password: '', confirmNewPassword: '', loading: false, errorMessage: response.Message } });
            }
        },
            error => this.setState(prevState => {
                this.setState({ changepassword: { ...this.state.changepassword,password: '', confirmNewPassword: '', loading: false, errorMessage: error } });
            })

        );
    }

    componentDidMount() {
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.changepassword.password) {
                return false;
            }
            return true;
        });
        ValidatorForm.addValidationRule('passwordMinLength', (value) => {
            if (value.trim() !== "") {
                if (value.trim().length < 6) {
                    return false;
                }
            }
            return true;
        });
    }

    hadleCloseAlert = (e) => {
        this.setState({ changepassword: { ...this.state.changepassword, errorMessage: "" } });
    }

    render() {
        const { changepassword } = this.state;
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
                                        changepassword.errorMessage &&
                                        <Alert variant="danger" onClose={() => this.hadleCloseAlert(false)} dismissible>{changepassword.errorMessage}</Alert>
                                    }
                                </div>
                                <div className="auth-box card">
                                    <div className="card-block">
                                        <div className="row m-b-20">
                                            <div className="col-md-12">
                                                <h3 className="text-center">Please enter a new password</h3>
                                            </div>
                                        </div>
                                        <div className="form-group form-primary">
                                            <TextValidator
                                                type="password"
                                                name="password"
                                                validators={['required', 'passwordMinLength']}
                                                errorMessages={['Password is Required.', 'Please enter at least 6 characters.']}
                                                value={changepassword.password}
                                                className="form-control input-sm"
                                                onChange={this.handleChange}
                                                placeholder="Password" />
                                            <span className="form-bar"></span>
                                        </div>
                                        <div className="form-group form-primary">
                                            <TextValidator
                                                onChange={this.handleChange}
                                                name="confirmNewPassword"
                                                type="password"
                                                validators={['required', 'isPasswordMatch']}
                                                errorMessages={['Confirm Password is Required.', 'Password Mismatch.']}
                                                value={changepassword.confirmNewPassword}
                                                className="form-control input-sm"
                                                placeholder="Confirm Password" />
                                            <span className="form-bar"></span>
                                        </div>
                                        <div className="row m-t-30">
                                            <div className="col-md-12">
                                                <button type="submit" className="btn btn-primary btn-md btn-block waves-effect waves-light text-center">Reset Password</button>
                                            </div>
                                        </div>
                                        <hr />
                                    </div>
                                    {changepassword.loading && <div className="loaderDiv"><div className="loader"><CircularProgress /></div></div>}
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
        auth: state.auth,
        alert: state.alert
    }
}
const mapDispatchToProps = dispatch => {
    return {
        actions: {
            loginSuccess: bindActionCreators(
                actions.loginSuccess,
                dispatch
            ),
            logout: bindActionCreators(
                actions.logout,
                dispatch
            ),
            showAlert: bindActionCreators(
                actions.showAlert,
                dispatch
            )
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
