import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import StaticDatePicker from '../../shared/components/ui/calender/calender';
import StaticTimePicker from '../../shared/components/ui/calender/timepicker';
import { apiService } from '../../services/api.service';
import moment from 'moment';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import { bindActionCreators } from 'redux';
import { NotificationContainer, NotificationManager } from 'react-notifications';

import { history } from '../../../src/helpers/history';
class CopyAgendaRequestModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            scheduledDate: {
                selectedDate: '',
                selectedDate_Date: '',
                selectedDate_Time: '',
            }
        };
    }
    update = (selectedDate) => {
        this.setState({
            scheduledDate: {
                selectedDate: selectedDate,
                selectedDate_Date: selectedDate,
                selectedDate_Time: selectedDate,
            }
        });
    }
    componentWillReceiveProps(nextProps) {
        this.update(nextProps.scheduledDate);
    }
    handleDateTimeControls = (data, name) => {
        const { scheduledDate } = this.state;
        var stateName = name.substr(0, name.indexOf('_'));
        scheduledDate[name] = data;
        this.setState({ scheduledDate });
        var date = new Date(this.state.scheduledDate[stateName + '_Date']);
        var time = new Date(this.state.scheduledDate[stateName + '_Time']);
        if (date && time) {
            date = new Date(date.setHours(time.getHours()));
            date = new Date(date.setMinutes(time.getMinutes()));
            scheduledDate[stateName] = date;
            this.setState({
                scheduledDate
            });
        }
    }

    handleCopyAgendaRequest = () => {
        const { agendaId } = this.props;
        const { scheduledDate } = this.state;
        if (!agendaId || agendaId <= 0)
            return false;
        var todayDate = new Date();
        // Field validation
        if (moment(scheduledDate.selectedDate) <= todayDate) {
            this.props.actions.showAlert({ message: `Date/Time should be greater than ${moment(todayDate).format('MM/DD/YYYY hh:mm A')}`, variant: 'error', vertical: "top", horizontal: "right" });
            return false;
        }
        this.ValidateClientLeaveRequest(agendaId);
    }
    ValidateClientLeaveRequest = (leaveId) => {
        apiService.post('GETVALIDATIONCOPYAGENDA', { LeaveId: leaveId }).then(response => {
            if (response.Success) {
                if (response.Message) {
                    this.props.actions.showAlert({ message: response.Message, variant: 'error', vertical: "top", horizontal: "right" });
                }
                else {
                    const { agendasource } = this.props;
                    const { scheduledDate } = this.state;
                    history.push(`/Agenda/Add_Agenda?AgendaId=${leaveId}&DateTime=${moment(scheduledDate.selectedDate).format('MM/DD/YYYY hh:mm A')}&AgendaSource=${agendasource}&Action=CopyAgenda`);
                }
            }
            this.setState({ loading: false });
        }, error => {
            this.props.actions.showAlert({ message: error, variant: 'error', vertical: "top", horizontal: "right" });
            this.setState({ loading: false });
        });
    }


    render() {
        const { showModal, onClose } = this.props;
        const { scheduledDate } = this.state;
        return (
            <div className="card-body" >
                <div className="table-responsive">
                    <Modal className="stepperModal" show={showModal} onHide={onClose}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="example-custom-modal-styling-title">Copy Agenda Request</Modal.Title>
                        </Modal.Header>
                        <Modal.Body >
                            <div className="setColor">
                                <div className="row">
                                    <div className="datePickerBlock col-md-12 col-lg-5 col-sm-12">
                                        <StaticDatePicker name="selectedDate_Date"
                                            defaultDate={scheduledDate.selectedDate_Date}
                                            onDateChange={this.handleDateTimeControls}
                                            minDate={new Date()}
                                            maxDate={moment(new Date()).add(30, 'd').toDate().setHours(23, 59, 59, 999)}
                                        ></StaticDatePicker>
                                    </div>
                                    <div className="selecTimer col-md-12 col-lg-5 col-sm-12">
                                        <StaticTimePicker name="selectedDate_Time"
                                            defaultTime={scheduledDate.selectedDate_Time}
                                            onTimeChange={this.handleDateTimeControls}
                                            minDate={new Date()}
                                            maxDate={moment(new Date()).add(30, 'd').toDate().setHours(23, 59, 59, 999)}
                                        ></StaticTimePicker>

                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleCopyAgendaRequest}> Copy Agenda </Button>
                        </Modal.Footer>
                    </Modal >
                </div>
                <NotificationContainer />

            </div>
        )

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

export default connect(mapStateToProps, mapDispatchToProps)(CopyAgendaRequestModal); 