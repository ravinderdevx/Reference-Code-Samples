import React, { Component } from 'react';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as actions from '../../store/actions';
import { bindActionCreators } from 'redux';
import { apiService } from '../../services/api.service';
import { Link } from "react-router-dom";
import CurrencyFormatter from '../../shared/components/functional/CurrencyFormatter';


class AccountSummaries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountsummaries: [],
            loading: true
        }

    }

    getAccountSummaries = () => {
        const { auth } = this.props;
        apiService.post('GETACCOUNTSUMMARIES', { ClientId: auth.user.ClientId }).then(response => {
            if (response.Success && response.AccountSummaries) {
                this.setState({ accountsummaries: response.AccountSummaries });
            }
            this.setState({ loading: false });
        }, error => {
            this.props.actions.showAlert({ message: error, variant: 'error' });
            this.setState({ loading: false });
        });
    }

    componentDidMount() {
        this.getAccountSummaries();
    }
    render() {

        const { accountsummaries, loading } = this.state;
        return (
            <div className="card">
                <div className="card-header summary">
                    <div className="icon">
                        <i className="fa fa-usd" aria-hidden="true"></i>
                    </div>
                    Account Summary <small>Current balances in your financial accounts</small>
                    <div className="arrowRight"><Link className="active" to={`/Financial`}><i className="fa fa-arrow-right"></i></Link></div>
                </div>
                <div className="card-body">
                    <table className="table tableBodyScroll">
                        <tbody>
                            {!loading && (accountsummaries.length > 0 ? accountsummaries.map((accountsummaries, index) =>
                                <tr key={index}>
                                    <td>{accountsummaries.Description}</td>
                                    <td className="text-right"><CurrencyFormatter currency={accountsummaries.Balance} /></td>
                                </tr>
                            )
                                :
                                <tr>
                                    <td>No active financial accounts</td>
                                </tr>)}
                        </tbody>
                    </table>
                    {loading && <div className="loaderDiv"><div className="loader"><CircularProgress /></div></div>}
                </div>

            </div>

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
            showAlert: bindActionCreators(
                actions.showAlert,
                dispatch

            )
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountSummaries);