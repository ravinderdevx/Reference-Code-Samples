import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as actions from '../../store/actions';
import { bindActionCreators } from 'redux';

import { apiService } from '../../services/api.service';
import FormatDateTime from '../../shared/components/functional/DateTimeFormatter';
import AgendaDetailModal from '../../shared/components/ui/modal/agenda-modal';
import MeetingModal from '../../shared/components/ui/modal/meeting-modal';
import TreatmentDetailModal from '../../shared/components/ui/modal/treatmentgroupdetail-modal';

class TodayAgenda extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todaysAgendas: [],
            loading: true,
            clientLeaveWithSchedules: []
        }
    }
    close = () => {
        this.setState({ showModal: false, clientLeaveWithSchedules: "" });
    }
    closeMeetingModal = () => {
        this.setState({ showMeetingModal: false, clientLeaveWithSchedules: "" });
    }
    closeTreatmentModal = () => {
        this.setState({ showTreatmentModal: false, treatmentData: "" });
    }

    open = (e, TodaysAgenda) => {
        e.preventDefault();

        if (TodaysAgenda.AgendaType === 'Meetings') {
            apiService.post('GETCLIENTMEETINGDETAIL', { Id: TodaysAgenda.Id }).then(response => {
                if (response.Success && response.clientMeetingDetail) {

                    this.setState({ showMeetingModal: true, meetingData: response.clientMeetingDetail });
                }
                else {

                    this.setState({ showMeetingModal: true });
                }
            }, error => {
                this.props.actions.showAlert({ message: error, variant: 'error' });
            });
        }
        else if (TodaysAgenda.AgendaType === 'TreatmentGroup') {
            apiService.post('GETTREATMENTGROUPDETAIL', { Id: TodaysAgenda.Id }).then(response => {
                if (response.Success && response.treatmentGroupDetail) {

                    this.setState({ showTreatmentModal: true, treatmentData: response.treatmentGroupDetail });
                }
                else {

                    this.setState({ showTreatmentModal: true });
                }
            }, error => {
                this.props.actions.showAlert({ message: error, variant: 'error' });
            });
        }
        else {
            let data = { LeaveId: TodaysAgenda.Id, AgendaSource: TodaysAgenda.AgendaSource }
            apiService.post('GETCLIENTLEAVEWITHSCHEDULES', data).then(response => {
                if (response.Success) {
                    this.setState({ clientLeaveWithSchedules: response, showModal: true });
                }
            }, error => {
                this.props.actions.showAlert({ message: error, variant: 'error' });
            });
        }
    }
    getTodaysAgendas = () => {
        const { auth } = this.props;
        apiService.post('GETTODAYAGENDAS', { ClientId: auth.user.ClientId }).then(response => {
            if (response.Success && response.TodaysAgendas) {
                this.setState({ todaysAgendas: response.TodaysAgendas });
            }
            this.setState({ loading: false });
        }, error => {
            this.props.actions.showAlert({ message: error, variant: 'error' });
            this.setState({ loading: false });
        });
    }
    componentDidMount() {
        this.getTodaysAgendas();
    }
    render() {
        const { todaysAgendas, clientLeaveWithSchedules, showModal, loading, showTreatmentModal, treatmentData, showMeetingModal, meetingData } = this.state;
        return (
            <Fragment>
                <div className="card ">
                    <div className="card-header agenda">
                        <div className="icon"><i className="fa fa-calendar-o"></i></div>
                        Today's Agenda <small>Approved agendas for today </small>
                        <div className="arrowRight"><Link className="active" to={`/Agenda`}><i className="fa fa-arrow-right"></i></Link></div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table tableBodyScroll">
                                <tbody>
                                    {!loading && (todaysAgendas.length > 0 ? todaysAgendas.map((TodaysAgenda) =>
                                        <tr key={TodaysAgenda.Id}>
                                            <td className={(TodaysAgenda.AgendaType !== "Agenda" || TodaysAgenda.RequestStatus === 'Approved') ? '' : 'lightbackground'}><FormatDateTime date={TodaysAgenda.ScheduledDeparture} format="h:mm a" />-<FormatDateTime date={TodaysAgenda.ScheduledReturn} format="h:mm a" />: {TodaysAgenda.Destinations}
                                            </td>
                                            <td className="text-right" ><i className="fa fa-info" aria-hidden="true" onClick={(e) => this.open(e, TodaysAgenda)} /></td>
                                        </tr>
                                    ) : <tr>
                                            <td>Nothing scheduled today</td>
                                        </tr>)}
                                </tbody>
                            </table>
                            {loading && <div className="loaderDiv"><div className="loader"><CircularProgress /></div></div>}
                        </div>
                    </div>
                </div>
                <AgendaDetailModal onClose={this.close} Agenda={clientLeaveWithSchedules} showModal={showModal} showNavigation={true} />
                <MeetingModal showModal={showMeetingModal} meeting={meetingData} onClose={this.closeMeetingModal} showNavigation={true} />
                <TreatmentDetailModal showModal={showTreatmentModal} treatment={treatmentData} onClose={this.closeTreatmentModal} showNavigation={true} />

            </Fragment >
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
export default connect(mapStateToProps, mapDispatchToProps)(TodayAgenda);