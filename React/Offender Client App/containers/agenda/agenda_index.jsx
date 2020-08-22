import React, { Component, Fragment } from "react";
import MaterialTable, { MTableBody } from "material-table";
import { apiService } from '../../services/api.service';
import * as actions from "../../store/actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import FormatDateTime from '../../shared/components/functional/DateTimeFormatter';
import AgendaDetailModal from '../../shared/components/ui/modal/agenda-modal';
import AuditAgendaDetailModal from '../../shared/components/ui/modal/auditagendadetail-modal';
import CopyAgendaRequestModal from '../agenda/copyagenda_modal';
import moment from 'moment';
import MeetingModal from '../../shared/components/ui/modal/meeting-modal';
import TreatmentDetailModal from '../../shared/components/ui/modal/treatmentgroupdetail-modal';
import { history } from '../../../src/helpers/history';


let today = new Date();
var lastWeek = moment().subtract(7, 'days');
let selectedEndDate = moment().add(3, 'days');
let maxDays = moment().add(30, 'days');


class Agenda extends Component {
    constructor(props) {
        super(props);

        this.state = {
            FilterAgendas: [],
            isLoading: true,
            selectedStartDate: new Date(),
            selectedEndDate: selectedEndDate,
            showModal: false,
            showCopyAgendaRequestModal: false,
            CopyAgendaRequestModalData: {},
            showMettingModal: false,
            meetingData: {}
        };

    }
    handleFilter = () => {
        const { selectedStartDate, selectedEndDate } = this.state;
        let data = { selectedStartDate: moment(selectedStartDate).format('MM/DD/YYYY'), selectedEndDate: moment(selectedEndDate).format('MM/DD/YYYY') }
        apiService.postDateRange(data)
        this.getAgendas(selectedStartDate, selectedEndDate);
    }
    componentDidMount() {
        const DateRange = apiService.getDateRange();
        let startDate, EndDate;
        if (DateRange) {
            startDate = DateRange.selectedStartDate;
            EndDate = DateRange.selectedEndDate
            this.setState({ selectedStartDate: DateRange.selectedStartDate, selectedEndDate: DateRange.selectedEndDate });
        }
        else {
            startDate = this.state.selectedStartDate;
            EndDate = this.state.selectedEndDate;
        }
        this.getAgendas(startDate, EndDate);
    }
    getAgendas = (startDate, EndDate) => {
        const { auth } = this.props;
        let data = { Clientid: auth.user.ClientId, Start: moment(startDate).format('MM/DD/YYYY'), End: moment(EndDate).format('MM/DD/YYYY') }
        apiService.post('GETAGENDAFORDATERANGE', data).then(response => {
            if (response.Success && response.FilterAgendas) {
                this.setState({
                    FilterAgendas: response.FilterAgendas,
                    isLoading: false
                });
            }
            else {
                this.setState({ isLoading: false, FilterAgendas: [] });
            }
        }, error => {
            this.setState({ isLoading: false });
            this.props.actions.showAlert({ message: error, variant: 'error' });
        });
    }

