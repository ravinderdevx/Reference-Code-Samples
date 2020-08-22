import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import FinancialGrid from '../financial/financial_grid';
import { history } from "../../helpers/history";

import { apiService } from "../../services/api.service";
import * as actions from "../../store/actions";
import { bindActionCreators } from "redux";

import TransactionDetail from '../financial/transaction_details';

import TransactionModal from '../../shared/components/ui/modal/transaction-modal';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`
    };
}

class FinancialTabs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            classes: makeStyles(theme => ({
                root: {
                    flexGrow: 1,
                    backgroundColor: theme.palette.background.paper
                }
            }
            )),
            isLoading: true,
            openAccountDetail: [],
            closedAccountDetail: [],
            transactionDetail: [],
            showTransactionDetail: false,
            showModal: false
        };
    }
    handleChange = (event, newValue) => {
        this.setState({ value: newValue });
    };

    handleShowAlert = data => {
        this.props.actions.showAlert(data);
    };
    GetClientResidentAccounts = (Closed) => {
        this.setState({ isLoading: true });
        const { auth } = this.props;
        let data = { ClientId: auth.user.ClientId, Closed: Closed };
        apiService.post('GETCLIENTRESIDENTFINANCIALACCOUNTS', data).then(
            response => {
                if (response.Success && response.ClientResidentFinancialAccounts) {
                    var ClientResidentFinancialAccounts = response.ClientResidentFinancialAccounts;
                    if (Closed) {
                        this.setState({ closedAccountDetail: ClientResidentFinancialAccounts });
                    }
                    else {
                        this.setState({ openAccountDetail: ClientResidentFinancialAccounts });
                    }
                }
                this.setState({ isLoading: false });
            },
            error => {
                this.setState({ isLoading: false });
                this.props.actions.showAlert({ message: error, variant: "error" });
            }
        );
    };
    GetOpenAccount = () => {
        this.GetClientResidentAccounts(false);
    }
    GetClosedAccount = () => {
        this.GetClientResidentAccounts(true);
    }

    openGridTransactionDetail = (e, event) => {
        
        let data = { ClientResidentFinancialAccountId: event.ClientResidentFinancialAccountId, Id: -1 };
        this.setState({ isLoading: true, showTransactionDetail: true });
        apiService.post('GETCLIENTRESIDENTFINANCIALACCOUNTDETAILS', data).then(response => {
            if (response.Success && response.ClientResidentFinancialAccountDetails) {
                var Detail = response.ClientResidentFinancialAccountDetails
                this.setState({ transactionDetail: { ...this.state.transactionDetail, transactionDetail: Detail, AccountDescription: event.AccountDescription, CurrentBalance: event.CurrentBalance } });
            }
            this.setState({ isLoading: false, transactionDetail: { ...this.state.transactionDetail, AccountDescription: event.AccountDescription, CurrentBalance: event.CurrentBalance } });
        }, error => {
            this.setState({ isLoading: false });
            this.props.actions.showAlert({ message: error, variant: 'error' });

        });

    };
    handleClosedTransactionDetail = () => {
        this.setState({ showTransactionDetail: false, transactionDetail: {} })
    }

    openTransactionModal = (e, event) => {
        
        this.setState({ showModal: true, modelDetail: event })
    }
    close = () => {
        this.setState({ showModal: false, modelDetail: {} })
    }


    componentDidMount() {
        this.GetOpenAccount();
        this.GetClosedAccount();
        history.listen((location, action) => {
            this.setState({ showTransactionDetail: false });
        });

    }
    render() {
        const { value, classes, showModal, transactionDetail, modelDetail, openAccountDetail, closedAccountDetail, isLoading, showTransactionDetail } = this.state;
        return (

            <div className={classes.root}>
                {showTransactionDetail ?
                    <TransactionDetail transactionDetail={transactionDetail} isLoading={isLoading} closedTransactionDetail={this.handleClosedTransactionDetail} openTransactionModal={this.openTransactionModal} /> :
                    <Fragment>
                        <AppBar position="static">
                            <Tabs value={value} onChange={this.handleChange}>
                                <Tab label="Open Accounts" {...a11yProps(0)} />
                                <Tab label="Closed Accounts" {...a11yProps(1)} />
                            </Tabs>
                        </AppBar>
                        <TabPanel value={value} index={0}>
                            <FinancialGrid DetailsFinancialAccounts={openAccountDetail} oncheckboxchange={this.openGridTransactionDetail} isLoading={isLoading} onShowAlert={this.handleShowAlert} />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <FinancialGrid DetailsFinancialAccounts={closedAccountDetail} oncheckboxchange={this.openGridTransactionDetail} isLoading={isLoading} onShowAlert={this.handleShowAlert} />
                        </TabPanel>
                    </Fragment>

                }
                <TransactionModal onClose={this.close} transaction={modelDetail} showModal={showModal} showNavigation={false} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};
const mapDispatchToProps = dispatch => {
    return {
        actions: {
            showAlert: bindActionCreators(actions.showAlert, dispatch)
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(FinancialTabs);
