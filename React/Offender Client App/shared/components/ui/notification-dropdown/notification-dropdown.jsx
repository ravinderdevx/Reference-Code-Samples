import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import * as actions from './../../../../store/actions';
import { bindActionCreators } from 'redux';
import { apiService } from '../../../../services/api.service';
import Dropdown from 'react-bootstrap/Dropdown';
import { history } from "../../../../helpers/history";
import ReminderModal from '../../../../shared/components/ui/modal/reminder-modal';
import AgendaDetailModal from '../../../../shared/components/ui/modal/agenda-modal';
import TransactionModal from '../../../../shared/components/ui/modal/transaction-modal';

import { NOTIFICATION_INTERVAL_IN_SECONDS } from '../../../../config/api.config';


class NotificationDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: [],
            modelDetail: {},
            showModal: false,
            modalName: ""
        }

    }
    close = () => {
        this.setState({ showModal: false, modelDetail: "", modalName: "" });
    }

    getNotifications = () => {
        const { auth } = this.props;
        apiService.post('GETNOTIFICATIONS', { ClientId: auth.user.ClientId, IncludeAck: 0, Offset: "" }).then(response => {
            if (response.Success) {
                this.setState({ notifications: response.Notifications });
            }
        }, error => {
            //  this.props.actions.showAlert({ message: error, variant: 'error' });
        });
    }

    updateNotificationRequest = (ids) => {
        const { auth } = this.props;
        let data = { ids };
        if (auth.user.IsStaffLogin) {
            data.ModifyBy = auth.user.StaffUserName;
        }
        apiService.post("UPDATEACKNOWLEDGES", data).then(
            response => {
                if (response.Success) {
                    this.getNotifications();
                }
            },
            error => {
                this.props.actions.showAlert({ message: error, variant: "error" });
            }
        );
    }

    updateAllNotification = () => {
        let ids = [];
        const { notifications } = this.state;
        if (notifications && notifications.length > 0) {
            notifications.map((item, key) =>
                ids.push(item.Id));
            this.updateNotificationRequest(ids);
        }
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

    notificationClicked = (notificationObject) => {
        if (notificationObject.Type === "Agenda") {
            this.getAgenda(notificationObject);
        }
        else if (notificationObject.Type === "Task") {
            this.getReminder(notificationObject.KeyId);
        }
        else if (notificationObject.Type === "Transaction") {
            this.getTrancationDetail(notificationObject.KeyId);
        }
        else if (notificationObject.Type === "Resource") {
            history.push('/ResourceLibrary');
        }
        let ids = [notificationObject.Id];
        this.updateNotificationRequest(ids);
    }

    componentDidMount() {
        this.interval = setInterval(() => { this.getNotifications() }, 1000 * NOTIFICATION_INTERVAL_IN_SECONDS);
        this.getNotifications()
        history.listen((location, action) => {
            this.setState({ showModal: false });
        });

    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    render() {
        const { notifications, showModal, modelDetail, modalName } = this.state;
        return (
            <Fragment>
                <Dropdown>
                    <Dropdown.Toggle>
                        <i className="fa fa-bell-o"></i>
                        <span className="badge bg-c-pink">{notifications ? notifications.length : '0'}</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="show-notification notification-view">
                        <ul>
                            <li><h6>New Activities </h6><i className="fa fa-check-square-o activeCheck" aria-hidden="true" onClick={() => this.updateAllNotification()}></i></li>
                            {notifications && notifications.map((notification) =>

                                <li key={notification.Id} onClick={() => this.notificationClicked(notification)}>
                                    <Dropdown.Item>
                                        <p className="notification-msg">{notification.NotificationText}</p>
                                        <span className="notification-time"><i className="fa fa-clock-o" aria-hidden="true"></i> {notification.FormattedActivityDate}</span>
                                    </Dropdown.Item>
                                </li>
                            )
                            }
                        </ul>
                    </Dropdown.Menu>
                </Dropdown >
                {modalName === "Reminder" && <ReminderModal onClose={this.close} reminder={modelDetail} showModal={showModal} />}
                {modalName === "Agenda" && < AgendaDetailModal onClose={this.close} Agenda={modelDetail} showModal={showModal} />}
                {modalName === "Financial" && < TransactionModal onClose={this.close} transaction={modelDetail} showModal={showModal} showNavigation={true} />}
                {modalName === "Agenda" && <AgendaDetailModal onClose={this.close} Agenda={modelDetail} showModal={showModal} showNavigation={true} />}
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

export default connect(mapStateToProps, mapDispatchToProps)(NotificationDropdown);