    /* Agenda Modal */
    openAgendaModal = (e, rowData) => {
        if (rowData.Type === 'Leave') {
            let data = { LeaveId: rowData.Id, AgendaSource: rowData.AgendaSource }
            apiService.post('GETCLIENTLEAVEWITHSCHEDULES', data).then(response => {
                if (response.Success) {
                    this.setState({ modelAgendaDetail: response, showModalAgenda: true });
                }
            }, error => {
                this.props.actions.showAlert({ message: error, variant: 'error' });
            });
        }
        else if (rowData.Type === 'Meetings') {
            apiService.post('GETCLIENTMEETINGDETAIL', { Id: rowData.Id }).then(response => {
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
        else {
            apiService.post('GETTREATMENTGROUPDETAIL', { Id: rowData.Id }).then(response => {
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
    }
    closeAgendaDetailModal = () => {
        this.setState({ showModalAgenda: false, modelAgendaDetail: '' })
    }
    closeMeetingModal = () => {
        this.setState({ showMeetingModal: false, clientLeaveWithSchedules: "" });
    }
    closeTreatmentModal = () => {
        this.setState({ showTreatmentModal: false, treatmentData: "" });
    }
    /* ----- */


    /* Auit Agenda Mondal */
    openAuditAgendaModal = (e, event) => {
        let data = {
            KeyId: event.Id,
            AgendaSource: event.AgendaSource,
            Source: "Audit_ClientLeaves"
        }
        apiService.post('GETAUDITDETAILS', data).then(response => {
            if (response.Success && response.AuditClientLeave) {

                this.setState({
                    modelAuditClientLeaveDetail: response.AuditClientLeave,
                    showModalAudit: true
                });
            }
            else {

                this.setState({ modelAuditClientLeaveDetail: [], showModalAudit: true });
            }
        }, error => {
            this.props.actions.showAlert({ message: error, variant: 'error' });
        });

    }
    closeAuditAgendaDetailModal = () => {

        this.setState({ showModalAudit: false, modelAuditClientLeaveDetail: '' })
    }
    /* ----- */


    /*----CopyAgendaRequestModal ----*/
    openCopyAgendaRequestModal = (e, data) => {
        this.setState({
            showCopyAgendaRequestModal: true,
            CopyAgendaRequestModalData: {
                ...this.state.CopyAgendaRequestModalData,
                agendaId: data.Id,
                scheduledDate: data.ScheduledDeparture,
                agendasource: data.AgendaSource
            }
        });
    }
    closeCopyAgendaRequestModal = () => {
        this.setState({ showCopyAgendaRequestModal: false });
    }
    /* ------- */
    redirectToAddAgenda = () => {
        this.props.history.push('/Agenda/Add_Agenda');
    };

    handleStartDateChange = date => {
        this.setState({ selectedStartDate: date });
    };

    handleEndDateChange = date => {
        this.setState({ selectedEndDate: date });
    };

    render() {
        const { FilterAgendas, meetingData, isLoading, showModalAgenda, modelAgendaDetail, showModalAudit, showCopyAgendaRequestModal,
            modelAuditClientLeaveDetail, showTreatmentModal, treatmentData, showMeetingModal, CopyAgendaRequestModalData } = this.state;
        return (
            <div className="col-md-12 col-sm-12">
                <div className="card ">
                    <div className="card-header datepicker">
                        <div className="row">
                            <div className="col-sm-4">
                                <label>Start Date</label>
                                <div className="dateFilter">
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Fragment>
                                            <KeyboardDatePicker
                                                autoOk
                                                variant="inline"
                                                inputVariant="standard"
                                                format="MM/dd/yyyy"
                                                value={this.state.selectedStartDate}
                                                onChange={this.handleStartDateChange}
                                                InputAdornmentProps={{ position: "start" }}
                                                minDate={lastWeek}
                                                maxDate={maxDays}
                                            />
                                        </Fragment>
                                    </MuiPickersUtilsProvider>
                                    {/* </div> */}
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <label>End Date</label>
                                <div className="dateFilter">
                                    <div >
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <Fragment>
                                                <KeyboardDatePicker
                                                    autoOk
                                                    variant="inline"
                                                    inputVariant="standard"
                                                    format="MM/dd/yyyy"
                                                    value={this.state.selectedEndDate}
                                                    onChange={this.handleEndDateChange}
                                                    InputAdornmentProps={{ position: "start" }}
                                                    minDate={today}
                                                    maxDate={maxDays}
                                                />
                                            </Fragment>
                                        </MuiPickersUtilsProvider>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-4 filterButton">
                                <div >
                                    <Fab className="stepFormBtn" color="primary" onClick={this.redirectToAddAgenda} aria-label="add">
                                        <AddIcon />
                                    </Fab>
                                </div>

                                <button className="filterBtn" type="filter" onClick={this.handleFilter}>Filter</button>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <div className="agendaTypeDetails">
                                <MaterialTable
                                    columns={[
                                        {
                                            title: "Agenda Type", field: "LeaveTypeDesc",
                                            render: rowData => (<Fragment>
                                                <div data-testid="td-before" className="tdBefore">Agenda Type</div>
                                                {rowData.LeaveTypeDesc}
                                            </Fragment>)
                                        },
                                        {
                                            title: "Start Time", field: "ScheduledDeparture",
                                            render: rowData => <Fragment>
                                                <div data-testid="td-before" className="tdBefore">Start Time</div>
                                                <FormatDateTime date={rowData.ScheduledDeparture} format="MM/DD hh:mm A" />
                                            </Fragment>

                                        },
                                        {
                                            title: "End Time", field: "ScheduledReturn",
                                            render: rowData => <Fragment>
                                                <div data-testid="td-before" className="tdBefore">EndTime</div>
                                                <FormatDateTime date={rowData.ScheduledReturn} format="MM/DD hh:mm A" />
                                            </Fragment>
                                        },
                                        {
                                            title: "Request Status", field: "RequestStatus",
                                            render: rowData => <Fragment>
                                                <div data-testid="td-before" className="tdBefore">Request Status</div>
                                                {rowData.RequestStatusDesc}
                                            </Fragment>
                                        },
                                        {
                                            title: "Action", field: "",
                                            sorting: false,
                                            render: rowData => (
                                                <Fragment><div data-testid="td-before" className="tdBefore">Action</div>
                                                    <div className="actionIcon">
                                                        {
                                                            rowData.Type === 'Leave' ?
                                                                <Fragment>
                                                                    {(rowData.RequestStatusDesc === "Deny" || rowData.RequestStatusDesc === "Denied") && moment(rowData.ScheduledDeparture) > new Date()
                                                                        &&
                                                                        <i className="fa fa-edit" title="Edit" onClick={() => history.push(`/Agenda/Add_Agenda?AgendaId=${rowData.Id}&DateTime=${moment(rowData.selectedDate).format('MM/DD/YYYY hh:mm A')}&AgendaSource=${rowData.AgendaSource}&Action=EditAgenda`)}></i>

                                                                    }
                                                                    {rowData.RequestStatusDesc !== "Deny" && rowData.RequestStatusDesc !== 'Denied' &&
                                                                        <i className="fa fa-clone" title="Copy" onClick={(e) => this.openCopyAgendaRequestModal(e, rowData)} />
                                                                    }

                                                                    <Fragment>

                                                                        <i className="fa fa-info-circle" aria-hidden="true" title="Details" onClick={(e) => this.openAgendaModal(e, rowData)} />
                                                                        <i className="fa fa-file-text" aria-hidden="true" title="Change logs" onClick={(e) => this.openAuditAgendaModal(e, rowData)} />
                                                                    </Fragment>
                                                                </Fragment>
                                                                :
                                                                rowData.Type === 'Meetings' ?
                                                                    <i className="fa fa-info-circle" aria-hidden="true" title="Details" onClick={(e) => this.openAgendaModal(e, rowData)} />
                                                                    :
                                                                    <i className="fa fa-info-circle" aria-hidden="true" title="Details" onClick={(e) => this.openAgendaModal(e, rowData)} />

                                                        }
                                                    </div>
                                                </Fragment>),

                                        },


                                    ]}
                                    options={{
                                        pageSize: 25,
                                        pageSizeOptions: [5, 10, 25, 50, 100],
                                        toolbar: false,
                                        paging: true,
                                        paginationType: "normal",
                                        headerStyle: {
                                            backgroundColor: "#47a8f5",
                                            color: "#FFF"
                                        },
                                        actionsColumnIndex: -1,
                                        minBodyHeight: "300px",
                                        columnsButton: true,
                                        sorting: true
                                    }}
                                    localization={{
                                        pagination: {
                                            labelRowsSelect: "rows per page"
                                        }
                                    }}
                                    isLoading={isLoading}
                                    data={FilterAgendas}
                                    title="Agenda List"
                                    components={{
                                        Body: props =>
                                            <Fragment> {
                                                props.renderData &&
                                                    props.renderData.length === 0 ?
                                                    <div className="alignCenterExt">No Records found</div>
                                                    : <MTableBody  {...props} />

                                            }
                                            </Fragment>
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <AgendaDetailModal onClose={this.closeAgendaDetailModal} Agenda={modelAgendaDetail} showModal={showModalAgenda} showNavigation={false} />
                <AuditAgendaDetailModal onClose={this.closeAuditAgendaDetailModal} AuditClientLeave={modelAuditClientLeaveDetail} showModalAudit={showModalAudit} showNavigation={false} />
                <CopyAgendaRequestModal onClose={this.closeCopyAgendaRequestModal} showModal={showCopyAgendaRequestModal} agendaId={CopyAgendaRequestModalData.agendaId} scheduledDate={CopyAgendaRequestModalData.scheduledDate} agendasource={CopyAgendaRequestModalData.agendasource} />
                <MeetingModal showModal={showMeetingModal} meeting={meetingData} onClose={this.closeMeetingModal} />
                <TreatmentDetailModal showModal={showTreatmentModal} treatment={treatmentData} onClose={this.closeTreatmentModal} />
            </div >


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
export default connect(mapStateToProps, mapDispatchToProps)(Agenda);


