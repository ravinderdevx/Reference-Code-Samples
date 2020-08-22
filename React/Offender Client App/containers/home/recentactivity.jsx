import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import { bindActionCreators } from 'redux';
import moment from 'moment'
import CircularProgress from '@material-ui/core/CircularProgress';
import { apiService } from '../../services/api.service';
import FormatDateTime from '../../shared/components/functional/DateTimeFormatter';
import { history } from "../../helpers/history";
import ReminderModal from '../../shared/components/ui/modal/reminder-modal';
import AgendaDetailModal from '../../shared/components/ui/modal/agenda-modal';
import TransactionModal from '../../shared/components/ui/modal/transaction-modal';
class RecentActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: [],
            loading: true,
            modelDetail: {},
            showModal: false,
            modalName: ""
        }
    }

    getRecentActivity = () => {
        const { auth } = this.props;
        var offsetDate = moment().subtract(3, 'days').format("YYYY-MM-DD");
        apiService.post('GETNOTIFICATIONS', { ClientId: auth.user.ClientId, IncludeAck: 1, Offset: offsetDate }).then(response => {
            if (response.Success && response.Notifications) {
                this.setState({ notifications: response.Notifications });
            }
            this.setState({ loading: false });
        }, error => {
            this.props.actions.showAlert({ message: error, variant: 'error' });
            this.setState({ loading: false });

        });
    }
    getAgenda = (notificationObject) => {
        let data = {
            LeaveId: notificationObject.KeyId,
            AgendaSource: notificationObject.AgendaSource,
        }
        apiService.post('GETCLIENTLEAVEWITHSCHEDULES', data).then(response => {
            if (response.Success) {
                this.setState({ modelDetail: response, showModal: true, modalName: "Agenda" });
            }
        }, error => {
            this.props.actions.showAlert({ message: error, variant: 'error' });
        });
    }

    getReminder = (id) => {
        const { auth } = this.props;
        apiService.post('GETCLIENTTASKS', { ClientId: auth.user.ClientId, Id: id }).then(response => {
            if (response.Success && response.ClientTasks) {
                this.setState({ modelDetail: response.ClientTasks[0], showModal: true, modalName: "Reminder" });
            }
        }, error => {
            this.props.actions.showAlert({ message: error, variant: 'error' });
        });
    }

    getTrancationDetail = (id) => {
        apiService.post('GETCLIENTRESIDENTFINANCIALACCOUNTDETAILS', { Id: id, ClientResidentFinancialAccountId: -1 }).then(response => {
            if (response.Success && response.ClientResidentFinancialAccountDetails) {
                this.setState({ modelDetail: response.ClientResidentFinancialAccountDetails[0], showModal: true, modalName: "Financial" });
            }
        }, error => {
            this.props.actions.showAlert({ message: error, variant: 'error' });
        });
    }
    navigateTo = (notificationObject) => {
        if (notificationObject.Type === "Agenda") {
            this.getAgenda(notificationObject);
        }
        else if (notificationObject.Type === "Task") {
            this.getReminder(notificationObject.KeyId);
        }
        else if (notificationObject.Type === "Financial") {
            this.getTrancationDetail(notificationObject.KeyId);
        }
        else if (notificationObject.Type === "Resource") {
            history.push('/ResourceLibrary');
        }
    }
    close = () => {
        this.setState({ showModal: false, modelDetail: "", modalName: "" });
    }
    componentDidMount() {
        this.getRecentActivity();
    }
    render() {

        const { notifications, loading, showModal, modelDetail, modalName } = this.state;
        return (
            <Fragment>
                <div className="card ">
                    <div className="card-header activity">
                        <div className="icon"><i className="fa fa-bell-o"></i></div>
                        Recent Activity <small>Recently added/changed information on your profile.</small>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table tableBodyScroll">
                                <tbody>
                                    {!loading && (notifications.length > 0 ? notifications.map((notification) =>
                                        <tr key={notification.Id}>
                                            <td><FormatDateTime date={notification.ActivityDate} format="MM-DD" /> : {notification.NotificationText}
                                            </td>
                                            <td className="text-right">
                                                {notification.Type !== 'Transaction' && <i onClick={() => this.navigateTo(notification)} className="fa fa-info"></i>}
                                            </td>
                                        </tr>
                                    ) :
                                        <tr>
                                            <td>No recent activity</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            {loading && <div className="loaderDiv"><div className="loader"><CircularProgress /></div></div>}
                        </div>
                    </div>
                </div>
                {modalName === "Reminder" && <ReminderModal onClose={this.close} reminder={modelDetail} showModal={showModal} />}
                {modalName === "Agenda" && < AgendaDetailModal onClose={this.close} Agenda={modelDetail} showModal={showModal} showNavigation={true} />}
                {modalName === "Financial" && < TransactionModal onClose={this.close} transaction={modelDetail} showModal={showModal} showNavigation={true} />}

            </Fragment>

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

export default connect(mapStateToProps, mapDispatchToProps)(RecentActivity);