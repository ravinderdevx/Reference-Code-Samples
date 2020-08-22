import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as actions from '../../store/actions';
import { bindActionCreators } from 'redux';
import { apiService } from '../../services/api.service';
import FormatDateTime from '../../shared/components/functional/DateTimeFormatter';
import ReminderModal from '../../shared/components/ui/modal/reminder-modal';
import { Link } from "react-router-dom";

class Reminders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clienttasks: [],
            loading: true
        }
    }
    close = () => {
        this.setState({ showModal: false, clienttask: "" });
    }

    open = (e, clienttask) => {
        e.preventDefault();
        this.setState({ showModal: true, clienttask: clienttask });
    }
    getReminders = () => {
        const { auth } = this.props;
        var dueDate = moment().add(7, 'days').format("YYYY-MM-DD");
        apiService.post('GETCLIENTTASKS', { ClientId: auth.user.ClientId, Id: '-1', Completed: 'N', DueDate: dueDate }).then(response => {
            if (response.Success && response.ClientTasks) {
                this.setState({ clienttasks: response.ClientTasks });
            }
            this.setState({ loading: false });
        }, error => {
            this.props.actions.showAlert({ message: error, variant: 'error' });
            this.setState({ loading: false });
        });
    }
    componentDidMount() {
        this.getReminders();
    }
    render() {
        const { clienttasks, clienttask, loading, showModal } = this.state;
        return (
            <Fragment>
                <div className="card">
                    <div className="card-header reminder">
                        <div className="icon"><i className="fa fa-check-square-o"></i></div>
                        Reminders <small>Approved about things you need to do</small>
                        <div className="arrowRight"><Link className="active" to={`/Reminder`}><i className="fa fa-arrow-right"></i></Link></div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table tableBodyScroll">
                                <tbody>
                                    {!loading && (clienttasks.length > 0 ? clienttasks.map((clienttask) =>
                                        <tr key={clienttask.Id}>
                                            <td><FormatDateTime date={clienttask.DueDate} format="MM/DD" /> : {clienttask.TaskDescription}
                                            </td>
                                            <td className="text-right"><i className="fa fa-info" aria-hidden="true" onClick={(e) => this.open(e, clienttask)} /></td>
                                        </tr>
                                    ) :
                                        <tr>
                                            <td>No pending reminders</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            {loading && <div className="loaderDiv"><div className="loader"><CircularProgress /></div></div>}
                        </div>
                    </div>
                </div>
                <ReminderModal onClose={this.close} reminder={clienttask} showModal={showModal} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Reminders);