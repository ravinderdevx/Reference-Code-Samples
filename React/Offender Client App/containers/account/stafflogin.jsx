import { Component } from 'react';
import { apiService } from '../../services/api.service';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { history } from '../../../src/helpers/history';
// Custom components
import * as actions from '../../store/actions';

class StaffLogin extends Component {
    
    getStaffLogin = () => {
       
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let StaffToken =  params.get('StaffToken')
        apiService.stafflogin(StaffToken).then(response => {
            if (response.Success) {
                this.props.actions.loginSuccess(response);
                history.push('/');
                console.log(this.props.auth)
            }
            else {
                this.props.history.push('/account/login');
                this.props.actions.showAlert({ message:response.Message , variant: 'error' });
               
            }
        },
        error => {
            this.props.history.push('/account/login');
            this.props.actions.showAlert({ message: error, variant: 'error' });
        });  
    
    }

    componentDidMount() {
        const { auth } =this.props;
        if(auth){
            apiService.logout();
            this.props.actions.logout();
        }
        this.getStaffLogin();
    }


    render() {
        return  null;
    }
}
const mapStateToProps = state => {
    return {
        alert: state.alert,
        auth: state.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: {
            logout: bindActionCreators(
                actions.logout,
                dispatch
            ),
            hideAlert: bindActionCreators(
                actions.hideAlert,
                dispatch
            ),
            showAlert: bindActionCreators(
                actions.showAlert,
                dispatch

            ),loginSuccess: bindActionCreators(
                actions.loginSuccess,
                dispatch
            )
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(StaffLogin);
