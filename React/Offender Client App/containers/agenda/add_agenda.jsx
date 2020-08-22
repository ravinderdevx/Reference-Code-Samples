import React, { Component, Fragment } from "react";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import StaticDatePicker from "../../shared/components/ui/calender/calender";
import { apiService } from '../../services/api.service';
import StaticTimePicker from "../../shared/components/ui/calender/timepicker";
import ClientAllowLeavesModal from '../../shared/components/ui/modal/clientallowleaves-model';
import moment from 'moment';
import { NotificationContainer } from 'react-notifications';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import { bindActionCreators } from 'redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactDOM from 'react-dom';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
class VerticalLinearStepper extends Component {
    constructor(props) {
        super(props);
        let search = window.location.search;
        let params = new URLSearchParams(search);
        this.state = {
            activeStep: 0,
            globalcodes: [],
            vehicledetails: [],
            driverdetails: [],
            destinationDetails: [],
            agendaId: params.get('AgendaId') > 0 ? params.get('AgendaId') : -1,
            leavedata: {
                Id: -1,
                leave_type: -1,
                leave_typeText: '',
                scheduledDeparture: moment(new Date()).add(1, 'h').toDate().setMinutes(0, 0, 0),
                scheduledDeparture_Date: moment(new Date()).add(1, 'h').toDate().setMinutes(0, 0, 0),
                scheduledDeparture_Time: moment(new Date()).add(1, 'h').toDate().setMinutes(0, 0, 0),
                departTravelTime: 0,
                clientLeaveSchedules: [
                    {
                        id: -1,
                        scheduleType: -1,
                        scheduleTypeText: '',
                        destination: -1,
                        destinationText: '',
                        startDate: '',
                        startDate_Date: '',
                        startDate_Time: '',
                        endDate: '',
                        endDate_Date: '',
                        endDate_Time: '',
                        comments: ''
                    }
                ],
                departTransMode: -1,
                departTransModeText: '',
                departTransDriver: -1,
                departTransVehicle: -1,
                returnTransMode: -1,
                returnTransModeText: '',
                returnTransDriver: -1,
                returnTransVehicle: -1,
                scheduledReturn: '',
                scheduledReturn_Date: '',
                scheduledReturn_Time: '',
                returnTravelTime: '',
                comments: ''
            },
            phaseRestrictions: {},
            scheduleRestrictions: {},
            showModal: false,
            activeModalStep: 0,
            scheduleIndex: -1,
            modalaction: '',
            modalscheduledata: {
                id: -1,
                scheduleType: -1,
                scheduleTypeText: '',
                destination: -1,
                destinationText: '',
                startDate: '',
                startDate_Date: '',
                startDate_Time: '',
                endDate: '',
                endDate_Date: '',
                endDate_Time: '',
                comments: '',
                interimTransMode: -1,
                interimTransModeText: '',
                interimTransDriver: -1,
                interimTransVehicle: -1,
                interimTravelTime: 0
            },
            schdeulediff: 0,
            isdisabled: false,
            loading: false
        };
        this.StaticDatePicker = React.createRef();
        this.StaticTimePicker = React.createRef();
        this.myRef = [];

    };

    componentDidMount() {
        this.getGlobalCodes();
        this.getVehicleDetails();
        this.getDriverDetails();
        if (this.props.location.search) {
            this.getClientLeave();
        }
    }
    //#region  common Calls

    //calls to fetch data of ClientLeave
    getClientLeave = () => {
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let data = {
            LeaveId: params.get('AgendaId'),
            AgendaSource: params.get('AgendaSource')
        }
        let action = params.get('Action');
        let copyagendaDateTime = new Date(params.get('DateTime'));
        this.setState({ loading: true });
        apiService.post('GETCLIENTLEAVEWITHSCHEDULES', data).then(response => {
            if (response.Success && response.clientLeave) {
                const { clientLeave, clientLeaveSchedules } = response;
                let modalscheduledata = [];
                let leavedata = { ...this.state.leavedata };
                if (clientLeave) {
                    if (clientLeaveSchedules && clientLeaveSchedules.length > 0) {
                        clientLeaveSchedules.map((item, key) => {
                            modalscheduledata[key] = {
                                id: item.Id,
                                scheduleType: item.ScheduleTypeId ? item.ScheduleTypeId : -1,
                                scheduleTypeText: item.ScheduleType,
                                destination: item.DestinationId ? item.DestinationId : -1,
                                destinationText: item.Destination,
                                startDate: new Date(item.StartDate),
                                startDate_Date: new Date(item.StartDate),
                                startDate_Time: new Date(item.StartDate),
                                endDate: new Date(item.EndDate),
                                endDate_Date: new Date(item.EndDate),
                                endDate_Time: new Date(item.EndDate),
                                comments: item.Comments,
                            };
                            if (item.ReturnsToCenter === 'N') {
                                modalscheduledata[key].interimTransMode = item.InterimTransMode ? item.InterimTransMode : -1;
                                modalscheduledata[key].interimTransModeText = item.TransMode ? item.TransMode : '';
                                modalscheduledata[key].interimTransDriver = item.InterimTransDriver ? item.InterimTransDriver : -1;
                                modalscheduledata[key].interimTransVehicle = item.InterimTransVehicle ? item.InterimTransVehicle : -1;
                                modalscheduledata[key].interimTravelTime = item.TravelTime ? item.TravelTime : -1;
                            }
                            return null;
                        });
                    }
                    leavedata = {
                        id: params.get('AgendaId'),
                        leave_type: clientLeave.LeaveType ? clientLeave.LeaveType : -1,
                        leave_typeText: clientLeave.LeaveTypeDescription,
                        scheduledDeparture: new Date(clientLeave.ScheduledDeparture),
                        scheduledDeparture_Date: new Date(clientLeave.ScheduledDeparture),
                        scheduledDeparture_Time: new Date(clientLeave.ScheduledDeparture),
                        departTravelTime: clientLeave.DepartTravelTime,
                        clientLeaveSchedules: modalscheduledata,
                        departTransMode: clientLeave.DepartTransMode ? clientLeave.DepartTransMode : -1,
                        departTransModeText: clientLeave.DepartTransModeDetailsDescription,
                        departTransDriver: clientLeave.DepartTransDriver ? clientLeave.DepartTransDriver : -1,
                        departTransVehicle: clientLeave.DepartTransVehicle ? clientLeave.DepartTransVehicle : -1,
                        returnTransMode: clientLeave.ReturnTransMode ? clientLeave.ReturnTransMode : -1,
                        returnTransModeText: clientLeave.ReturnTransModeDetailsDescription,
                        returnTransDriver: clientLeave.ReturnTransDriver ? clientLeave.ReturnTransDriver : -1,
                        returnTransVehicle: clientLeave.ReturnTransVehicle ? clientLeave.ReturnTransVehicle : -1,
                        scheduledReturn: new Date(clientLeave.ScheduledReturn),
                        scheduledReturn_Date: new Date(clientLeave.ScheduledReturn),
                        scheduledReturn_Time: new Date(clientLeave.ScheduledReturn),
                        returnTravelTime: clientLeave.ReturnTravelTime,
                        comments: clientLeave.Comments
                    };
                }
                if (action === "CopyAgenda") {
                    this.setState({ activeStep: 10 });
                    if (copyagendaDateTime !== null) {
                        let schedulestart = -1;
                        let minutes = moment(copyagendaDateTime).diff(leavedata.scheduledDeparture, 'minutes');
                        leavedata.id = 0;
                        leavedata.scheduledDeparture = new Date(moment(leavedata.scheduledDeparture).add(minutes, 'm'));
                        leavedata.scheduledDeparture_Date = new Date(moment(leavedata.scheduledDeparture_Date).add(minutes, 'm'));
                        leavedata.scheduledDeparture_Time = new Date(moment(leavedata.scheduledDeparture_Time).add(minutes, 'm'));
                        leavedata.scheduledReturn = new Date(moment(leavedata.scheduledReturn).add(minutes, 'm'));
                        leavedata.scheduledReturn_Date = new Date(moment(leavedata.scheduledReturn_Date).add(minutes, 'm'));
                        leavedata.scheduledReturn_Time = new Date(moment(leavedata.scheduledReturn_Time).add(minutes, 'm'));

                        for (var i = 0; i < leavedata.clientLeaveSchedules.length; i++) {
                            //schedule start date adjustment for copy agenda case
                            leavedata.clientLeaveSchedules[i].id = 0;
                            let startDate = new Date(moment(leavedata.clientLeaveSchedules[i].startDate).add(minutes, 'm'));
                            leavedata.clientLeaveSchedules[i].startDate = startDate;
                            leavedata.clientLeaveSchedules[i].startDate_Date = startDate;
                            leavedata.clientLeaveSchedules[i].startDate_Time = startDate;
                            //schedule end date adjustment for copy agenda case
                            let endDate = new Date(moment(leavedata.clientLeaveSchedules[i].endDate).add(minutes, 'm'));
                            leavedata.clientLeaveSchedules[i].endDate = endDate;
                            leavedata.clientLeaveSchedules[i].endDate_Date = endDate;
                            leavedata.clientLeaveSchedules[i].endDate_Time = endDate;

                            if (i === 0) {
                                schedulestart = leavedata.scheduledDeparture;
                            }
                            else {
                                schedulestart = leavedata.clientLeaveSchedules[i - 1].endDate;
                                leavedata.clientLeaveSchedules[i - 1].interimTravelTime = moment(leavedata.clientLeaveSchedules[i].startDate).diff(schedulestart, 'minutes');
                            }


                        };
                        leavedata.departTravelTime = moment(leavedata.clientLeaveSchedules[0].startDate).diff(leavedata.scheduledDeparture, 'minutes')
                        leavedata.returnTravelTime = moment(leavedata.scheduledReturn).diff(leavedata.clientLeaveSchedules[leavedata.clientLeaveSchedules.length - 1].endDate, 'minutes');
                    }
                    this.setState({ leavedata: leavedata });
                    this.handleStepperScroll(this.myRef[10]);
                }
                else {
                    this.setState({ leavedata: leavedata });
                }
                this.StaticDatePicker.current.changeDate(leavedata.scheduledDeparture);
                this.StaticTimePicker.current.changeDate(leavedata.scheduledDeparture);
                this.updatePhaseRestrictions();
                this.getScheduleResctrictions(this.state.leavedata.clientLeaveSchedules[0].scheduleType, this.state.leavedata.clientLeaveSchedules[0].scheduleTypeText, 'leaveedit');
                this.getDestinationDetails(this.state.leavedata.clientLeaveSchedules[0].scheduleTypeText, this.state.leavedata.clientLeaveSchedules[0].scheduleType);
                this.handleDateTimeControls(new Date(this.state.leavedata.scheduledDeparture), 'scheduledDeparture_Time');
            }
            this.setState({ loading: false });
        }, error => {
            this.setState({ loading: false });
            this.props.actions.showAlert({ message: error, variant: 'error' });
        });
    }

    // add class in body
    getAddClass = () => {
        if (this.state.loading) {
            document.body.classList.add('addloding');
            return true;
        }
        else {
            document.body.classList.remove('addloding');
            return false;
        }
    }

    //calls to fetch data of globalcodes
    getGlobalCodes = () => {
        this.setState({ loading: true });
        var requestdata = { CategoryName: 'LeaveType,ScheduleType,DestinationType,TransportationMode,KioskLeaveRequestStatus', RecordDeleted: 'N' };
        apiService.post('GETGLOBALCODES', requestdata).then(response => {
            if (response.Success && response.GlobalCode) {
                this.setState({ globalcodes: response.GlobalCode });
            }
            this.setState({ loading: false });
        }, error => {
            this.setState({ loading: false });
            this.props.actions.showAlert({ message: error, variant: 'error' });
        });
    }

    //calls to fetch data of vehicledetails
    getVehicleDetails = () => {
        const { auth } = this.props;
        apiService.post('GETVEHICLEDETAILS', { ClientId: auth.user.ClientId }).then(response => {
            if (response.Success && response.VehicleDetails) {
                this.setState({ vehicledetails: response.VehicleDetails });
            }
            this.setState({ loading: false });
        }, error => {
            this.props.actions.showAlert({ message: error, variant: 'error' });
            this.setState({ loading: false });
        });
    }

    //calls to fetch data of driverdetails
    getDriverDetails = () => {
        const { auth } = this.props;
        apiService.post('GETDRIVERDETAILS', { ClientId: auth.user.ClientId }).then(response => {
            if (response.Success && response.DriverDetail) {
                this.setState({ driverdetails: response.DriverDetail });
            }
            this.setState({ loading: false });
        }, error => {
            this.props.actions.showAlert({ message: error, variant: 'error' });
            this.setState({ loading: false });
        });
    }

    getDestinationDetails = (scheduleType, scheduleTypeId) => {
        const { auth } = this.props;
        apiService.post('GETDESTINATIONS', { ClientId: auth.user.ClientId, ScheduleType: scheduleType, ScheduleTypeId: scheduleTypeId }).then(response => {
            if (response.Success && response.Destinations) {
                this.setState({ destinationDetails: response.Destinations });
            }
            else {
                this.setState({ destinationDetails: [] });
            }
            this.setState({ loading: false });
        }, error => {
            this.props.actions.showAlert({ message: error, variant: 'error' });
            this.setState({ loading: false });
        });
    }

    updatePhaseRestrictions = () => {
        const { auth } = this.props;
        const leavedata = this.state.leavedata
        var requestdata = { ClientId: auth.user.ClientId, LeaveType: Number(leavedata.leave_type), Date: moment(leavedata.scheduledDeparture).format("MM/DD/YYYY") };
        apiService.post('GETLEAVEVALIDATIONCRITERIA', requestdata).then(response => {
            if (response.Success && response.LeaveValidationCriteria) {
                this.setState({ phaseRestrictions: response.LeaveValidationCriteria });
            }
        }, error => {
            this.props.actions.showAlert({ message: error, variant: 'error' });
            this.setState({ phaseRestrictions: {} });

        });
    }
    validateAgenda = async (invokedby, stepId) => {
        let isValidated = true;
        const { leavedata, globalcodes } = { ...this.state };
        const { auth } = this.props;
        // for modal we have to manage validation so we keep a copy of curent schedule before making changes to state
        let schedules = globalcodes.filter(x => x.CategoryName === 'ScheduleType' || x.CategoryName === 'DestinationType');
        // let tempSchedule = [];
        // if (invokedby === "modal") {
        //     tempSchedule = leavedata.clientLeaveSchedules[this.state.scheduleIndex] ? leavedata.clientLeaveSchedules[this.state.scheduleIndex] : [];
        // }
        var requestvalidaetdata = {
            Id: leavedata.Id,
            ClientId: auth.user.ClientId,
            LeaveType: leavedata.leave_type,
            ScheduledDeparture: moment.utc(leavedata.scheduledDeparture).format("MM/DD/YYYY hh:mm A"),
            ScheduledReturn: leavedata.scheduledReturn && stepId === "stepTen" ? moment.utc(leavedata.scheduledReturn).format("MM/DD/YYYY hh:mm A") : null,
            ClientLeaveSchedules: leavedata.clientLeaveSchedules[0].scheduleType <= 0 || stepId === "stepOne" ? [] : leavedata.clientLeaveSchedules.map((val, index) => {
                let scheduleType = -1;
                let destination = -1;
                if (schedules.some(x => x.Id === Number(val.scheduleType) && x.CategoryName === "DestinationType")) {
                    scheduleType = val.scheduleType;
                    destination = val.scheduleType;
                } else {
                    scheduleType = val.scheduleType;
                    destination = -1;
                }
                return {
                    Id: val.id,
                    scheduleType: scheduleType,
                    destinationType: destination > 0 ? destination : null,
                    startDate: val.startDate ? moment.utc(val.startDate).format("MM/DD/YYYY hh:mm A") : null,
                    endDate: val.endDate ? moment.utc(val.endDate).format("MM/DD/YYYY hh:mm A") : null
                }
            })
        };

        if (stepId === "stepFive") {
            requestvalidaetdata.ClientLeaveSchedules = requestvalidaetdata.ClientLeaveSchedules.slice(0, 1);
        }

        this.setState({ loading: true });
        const response = await apiService.postAsync('VALIDATEAGENDA', requestvalidaetdata);
        try {
            if (response.Success && !response.Message) {
                isValidated = true;
                // tempSchedule = [];
                this.setState({ showModal: false, loading: false });

            } else {
                this.props.actions.showAlert({ message: response.Message, variant: 'error', vertical: "top", horizontal: "right" });
                isValidated = false;
                if (invokedby === "modal") {
                    this.setState({ showModal: true });
                }
                this.setState({ loading: false });
            }
        }
        catch (error) {
            this.setState({ loading: false });
            this.props.actions.showAlert({ message: error, variant: 'error' });
        };
        return isValidated;
    }

    getScheduleResctrictions = async (scheduletype, scheduleTypeText, invokedby) => {
        const { auth } = this.props;
        const leavedata = { ...this.state.leavedata };
        const modalscheduledata = { ...this.state.modalscheduledata };
        let tempflag = true;
        let scheduletypecount = 0;
        leavedata.clientLeaveSchedules.map((item, key) => {
            if (Number(scheduletype) === Number(item.scheduleType)) {
                scheduletypecount++;
            }
            return null;
        });
        var requestdata = { ClientId: auth.user.ClientId, ScheduleType: Number(scheduletype), Date: moment(leavedata.scheduledDeparture).format("MM/DD/YYYY") };
        const response = await apiService.postAsync('GETSCHEDULEPHASERESTRICTIONCRITERIAS', requestdata);
        try {
            if (response.Success && response.SchedulePhaseRestictionCriteria) {
                this.setState({ scheduleRestrictions: response.SchedulePhaseRestictionCriteria });
                if (invokedby === "leavewizard" || invokedby === "schedulemodal") {
                    const { scheduleRestrictions } = this.state;
                    if (invokedby === "leavewizard") {
                        if (scheduleRestrictions.IsFull === true) {
                            this.props.actions.showAlert({ message: `You have already requested the maximum weekly number of trips to ${scheduleTypeText} destination.`, variant: 'error', vertical: "top", horizontal: "right" });
                            leavedata.clientLeaveSchedules[0].scheduleType = -1;
                            leavedata.clientLeaveSchedules[0].scheduleTypeText = "";
                            leavedata.clientLeaveSchedules[0].destination = -1;
                            leavedata.clientLeaveSchedules[0].destinationText = "";
                            this.setState({ leavedata });
                            tempflag = false;
                            return false;
                        }
                        if (scheduleRestrictions.IsMonthlyFull === true) {
                            this.props.actions.showAlert({ message: `You have already requested the maximum monthly number of trips to ${scheduleTypeText} destination.`, variant: 'error', vertical: "top", horizontal: "right" });
                            leavedata.clientLeaveSchedules[0].scheduleType = -1;
                            leavedata.clientLeaveSchedules[0].scheduleTypeText = "";
                            leavedata.clientLeaveSchedules[0].destination = -1;
                            leavedata.clientLeaveSchedules[0].destinationText = "";
                            this.setState({ leavedata });
                            tempflag = false;
                            return false;
                        }
                        return tempflag;
                    }
                    else if (invokedby === "schedulemodal") {
                        if (scheduleRestrictions.IsFull === true || scheduleRestrictions.RunningCount + scheduletypecount > scheduleRestrictions.WeeklyCount) {
                            this.props.actions.showAlert({ message: `You have already requested the maximum weekly number of trips to ${scheduleTypeText} destination.`, variant: 'error', vertical: "top", horizontal: "right" });
                            modalscheduledata.scheduleType = -1;
                            modalscheduledata.scheduleTypeText = "";
                            modalscheduledata.destination = -1;
                            modalscheduledata.destinationText = "";
                            this.setState({ modalscheduledata });
                            tempflag = false;
                            return false;
                        }
                        if (scheduleRestrictions.IsMonthlyFull === true || scheduleRestrictions.MonthlyRunningCount + scheduletypecount > scheduleRestrictions.MonthlyCount) {
                            this.props.actions.showAlert({ message: `You have already requested the maximum monthly number of trips to ${scheduleTypeText} destination.`, variant: 'error', vertical: "top", horizontal: "right" });
                            modalscheduledata.scheduleType = -1;
                            modalscheduledata.scheduleTypeText = "";
                            modalscheduledata.destination = -1;
                            modalscheduledata.destinationText = "";
                            this.setState({ modalscheduledata });
                            tempflag = false;
                            return false;
                        }
                        return tempflag;
                    }
                    return tempflag;
                }
            }
        }
        catch (error) {
            this.props.actions.showAlert({ message: error, variant: 'error' });
            this.setState({ scheduleRestrictions: {} });
            tempflag = false;
        }
        return tempflag;
    }
    //#endregion

    //#region Stepper 
    handleStepperScroll = (statsRef) => {
        const tesNode = ReactDOM.findDOMNode(statsRef);
        window.scrollTo(0, tesNode.offsetTop);

    }
    //agenda main page step 7 yes button clickhandler
    handleNext = async () => {
        var currentstep = this.state.activeStep + 1;
        const { leavedata } = { ...this.state };
        if (currentstep === 1) {
            const phaseRestrictions = this.state.phaseRestrictions;
            //LeaveType Required check
            if (Number(leavedata.leave_type) <= 0) {
                this.props.actions.showAlert({ message: 'Primary purpose is required', variant: 'error', vertical: "top", horizontal: "right" });
                return false;
            }
            //schedule departure date validation check
            if (moment(leavedata.scheduledDeparture).diff(new Date(), 'minutes') < phaseRestrictions.AdvanceNoticeMinutes) {
                this.props.actions.showAlert({ message: `Must give at least ${phaseRestrictions.AdvanceNoticeMinutes} minutes notice`, variant: 'error', vertical: "top", horizontal: "right" });
                return false;
            }

            if (phaseRestrictions.IsFull === true) {
                this.props.actions.showAlert({ message: `You have already requested the maximum weekly agendas of type ` + leavedata.leave_typeText, variant: 'error', vertical: "top", horizontal: "right" });
                return false;
            }
            this.updatePhaseRestrictions();
            if (!leavedata.clientLeaveSchedules[0]["startDate"]) {
                leavedata.clientLeaveSchedules[0]["startDate"] = leavedata.scheduledDeparture;
                leavedata.clientLeaveSchedules[0]["startDate_Date"] = leavedata.scheduledDeparture;
                leavedata.clientLeaveSchedules[0]["startDate_Time"] = leavedata.scheduledDeparture;
                this.setState({ leavedata });
            }
            if (leavedata.clientLeaveSchedules && leavedata.clientLeaveSchedules.length > 0) {
                this.adjustLeaveTimes(0);
            }
            const isValidated = await this.validateAgenda("mainwizard", 'stepOne');
            if (!isValidated) {
                return false;
            }
            this.handleStepperScroll(this.myRef[0]);
        }
        else if (currentstep === 2) {
            if (Number(leavedata.clientLeaveSchedules[0].scheduleType) <= 0) {
                this.props.actions.showAlert({ message: 'Destination type is required', variant: 'error', vertical: "top", horizontal: "right" });
                return false;
            }
            if (Number(leavedata.clientLeaveSchedules[0].destination) <= 0) {
                this.props.actions.showAlert({ message: 'Destination is required', variant: 'error', vertical: "top", horizontal: "right" });
                return false;
            }
            let isProceed = await this.getScheduleResctrictions(leavedata.clientLeaveSchedules[0].scheduleType, leavedata.clientLeaveSchedules[0].scheduleTypeText, 'leavewizard');
            if (!isProceed) {
                return false;
            }
            this.handleStepperScroll(this.myRef[1])
        }
        else if (currentstep === 3) {
            if (Number(leavedata.departTransMode) <= 0) {
                this.props.actions.showAlert({ message: 'Transportation mode is required', variant: 'error', vertical: "top", horizontal: "right" });
                return false;
            }
            this.handleStepperScroll(this.myRef[2]);
        }
        else if (currentstep === 4) {

            if (leavedata.clientLeaveSchedules[0].startDate <= leavedata.scheduledDeparture) {
                this.props.actions.showAlert({ message: `Date/Time should be greater than ${moment(leavedata.scheduledDeparture).format("MM/DD/YYYY hh:mm A")}`, variant: 'error', vertical: "top", horizontal: "right" });
                return false;
            }
            let peviousTravelTime = leavedata.departTravelTime;
            let currentTravelTime = moment(leavedata.clientLeaveSchedules[0].startDate).diff(leavedata.scheduledDeparture, 'minutes');
            const diff = currentTravelTime - peviousTravelTime;
            leavedata.clientLeaveSchedules[0]["endDate"] = new Date(moment(leavedata.clientLeaveSchedules[0]["endDate"]).add(diff, 'm'));
            leavedata.clientLeaveSchedules[0]["endDate_Date"] = leavedata.clientLeaveSchedules[0]["endDate"];
            leavedata.clientLeaveSchedules[0]["endDate_Time"] = leavedata.clientLeaveSchedules[0]["endDate"];
            leavedata['departTravelTime'] = moment(leavedata.clientLeaveSchedules[0].startDate).diff(leavedata.scheduledDeparture, 'minutes');

            this.setState({ leavedata });
            this.handleStepperScroll(this.myRef[3]);
        }
        else if (currentstep === 5) {
            const scheduleRestrictions = this.state.scheduleRestrictions;
            if (leavedata.clientLeaveSchedules[0].endDate <= leavedata.clientLeaveSchedules[0].startDate) {
                this.props.actions.showAlert({ message: `Date/Time should be greater than ${moment(leavedata.clientLeaveSchedules[0].startDate).format("MM/DD/YYYY hh:mm A")}`, variant: 'error', vertical: "top", horizontal: "right" });
                return false;
            }
            if (moment(leavedata.clientLeaveSchedules[0].endDate).diff(leavedata.clientLeaveSchedules[0].startDate, 'minutes') > scheduleRestrictions.ScheduleTimeMaxMinutes) {
                this.props.actions.showAlert({ message: `The maximum time at this destination is ${scheduleRestrictions.ScheduleTimeMaxMinutes} minutes`, variant: 'error', vertical: "top", horizontal: "right" });
                return false;
            }
            if (this.state.leavedata.clientLeaveSchedules && this.state.leavedata.clientLeaveSchedules.length > 0) {
                this.adjustLeaveTimes(0);
            }

            const isValidated = await this.validateAgenda("mainwizard", "stepFive");
            if (!isValidated) {
                return false;
            }
            this.handleStepperScroll(this.myRef[4]);
        }
        else if (currentstep === 7) {
            let tempenddate = new Date(leavedata.clientLeaveSchedules[leavedata.clientLeaveSchedules.length - 1]["endDate"]);
            if (!leavedata.scheduledReturn) {
                leavedata.scheduledReturn = tempenddate;
                leavedata.scheduledReturn_Date = tempenddate;
                leavedata.scheduledReturn_Time = tempenddate;
                this.setState({ leavedata });
            }
            this.handleStepperScroll(this.myRef[6]);
        }
        else if (currentstep === 8) {
            if (Number(leavedata.returnTransMode) <= 0) {
                this.props.actions.showAlert({ message: 'Transportation mode is required', variant: 'error', vertical: "top", horizontal: "right" });
                return false;
            }
            this.handleStepperScroll(this.myRef[7]);
        }
        else if (currentstep === 9) {
            const leavedata = this.state.leavedata;
            if (leavedata.scheduledReturn <= leavedata.clientLeaveSchedules[leavedata.clientLeaveSchedules.length - 1].endDate) {
                this.props.actions.showAlert({ message: `Date/Time should be greater than ${moment(leavedata.clientLeaveSchedules[leavedata.clientLeaveSchedules.length - 1].endDate).format('MM/DD/YYYY hh:mm A')}`, variant: 'error', vertical: "top", horizontal: "right" });
                return false;
            }
            leavedata.returnTravelTime = moment(leavedata.scheduledReturn).diff(leavedata.clientLeaveSchedules[leavedata.clientLeaveSchedules.length - 1].endDate, 'minutes');
            this.handleStepperScroll(this.myRef[8]);
        }
        if (currentstep !== 1 || currentstep !== 5) {
            this.setState({ activeStep: currentstep });
        }
    };

    handleBack = () => {
        const { leavedata } = this.state;
        this.setState({ activeStep: this.state.activeStep - 1, leavedata: leavedata });
        const tesNode = ReactDOM.findDOMNode(this.myRef[this.state.activeStep]);
        window.scrollTo(0, tesNode.offsetTop - 140);
    };

    handleFinish = async () => {
        const isValidated = await this.validateAgenda("mainwizard", "stepTen");
        if (!isValidated) {
            return false;
        }
        const { leavedata, globalcodes } = { ...this.state };
        const { auth } = this.props;
        let finalleavedata = JSON.parse(JSON.stringify(this.state.leavedata));
        let schedules = globalcodes.filter(x => x.CategoryName === 'ScheduleType' || x.CategoryName === 'DestinationType');
        let kioskLeaveRequestStatus = globalcodes.filter(x => x.CategoryName === 'KioskLeaveRequestStatus' && x.RecordDeleted === 'N');
        finalleavedata.clientLeaveSchedules.map((item, key) => {
            if (schedules.some(x => x.Id === Number(item.scheduleType) && x.CategoryName === "DestinationType")) {
                item.destinationType = item.scheduleType;
                item.scheduleType = schedules.filter(y => y.CategoryName === 'ScheduleType' && y.CodeName === 'Other')[0].Id;
            }

            item.scheduleDestinationKey = item.destination;
            item.recordDeleted = 'N';
            item.startDate = moment.utc(item.startDate).format("YYYY/MM/DD hh:mm A");
            item.endDate = moment.utc(item.endDate).format("YYYY/MM/DD hh:mm A");
            item.returnsToCenter = (key === leavedata.clientLeaveSchedules.length - 1 ? 'Y' : 'N');
            return null;

        });
        finalleavedata.departTransDriver = Number(finalleavedata.departTransDriver) > 0 ? finalleavedata.departTransDriver : null;
        finalleavedata.departTransVehicle = Number(finalleavedata.departTransVehicle) > 0 ? finalleavedata.departTransVehicle : null;
        finalleavedata.scheduledDeparture = moment.utc(finalleavedata.scheduledDeparture).format("YYYY/MM/DD hh:mm A");
        finalleavedata.scheduledReturn = moment.utc(finalleavedata.scheduledReturn).format("YYYY/MM/DD hh:mm A");
        finalleavedata.returnTransDriver = Number(finalleavedata.returnTransDriver) > 0 ? finalleavedata.returnTransDriver : null;
        finalleavedata.returnTransVehicle = Number(finalleavedata.returnTransVehicle) > 0 ? finalleavedata.returnTransVehicle : null;
        finalleavedata.requestStatus = Number(kioskLeaveRequestStatus.filter(x => x.CodeName === 'Requested')[0].Id);
        finalleavedata.clientId = auth.user.ClientId;
        finalleavedata.recordDeleted = 'N';
        let data = { Json: JSON.stringify(finalleavedata) };
        if (auth.user.IsStaffLogin) {
            data.ModifiedBy = auth.user.StaffUserName;
        }
        this.setState({ loading: true });
        apiService.post('POSTINSERTMODIFYAGENDA', data).then(response => {
            if (response.Success) {
                document.body.classList.remove('addloding');
                this.props.history.push('/Agenda');
                this.props.actions.showAlert({ message: "Your agenda request has been submitted.", variant: 'success' });
            }
            this.setState({ loading: false });
        }, error => {
            this.props.actions.showAlert({ message: error, variant: 'error' });
            this.setState({ loading: false });
        });
    }
    handleReset = () => {
        this.setState({
            activeStep: 0,
            leavedata: {
                Id: -1,
                leave_type: -1,
                leave_typeText: '',
                scheduledDeparture: moment(new Date()).add(1, 'h').toDate().setMinutes(0, 0, 0),
                scheduledDeparture_Date: moment(new Date()).add(1, 'h').toDate().setMinutes(0, 0, 0),
                scheduledDeparture_Time: moment(new Date()).add(1, 'h').toDate().setMinutes(0, 0, 0),
                departTravelTime: 0,
                clientLeaveSchedules: [
                    {
                        id: -1,
                        scheduleType: -1,
                        scheduleTypeText: '',
                        destination: -1,
                        destinationText: '',
                        startDate: '',
                        startDate_Date: '',
                        startDate_Time: '',
                        endDate: '',
                        endDate_Date: '',
                        endDate_Time: '',
                        comments: ''
                    }
                ],
                departTransMode: -1,
                departTransModeText: '',
                departTransDriver: -1,
                departTransVehicle: -1,
                returnTransMode: -1,
                returnTransModeText: '',
                returnTransDriver: -1,
                returnTransVehicle: -1,
                scheduledReturn: '',
                scheduledReturn_Date: '',
                scheduledReturn_Time: '',
                returnTravelTime: '',
                comments: ''
            },
            schedulediff: 0
        });
        window.scrollTo(0, 0)
    };

    handleCloseModal = () => {
        this.setState({
            showModal: false,
            isdisabled: false,
            modalscheduledata: {
                id: -1,
                scheduleType: -1,
                scheduleTypeText: '',
                destination: -1,
                destinationText: '',
                startDate: '',
                startDate_Date: '',
                startDate_Time: '',
                endDate: '',
                endDate_Date: '',
                endDate_Time: '',
                comments: '',
                interimTransMode: -1,
                interimTransModeText: '',
                interimTransDriver: -1,
                interimTransVehicle: -1,
                interimTravelTime: 0
            },
        });
    }

    handleOpenModal = async (e, action, index) => {
        
        e.preventDefault();
        this.setState({ isdisabled: false, });
        const phaseRestrictions = { ...this.state.phaseRestrictions };
        const { leavedata } = JSON.parse(JSON.stringify(this.state));
        if (phaseRestrictions.MaximumSchedules && leavedata.clientLeaveSchedules.length >= phaseRestrictions.MaximumSchedules && action === 'add') {
            this.props.actions.showAlert({ message: 'The maximum number of destinations for this agenda type has been reached', variant: 'error', vertical: "top", horizontal: "right" });
            return false;
        }

        let modalscheduledata = { ...this.state.modalscheduledata };
        var scheduleIndex = action === 'add' ? leavedata.clientLeaveSchedules.length : index;
        if (scheduleIndex === 0) {
            modalscheduledata.startDate = new Date(leavedata.scheduledDeparture);
            modalscheduledata.startDate_Date = new Date(leavedata.scheduledDeparture_Date);
            modalscheduledata.startDate_Time = new Date(leavedata.scheduledDeparture_Time);
        }
        else {
            modalscheduledata.startDate = new Date(leavedata.clientLeaveSchedules[scheduleIndex - 1].endDate);
            modalscheduledata.startDate_Date = new Date(leavedata.clientLeaveSchedules[scheduleIndex - 1].endDate_Date);
            modalscheduledata.startDate_Time = new Date(leavedata.clientLeaveSchedules[scheduleIndex - 1].endDate_Time);
        }
        if (action === 'edit') {

            if (index > 0) {
                modalscheduledata = leavedata.clientLeaveSchedules[scheduleIndex];
                modalscheduledata.interimTransMode = leavedata.clientLeaveSchedules[scheduleIndex - 1].interimTransMode;
                modalscheduledata.interimTransModeText = leavedata.clientLeaveSchedules[scheduleIndex - 1].interimTransModeText;
                modalscheduledata.interimTransDriver = leavedata.clientLeaveSchedules[scheduleIndex - 1].interimTransDriver;
                modalscheduledata.interimTransVehicle = leavedata.clientLeaveSchedules[scheduleIndex - 1].interimTransVehicle;
                modalscheduledata.interimTravelTime = leavedata.clientLeaveSchedules[scheduleIndex - 1].interimTravelTime;
            }
            else {
                modalscheduledata = { ...leavedata.clientLeaveSchedules[scheduleIndex] };
                modalscheduledata.interimTransMode = leavedata.departTransMode;
                modalscheduledata.interimTransModeText = leavedata.departTransModeText;
                modalscheduledata.interimTransDriver = leavedata.departTransDriver;
                modalscheduledata.interimTransVehicle = leavedata.departTransVehicle;
                modalscheduledata.interimTravelTime = leavedata.departTravelTime;
            }
            this.getScheduleResctrictions(modalscheduledata.scheduleType, modalscheduledata.scheduleTypeText, 'modaledit');
            this.getDestinationDetails(modalscheduledata.scheduleTypeText, modalscheduledata.scheduleType);


        }
        this.setState({ activeModalStep: 0, showModal: true, modalscheduledata, scheduleIndex: scheduleIndex, modalaction: action });
    }

    getSteps = () => {
        return ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5', 'Step 6', 'Step 7', 'Step 8', 'Step 9', 'Step 10', 'Step 11'];
    }
    getStepContent = step => {

        const { leavedata, vehicledetails, globalcodes, destinationDetails, driverdetails } = { ...this.state };

        switch (step) {
            case 0:

                return (

                    <div className="setColor" ref={(ref) => { this.myRef[0] = ref }}>
                        <div>
                            <label className="control-label">What is the primary purpose of your agenda request ?</label >
                        </div >
                        <FormControl className="stepper_form_content">
                            <NativeSelect
                                onChange={this.handleChange}
                                name="leave_type"

                                value={leavedata.leave_type}

                            >
                                <option value="-1">Select an Option</option>
                                {
                                    globalcodes.filter(x => x.CategoryName === 'LeaveType' && x.RecordDeleted === "N" && x.CodeName !== "Meeting" && x.CodeName !== "Treatment").map((item, key) => {
                                        return (<option key={key} value={item.Id}>{item.FriendlyName}</option>);
                                    })
                                }
                            </NativeSelect>
                        </FormControl>
                        <div>
                            <label className="control-label" >What date/time are you leaving this center?</label >
                        </div >
                        <div className="row">
                            <div className="datePickerBlock col-md-4 col-sm-6">
                                <StaticDatePicker ref={this.StaticDatePicker} name="scheduledDeparture_Date" defaultDate={leavedata.scheduledDeparture_Date} minDate={moment(new Date()).add(1, 'h').toDate().setMinutes(0, 0, 0)} maxDate={moment(leavedata.scheduledDeparture).add(30, 'd').toDate().setHours(23, 59, 59, 999)} onDateChange={this.handleDateTimeControls}></StaticDatePicker>
                            </div>
                            <div className='selecTimer col-md-4 col-sm-6'>
                                <StaticTimePicker ref={this.StaticTimePicker} name="scheduledDeparture_Time" defaultTime={leavedata.scheduledDeparture_Time} onTimeChange={this.handleDateTimeControls}></StaticTimePicker>
                            </div>

                        </div>

                    </div >
                );
            case 1:

                return (
                    <div className="setColor" ref={(ref) => { this.myRef[1] = ref }}>
                        <div>
                            <label className="control-label" >Where are you going?</label >

                        </div >
                        <FormControl className="stepper_form_content">
                            <NativeSelect
                                onChange={(e) => this.handleScheduleChange(e, 0)}
                                name="scheduleType"
                                value={leavedata.clientLeaveSchedules[0] && leavedata.clientLeaveSchedules[0].scheduleType}
                            >
                                <option value="-1">Select an Option</option>
                                {globalcodes && globalcodes.filter(x => (x.CategoryName === 'ScheduleType' || x.CategoryName === "DestinationType") && !(x.CategoryName === "ScheduleType" && x.CodeName === "Other") && x.CodeName !== "Meeting" && x.CodeName !== "Treatment").map((item, key) => {
                                    return (<option key={key} value={item.Id} > {item.FriendlyName}</option>);
                                })
                                }
                            </NativeSelect>
                        </FormControl>
                        <div>
                            <label className="control-label" >Destination</label >

                        </div >
                        <FormControl className="stepper_form_content">
                            {/* <NativeSelect
                                onChange={(e) => this.handleScheduleChange(e, 0)}
                                name="destination"
                                value={leavedata.clientLeaveSchedules[0] && leavedata.clientLeaveSchedules[0].destination}
                            >
                                <option value="-1">Select an Option</option>
                                {destinationDetails && destinationDetails.map((item, key) => {
                                    return (<option key={key} value={item.Key}> {item.Value}</option>);
                                })
                                }
                            </NativeSelect> */}

                            <Autocomplete
                                options={destinationDetails}
                                getOptionLabel={option => option.Value ? option.Value : option}
                                value={destinationDetails.find((element, i) => {
                                    return leavedata.clientLeaveSchedules[0].destination && element.Key === leavedata.clientLeaveSchedules[0].destination;
                                }) || (leavedata.clientLeaveSchedules[0].scheduleType!==-1 && leavedata.clientLeaveSchedules[0].destination === null && destinationDetails[0])|| ""}
                                onInputChange={(event, value) => this.handleDestinationChange(value, 0)}
                                name="destination"
                                renderInput={params => <TextField {...params} variant="filled" name="destination" />}
                            />
                        </FormControl>
                    </div>
                );
            case 2:
                return (
                    <div className="setColor" ref={(ref) => { this.myRef[2] = ref }}>
                        <div>
                            <label className="control-label" > How will you get to {leavedata.clientLeaveSchedules[0].destinationText} ?</label >
                        </div>
                        <FormControl className="stepper_form_content">
                            <NativeSelect
                                onChange={this.handleChange}
                                name="departTransMode"

                                value={leavedata.departTransMode && leavedata.departTransMode}
                            >
                                <option value="-1">Select an Option</option>
                                {globalcodes && globalcodes.filter(x => x.CategoryName === 'TransportationMode').map((item, key) => {
                                    return (<option key={key} value={item.Id} > {item.FriendlyName}</option>);
                                })
                                }
                            </NativeSelect>
                        </FormControl>
                        {
                            leavedata.departTransModeText && leavedata.departTransModeText === 'Car' &&
                            <Fragment>
                                <div>
                                    <label className="control-label" >Vehicle </label >
                                </div>
                                <FormControl className="stepper_form_content">
                                    <NativeSelect
                                        onChange={this.handleChange}
                                        name="departTransVehicle"

                                        value={leavedata.departTransVehicle && leavedata.departTransVehicle}
                                    >
                                        <option value="-1">Select an Option</option>
                                        {vehicledetails && vehicledetails.map((item, key) => {
                                            return (<option key={key} value={item.Id} > {item.VehicleDescription}</option>);
                                        })
                                        }
                                    </NativeSelect>
                                </FormControl>
                                <div>
                                    <div>
                                        <label className="control-label" >Driver</label >
                                    </div>
                                    <FormControl className="stepper_form_content">
                                        <NativeSelect
                                            name="departTransDriver"
                                            onChange={this.handleChange}
                                            value={leavedata.departTransDriver && leavedata.departTransDriver}
                                        >
                                            <option value="-1">Select an Option</option>
                                            {driverdetails && driverdetails.map((item, key) => {
                                                return (<option key={key} value={item.Id} > {item.Name}</option>);
                                            })
                                            }
                                        </NativeSelect>
                                    </FormControl>

                                    <label className="control-label" >Note: If you do not have valid vehicle and/or driver information on file, your driver will be required to provide their license, registration and insurance information before you can sign out. </label >
                                </div>
                            </Fragment>
                        }
                    </div>


                );
            case 3:
                return (
                    <div className="setColor" ref={(ref) => { this.myRef[3] = ref }}>
                        <div>
                            <label className="control-label" > What time will you arrive at {leavedata.clientLeaveSchedules[0].destinationText}?</label >
                        </div >
                        <div className="row">
                            <div className="datePickerBlock col-md-4 col-sm-6">

                                <StaticDatePicker name="startDate_Date" minDate={leavedata.scheduledDeparture} maxDate={moment(leavedata.scheduledDeparture).add(30, 'd').toDate().setHours(23, 59, 59, 999)} defaultDate={leavedata.clientLeaveSchedules[0].startDate_Date} objIndex='0' onDateChange={this.handleScheduleDateTimeControls}></StaticDatePicker>
                            </div>
                            <div className="selecTimer col-md-4 col-sm-6">
                                <StaticTimePicker name="startDate_Time" defaultTime={leavedata.clientLeaveSchedules[0].startDate_Time} objIndex='0' onTimeChange={this.handleScheduleDateTimeControls}></StaticTimePicker>

                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="setColor" ref={(ref) => { this.myRef[4] = ref }}>
                        <div>
                            <label className="control-label" > What time will you be leaving {leavedata.clientLeaveSchedules[0].destinationText}?</label >
                        </div >
                        <div className="row">
                            <div className="datePickerBlock col-md-4 col-sm-6">
                                <StaticDatePicker name="endDate_Date" defaultDate={leavedata.clientLeaveSchedules[0].endDate_Date} minDate={leavedata.clientLeaveSchedules[0].startDate} maxDate={moment(leavedata.clientLeaveSchedules[0].startDate).add(30, 'd').toDate().setHours(23, 59, 59, 999)} objIndex='0' onDateChange={this.handleScheduleDateTimeControls}></StaticDatePicker>
                            </div>
                            <div className="selecTimer col-md-4 col-sm-6">
                                <StaticTimePicker name="endDate_Time" defaultTime={leavedata.clientLeaveSchedules[0].endDate_Time} objIndex='0' onTimeChange={this.handleScheduleDateTimeControls}></StaticTimePicker>
                            </div>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="setColor" ref={(ref) => { this.myRef[5] = ref }}>
                        <div>
                            <label className="control-label" >Comments</label >
                        </div >
                        <textarea className="form-control stepper_form_content" rows="3" id="comment" name='comments' onChange={(e) => this.handleScheduleChange(e, 0)} value={this.state.leavedata.clientLeaveSchedules[0].comments}></textarea>
                    </div>
                );
            case 6:
                return (
                    <div className="setColor tableFormatter" ref={(ref) => { this.myRef[6] = ref }}>
                        <table>
                            <tbody>
                                {/* <tr ><th colSpan="2">Departing the center at: {moment(this.state.leavedata.scheduledDeparture).format("MM/DD hh:mm A")} </th></tr>
                                <tr ><td colSpan="2">Travel by {this.state.leavedata.departTransModeText} : <u>{moment(this.state.leavedata.clientLeaveSchedules[0].startDate).diff(moment(this.state.leavedata.scheduledDeparture), 'minutes')} minutes</u></td></tr> */}
                                <tr ><th colSpan="2">Departing the center at: {moment(leavedata.scheduledDeparture).format("MM/DD hh:mm A")} </th></tr>
                                <tr ><td colSpan="2">Travel by {leavedata.departTransModeText} : <u>{leavedata.departTravelTime} minutes</u></td></tr>

                                {leavedata.clientLeaveSchedules.map((schedule, key) => {
                                    const travelBy = schedule.interimTransMode && schedule.interimTravelTime ? <tr><td>Travel by {schedule.interimTransModeText} : <u>{schedule.interimTravelTime} minutes</u></td></tr> : null;
                                    return (
                                        <Fragment key={key}>

                                            <tr><td>At <u>{schedule.destinationText}</u> from <u>{moment(schedule.startDate).format("MM/DD hh:mm A")}</u> to <u>{moment(schedule.endDate).format("MM/DD hh:mm A")}</u></td>
                                                <td className="flexRight editorIcon">{key >= 1 && <i onClick={(e) => this.handleDeleteschedule(e, key)} className="fa fa-trash"></i>}<i onClick={(e) => this.handleOpenModal(e, 'edit', key)} className="fa fa-edit"></i></td></tr>
                                            {travelBy}
                                        </Fragment>
                                    )
                                })

                                }
                                <tr><td><b>Will you be returning to the center (or to home) from {leavedata.clientLeaveSchedules[leavedata.clientLeaveSchedules.length - 1].destinationText}?</b></td><td className="yesNoBtn"><button onClick={this.handleNext}>YES</button><button onClick={(e) => this.handleOpenModal(e, 'add', null)}>NO</button></td></tr>
                            </tbody>
                        </table>

                    </div >

                );
            case 7:
                return (
                    <div className="setColor" ref={(ref) => { this.myRef[7] = ref }}>
                        <div>
                            <label className="control-label" >How will you get back to the center?</label >
                        </div >
                        <FormControl className="stepper_form_content">
                            <NativeSelect
                                value={leavedata.returnTransMode && leavedata.returnTransMode}
                                onChange={this.handleChange}
                                name="returnTransMode"

                            >
                                <option value="-1">Select an Option</option>
                                {globalcodes && globalcodes.filter(x => x.CategoryName === 'TransportationMode').map((item, key) => {
                                    return (<option key={key} value={item.Id} > {item.FriendlyName}</option>);
                                })
                                }
                            </NativeSelect>
                        </FormControl>
                        {
                            leavedata.returnTransModeText && leavedata.returnTransModeText === 'Car' &&
                            <Fragment>
                                <div>
                                    <label className="control-label" >Vehicle </label >
                                </div>
                                <FormControl className="stepper_form_content">
                                    <NativeSelect
                                        onChange={this.handleChange}
                                        name="returnTransVehicle"

                                        value={leavedata.returnTransVehicle && leavedata.returnTransVehicle}
                                    >
                                        <option value="-1">Select an Option</option>
                                        {vehicledetails && vehicledetails.map((item, key) => {
                                            return (<option key={key} value={item.Id} > {item.VehicleDescription}</option>);
                                        })
                                        }
                                    </NativeSelect>
                                </FormControl>
                                <div>
                                    <label className="control-label" >Driver</label >
                                </div>
                                <FormControl className="stepper_form_content">
                                    <NativeSelect
                                        name="returnTransDriver"
                                        onChange={this.handleChange}

                                        value={leavedata.returnTransDriver && leavedata.returnTransDriver}
                                    >
                                        <option value="-1">Select an Option</option>
                                        {driverdetails && driverdetails.map((item, key) => {
                                            return (<option key={key} value={item.Id} > {item.Name}</option>);
                                        })
                                        }
                                    </NativeSelect>
                                </FormControl>

                                <div className="stepper_form_content">
                                    <label className="control-label" >Note: If you do not have valid vehicle and/or driver information on file, your driver will be required to provide their license, registration and insurance information before you can sign out. </label >
                                </div>
                            </Fragment>
                        }
                    </div>
                );

            case 8:
                return (
                    <div className="setColor" ref={(ref) => { this.myRef[8] = ref }}>
                        <div>
                            <label className="control-label" > What time will you arrive back at the center?</label >
                        </div >
                        <div className="row">
                            <div className="datePickerBlock col-md-4 col-sm-6">
                                <StaticDatePicker name="scheduledReturn_Date" minDate={leavedata.clientLeaveSchedules[leavedata.clientLeaveSchedules.length - 1].endDate} maxDate={moment(leavedata.clientLeaveSchedules[leavedata.clientLeaveSchedules.length - 1].endDate).add(30, 'd').toDate().setHours(23, 59, 59, 999)} defaultDate={leavedata.scheduledReturn_Date} onDateChange={this.handleDateTimeControls}></StaticDatePicker>
                            </div>
                            <div className="selecTimer col-md-4 col-sm-6">
                                <StaticTimePicker name="scheduledReturn_Time" defaultTime={leavedata.scheduledReturn_Time} onTimeChange={this.handleDateTimeControls}></StaticTimePicker>
                            </div>
                        </div>
                    </div>
                );
            case 9:
                return (
                    <div className="setColor" ref={(ref) => { this.myRef[9] = ref }}>
                        <div >
                            <label className="control-label" >Comments</label >
                        </div >
                        <textarea className="form-control stepper_form_content" rows="3" id="comment" name='comments' onChange={this.handleChange} value={leavedata.comments}></textarea>
                    </div>
                );
            case 10:
                return (
                    <div className="setColor tableFormatter" ref={(ref) => { this.myRef[10] = ref }}>
                        <table>
                            <tbody>
                                <tr><th colSpan="2">Departing the center at: {moment(leavedata.scheduledDeparture).format("MM/DD hh:mm A")} </th></tr>
                                <tr><td colSpan="2">Travel by {leavedata.departTransModeText} : <u>{leavedata.departTravelTime} minutes</u></td></tr>
                                {leavedata.clientLeaveSchedules.map((schedule, key) => {
                                    const travelBy = schedule.interimTransMode && schedule.interimTravelTime ? <tr><td>Travel by {schedule.interimTransModeText} : <u>{schedule.interimTravelTime} minutes</u></td></tr> : null;
                                    return (
                                        <Fragment key={key}>

                                            <tr ><td>At <u>{schedule.destinationText} </u> from <u>{moment(schedule.startDate).format("MM/DD hh:mm A")}</u> to <u>{moment(schedule.endDate).format("MM/DD hh:mm A")}</u></td></tr>
                                            {travelBy}
                                        </Fragment>
                                    );

                                })
                                }
                                <tr><td>Travel By {leavedata.returnTransModeText} : <u>{moment(leavedata.scheduledReturn).diff(moment(leavedata.clientLeaveSchedules[leavedata.clientLeaveSchedules.length - 1].endDate), 'minutes')} minutes</u> </td></tr>
                                <tr><th>Returning to the center (or to home) by {moment(leavedata.scheduledReturn).format("MM/DD hh:mm A")}</th></tr>
                            </tbody>
                        </table>

                    </div>
                );
            default:
                return null;
        }
    }
    //#endregion

    handleChange = (e) => {
        const { leavedata } = this.state;
        leavedata[e.target.name] = e.target.value;
        if (e.target.name === "leave_type" && e.target.value) {
            leavedata["leave_typeText"] = e.target[e.target.selectedIndex].text;
            this.updatePhaseRestrictions();
        }
        if (e.target.name === "departTransMode" && e.target.value) {
            leavedata['departTransModeText'] = e.target[e.target.selectedIndex].text;
            leavedata["departTransDriver"] = -1;
            leavedata["departTransVehicle"] = -1;
        }
        if (e.target.name === "returnTransMode" && e.target.value) {
            leavedata['returnTransModeText'] = e.target[e.target.selectedIndex].text;
            leavedata["returnTransDriver"] = -1;
            leavedata["returnTransVehicle"] = -1;
        }
        this.setState({ leavedata });

    }

    handleScheduleChange = async (e, index) => {
        const leavedata = { ...this.state.leavedata };
        let name = e.target.name;
        let value = e.target.value;

        leavedata.clientLeaveSchedules[index][name] = value;
        if (name === "scheduleType" && value) {
            let text = e.target[e.target.selectedIndex].text;
            leavedata.clientLeaveSchedules[index]["scheduleTypeText"] = text;
            let isProceed = await this.getScheduleResctrictions(value, text, 'leavewizard');
            this.getDestinationDetails(text, value);
            leavedata.clientLeaveSchedules[index]["destination"] = null;
            leavedata.clientLeaveSchedules[index]["destinationText"] = '';
            
            if (!isProceed) {
                return false;
            }
        }
        // if (name === "destination" && value) {
        //     let text = e.target[e.target.selectedIndex].text;
        //     leavedata.clientLeaveSchedules[index]['destinationText'] = text;
        // }
        this.setState({ leavedata });
    }

    handleDestinationChange = async (selectedValue, index) => {
        const leavedata = { ...this.state.leavedata };
        const destinationDetails = this.state.destinationDetails;
        let destinationindex = destinationDetails.findIndex(data => data.Value == selectedValue);
        if (destinationindex >-1) {
            let text = selectedValue;
            let value = destinationDetails[destinationindex].Key;

            leavedata.clientLeaveSchedules[index]["destination"] = value;
            leavedata.clientLeaveSchedules[index]['destinationText'] = text;
        }
        else {
            leavedata.clientLeaveSchedules[index]["destination"] = null;
            leavedata.clientLeaveSchedules[index]['destinationText'] = "";
        }
        this.setState({ leavedata });
    }

    handleDateTimeControls = (data, name) => {
        const { leavedata } = { ...this.state };
        var stateName = name.substr(0, name.indexOf('_'));
        leavedata[name] = data;
        this.setState({ leavedata });
        var date = new Date(leavedata[stateName + '_Date']);
        var time = new Date(leavedata[stateName + '_Time']);
        if (date && time) {
            date = new Date(date.setHours(time.getHours()));
            date = new Date(date.setMinutes(time.getMinutes()));
            leavedata[stateName] = date;
            this.setState({
                leavedata
            });
        }
    }

    handleScheduleDateTimeControls = (data, name, index) => {
        const { leavedata } = { ...this.state };
        var stateName = name.substr(0, name.indexOf('_'));
        leavedata.clientLeaveSchedules[index][name] = data;
        this.setState({ leavedata });
        var date = new Date(leavedata.clientLeaveSchedules[index][stateName + '_Date']);
        var time = new Date(leavedata.clientLeaveSchedules[index][stateName + '_Time']);
        if (date && time) {
            date = new Date(date.setHours(time.getHours()));
            date = new Date(date.setMinutes(time.getMinutes()));
            leavedata.clientLeaveSchedules[index][stateName] = date;
            this.setState({
                leavedata
            });
        }
    }

    handleModalScheduleDateTimeControls = (data, name) => {
        const modalscheduledata = { ...this.state.modalscheduledata };
        var stateName = name.substr(0, name.indexOf('_'));
        modalscheduledata[name] = data;
        this.setState({ modalscheduledata });
        var date = new Date(modalscheduledata[stateName + '_Date']);
        var time = new Date(modalscheduledata[stateName + '_Time']);
        if (date && time) {
            date = new Date(date.setHours(time.getHours()));
            date = new Date(date.setMinutes(time.getMinutes()));
            modalscheduledata[stateName] = date;
            this.setState({
                modalscheduledata
            });
        }
    }

    handleClientAllowLeavesModal = () => {
        this.setState({ showModalAudit: true });
    }

    handleDeleteschedule = (e, index) => {
        const { clientLeaveSchedules } = { ...this.state.leavedata };
        clientLeaveSchedules.splice(index, 1);
        // clientLeaveSchedules.map((item, key) => {
        //});
        this.setState({ clientLeaveSchedules });

        this.adjustLeaveTimes(index);
    }
    //Modal functions 
    getModalSteps = () => {
        return ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'];
    }

    onModalChange = async (e) => {
        const modalscheduledata = { ...this.state.modalscheduledata };
        let value = e.target.value;
        let name = e.target.name;
        modalscheduledata[e.target.name] = value;
        if (name === "scheduleType" && value) {
            let text = e.target[e.target.selectedIndex].text;
            modalscheduledata["scheduleTypeText"] = text;
            let isProceed = await this.getScheduleResctrictions(modalscheduledata.scheduleType, text, 'schedulemodal');
            this.getDestinationDetails(text, value);
            modalscheduledata.destination = null;
            modalscheduledata.destinationText = '';
            if (!isProceed) {
                return false;
            }
        }
        // if (name === "destination" && value) {
        //     let text = e.target[e.target.selectedIndex].text;
        //     modalscheduledata["destinationText"] = text;
        // }
        if (name === "interimTransMode" && value) {
            let text = e.target[e.target.selectedIndex].text;
            modalscheduledata['interimTransModeText'] = text;
            modalscheduledata["interimTransDriver"] = -1;
            modalscheduledata["interimTransVehicle"] = -1;

        }
        this.setState({ modalscheduledata });

    }

    onModalDestinationChange = async (selectedValue) => {
        debugger;
        const modalscheduledata = { ...this.state.modalscheduledata };
        const destinationDetails = this.state.destinationDetails;
        let destinationindex = destinationDetails.findIndex(data => data.Value == selectedValue);
        if (destinationindex >-1) {
            let text = selectedValue;
            let value = destinationDetails[destinationindex].Key;
            modalscheduledata["destination"] = value;
            modalscheduledata["destinationText"] = text;
        }
        else {
            modalscheduledata["destination"] = null;
            modalscheduledata["destinationText"] = "";
        }
        this.setState({ modalscheduledata });
    }

    getHorizontalStepContent = (stepIndex) => {
        const { globalcodes, destinationDetails, driverdetails, vehicledetails, modalscheduledata } = this.state;
        switch (stepIndex) {
            case 0:
                return (
                    <div className="setColor">
                        <div>
                            <label className="control-label" >Where are you going?</label >
                        </div >
                        <FormControl >
                            <NativeSelect
                                onChange={this.onModalChange}
                                name="scheduleType"
                                value={modalscheduledata.scheduleType}
                            >
                                <option value="-1">Select an Option</option>
                                {globalcodes && globalcodes.filter(x => (x.CategoryName === 'ScheduleType' || x.CategoryName === "DestinationType") && !(x.CategoryName === "ScheduleType" && x.CodeName === "Other") && x.CodeName !== "Meeting" && x.CodeName !== "Treatment").map((item, key) => {
                                    return (<option value={item.Id} key={key}> {item.FriendlyName}</option>);
                                })
                                }
                            </NativeSelect>
                        </FormControl>
                        <div>
                            <label className="control-label" >Destination</label >
                        </div >
                        <FormControl id="stepper_form_content">
                            {/* <NativeSelect
                                onChange={this.onModalChange}
                                name="destination"
                                value={modalscheduledata.destination}
                            >
                                <option value="-1">Select an Option</option>
                                {destinationDetails && destinationDetails.map((item, key) => {
                                    return (<option key={key} value={item.Key}> {item.Value}</option>);
                                })
                                }
                            </NativeSelect> */}
                            <Autocomplete
                                options={destinationDetails}
                                getOptionLabel={option => option.Value ? option.Value : option}
                                value={destinationDetails.find((element, i) => {
                                    return modalscheduledata.destination && element.Key === modalscheduledata.destination;
                                }) || (modalscheduledata.scheduleType !== -1 && modalscheduledata.destination === null && destinationDetails[0]) || ""}
                                onInputChange={(event, value) => this.onModalDestinationChange(value)}
                                name="destination"
                                renderInput={params => <TextField {...params} variant="filled" name="destination" />}
                            />
                        </FormControl>
                    </div>
                );
            case 1:
                return (
                    <div className="setColor">
                        <div>
                            <label className="control-label" > How will you get to {modalscheduledata.destinationText} ?</label >
                        </div>
                        <FormControl >
                            <NativeSelect

                                onChange={this.onModalChange}
                                name="interimTransMode"
                                value={modalscheduledata.interimTransMode}
                            >
                                <option value="-1">Select an Option</option>
                                {globalcodes && globalcodes.filter(x => x.CategoryName === 'TransportationMode').map((item, key) => {
                                    return (<option value={item.Id} > {item.FriendlyName}</option>);
                                })
                                }
                            </NativeSelect>
                        </FormControl>
                        {modalscheduledata.interimTransModeText && modalscheduledata.interimTransModeText === 'Car' &&
                            <Fragment>
                                <div>
                                    <label className="control-label" >Vehicle </label >
                                </div>
                                <FormControl >
                                    <NativeSelect
                                        onChange={this.onModalChange}
                                        name="interimTransVehicle"

                                        value={modalscheduledata.interimTransVehicle}
                                    >
                                        <option value="-1">Select an Option</option>
                                        {vehicledetails && vehicledetails.map((item, key) => {
                                            return (<option value={item.Id} > {item.VehicleDescription}</option>);
                                        })
                                        }
                                    </NativeSelect>
                                </FormControl>
                                <div>
                                    <label className="control-label" >Driver</label >
                                </div>
                                <FormControl >
                                    <NativeSelect
                                        name="interimTransDriver"
                                        onChange={this.onModalChange}

                                        value={modalscheduledata.interimTransDriver}
                                    >
                                        <option value="-1">Select an Option</option>
                                        {driverdetails && driverdetails.map((item, key) => {
                                            return (<option value={item.Id} > {item.Name}</option>);
                                        })
                                        }
                                    </NativeSelect>
                                </FormControl>
                                <div>
                                    <label className="control-label" >Note: If you do not have valid vehicle and/or driver information on file, your driver will be required to provide their license, registration and insurance information before you can sign out. </label >
                                </div>
                            </Fragment>
                        }
                    </div>
                );
            case 2:
                return (
                    <div className="setColor">
                        <div>
                            <label className="control-label" > What time will you arrive at {modalscheduledata.destinationText}?</label >
                        </div >
                        <div className="row">
                            <div className="datePickerBlock col-md-4 col-sm-6">
                                <StaticDatePicker name="startDate_Date" defaultDate={modalscheduledata.startDate_Date} onDateChange={this.handleModalScheduleDateTimeControls}></StaticDatePicker>
                            </div>
                            <div className="selecTimer col-md-4 col-sm-6">
                                <StaticTimePicker name="startDate_Time" defaultTime={modalscheduledata.startDate_Time} onTimeChange={this.handleModalScheduleDateTimeControls}></StaticTimePicker>
                            </div>
                        </div>
                    </div>
                );


            case 3:
                return (
                    <div className="setColor">
                        <div>
                            <label className="control-label" > What time will you leaving {modalscheduledata.destinationText}?</label >
                        </div>
                        <section className="row">
                            <div className="datePickerBlock col-md-4 col-sm-6">
                                <StaticDatePicker name="endDate_Date" defaultDate={modalscheduledata.endDate_Date} onDateChange={this.handleModalScheduleDateTimeControls}></StaticDatePicker>
                            </div>
                            <div className="selecTimer col-md-4 col-sm-6">
                                <StaticTimePicker name="endDate_Time" defaultTime={modalscheduledata.endDate_Time} onTimeChange={this.handleModalScheduleDateTimeControls}></StaticTimePicker>
                            </div>
                        </section>
                    </div>
                );
            case 4:
                return (
                    <div className="setColor">
                        <div>
                            <label className="control-label" > Comments</label >
                        </div >
                        <textarea className="form-control" rows="3" id="comment" name='comments' onChange={this.onModalChange} value={modalscheduledata.comments}></textarea>
                    </div>
                );
            default:
                return null;
        }
    }

    handleModalNext = async () => {
        const { activeModalStep, modalscheduledata, leavedata, scheduleIndex, modalaction } = { ...this.state };
        var currentstep = activeModalStep + 1;
        if (currentstep === 1) {
            if (Number(modalscheduledata.scheduleType) <= 0) {

                this.props.actions.showAlert({ message: 'Destination type is required', variant: 'error', vertical: "top", horizontal: "right" });
                return false;
            }
            if (Number(modalscheduledata.destination) <= 0) {
                this.props.actions.showAlert({ message: 'Destination is required', variant: 'error', vertical: "top", horizontal: "right" });
                return false;
            }
            let isProceed = await this.getScheduleResctrictions(modalscheduledata.scheduleType, modalscheduledata.scheduleTypeText, 'schedulemodal');
            if (!isProceed) {
                return false;
            }
        }
        else if (currentstep === 2) {
            if (Number(modalscheduledata.interimTransMode) <= 0) {
                this.props.actions.showAlert({ message: 'Transportation mode is required', variant: 'error', vertical: "top", horizontal: "right" });
                return false;
            }
        }
        else if (currentstep === 3) {
            var schedulestart = '';
            if (scheduleIndex === 0) {
                schedulestart = new Date(leavedata.scheduledDeparture);
            }
            else {
                schedulestart = new Date(leavedata.clientLeaveSchedules[scheduleIndex - 1].endDate);
            }
            if (modalscheduledata.startDate <= schedulestart) {
                this.props.actions.showAlert({ message: `Date/Time should be greater than ${moment(schedulestart).format('MM/DD/YYYY hh:mm A')}`, variant: 'error', vertical: "top", horizontal: "right" });
                return false;
            }
            if (modalaction === 'add') {
                let endDate = '';
                if (modalscheduledata.endDate) {
                    endDate = new Date(moment(modalscheduledata.startDate).add(this.state.schdeulediff, 'm'));
                }
                else {
                    endDate = modalscheduledata.startDate;
                }
                modalscheduledata.endDate = endDate;
                modalscheduledata.endDate_Date = endDate;
                modalscheduledata.endDate_Time = endDate;
            }
            if (modalscheduledata.endDate && modalaction === 'edit') {
                let oldstartdate = new Date(leavedata.clientLeaveSchedules[scheduleIndex].startDate);
                if (oldstartdate < modalscheduledata.startDate) {
                    let diffmin = moment(leavedata.clientLeaveSchedules[scheduleIndex].endDate).diff(oldstartdate, 'minutes');
                    let endDate = new Date(moment(modalscheduledata.startDate).add(diffmin, 'm'));
                    modalscheduledata.endDate = endDate;
                    modalscheduledata.endDate_Date = endDate;
                    modalscheduledata.endDate_Time = endDate;
                }
            }
            modalscheduledata.interimTravelTime = moment(modalscheduledata.startDate).diff(schedulestart, 'minutes');
            this.setState({ modalscheduledata });
        }
        else if (currentstep === 4) {
            const scheduleRestrictions = this.state.scheduleRestrictions;
            if (modalscheduledata.endDate <= modalscheduledata.startDate) {
                this.props.actions.showAlert({ message: `Date/Time should be greater than ${moment(modalscheduledata.startDate).format('MM/DD/YYYY hh:mm A')}`, variant: 'error', vertical: "top", horizontal: "right" });
                return false;
            }
            if (moment(modalscheduledata.endDate).diff(modalscheduledata.startDate, 'minutes') >= scheduleRestrictions.ScheduleTimeMaxMinutes) {
                this.props.actions.showAlert({ message: `The maximum time at this destination is ${scheduleRestrictions.ScheduleTimeMaxMinutes} minutes`, variant: 'error', vertical: "top", horizontal: "right" });
                return false;
            }
        }

        this.setState({ activeModalStep: currentstep, schdeulediff: moment(modalscheduledata.endDate).diff(modalscheduledata.startDate, 'minutes') });
    };

    handleModalBack = () => {
        const { activeModalStep } = this.state;
        this.setState({ activeModalStep: activeModalStep - 1 });
    };

    handleModalReset = () => {
        this.setState({ activeStep: 0 });
    };

    //index is scheduleindex of leave
    adjustLeaveTimes = (index) => {
        const { leavedata } = { ...this.state };

        for (var i = index; i < leavedata.clientLeaveSchedules.length; i++) {
            var priorDeparture = i === 0 ? leavedata.scheduledDeparture : leavedata.clientLeaveSchedules[i - 1].endDate;
            var travelTime = i === 0 ? leavedata.departTravelTime : leavedata.clientLeaveSchedules[i - 1].interimTravelTime;
            var previousStartDate = new Date(leavedata.clientLeaveSchedules[i].startDate);

            leavedata.clientLeaveSchedules[i].startDate = new Date(moment(priorDeparture).add(travelTime, 'm'));
            leavedata.clientLeaveSchedules[i].startDate_Date = new Date(moment(priorDeparture).add(travelTime, 'm'));
            leavedata.clientLeaveSchedules[i].startDate_Time = new Date(moment(priorDeparture).add(travelTime, 'm'));

            // Bug 1341
            var endTime = moment(leavedata.clientLeaveSchedules[i].endDate).diff(moment(previousStartDate), 'minutes');
            leavedata.clientLeaveSchedules[i].endDate = new Date(moment(leavedata.clientLeaveSchedules[i].startDate).add(endTime, 'm'));
            leavedata.clientLeaveSchedules[i].endDate_Date = new Date(moment(leavedata.clientLeaveSchedules[i].startDate).add(endTime, 'm'));
            leavedata.clientLeaveSchedules[i].endDate_Time = new Date(moment(leavedata.clientLeaveSchedules[i].startDate).add(endTime, 'm'));
        };

        if (leavedata.scheduledReturn) {
            let returnTravelTime = leavedata.returnTravelTime;
            let tempschedulereturn = new Date(moment(new Date(leavedata.clientLeaveSchedules[leavedata.clientLeaveSchedules.length - 1].endDate)).add(returnTravelTime, 'm'));

            leavedata.scheduledReturn = tempschedulereturn;
            leavedata.scheduledReturn_Date = tempschedulereturn;
            leavedata.scheduledReturn_Time = tempschedulereturn;

        }
        this.setState({ leavedata });
    }
    handleModalFinish = async () => {
        this.setState({ isdisabled: true });
        const { modalscheduledata, modalaction, scheduleIndex } = { ...this.state };
        let leavedata = { ...this.state.leavedata };
        const templeavedata = JSON.parse(JSON.stringify(leavedata));
        let { clientLeaveSchedules } = leavedata;
        if (modalaction === 'add') {
            clientLeaveSchedules.push(modalscheduledata);
        }
        else {
            clientLeaveSchedules[scheduleIndex].id = modalscheduledata.id;
            clientLeaveSchedules[scheduleIndex].scheduleType = modalscheduledata.scheduleType;
            clientLeaveSchedules[scheduleIndex].scheduleTypeText = modalscheduledata.scheduleTypeText;
            clientLeaveSchedules[scheduleIndex].destination = modalscheduledata.destination;
            clientLeaveSchedules[scheduleIndex].destinationText = modalscheduledata.destinationText;
            clientLeaveSchedules[scheduleIndex].startDate = modalscheduledata.startDate;
            clientLeaveSchedules[scheduleIndex].startDate_Date = modalscheduledata.startDate_Date;
            clientLeaveSchedules[scheduleIndex].startDate_Time = modalscheduledata.startDate_Time;
            clientLeaveSchedules[scheduleIndex].endDate = modalscheduledata.endDate;
            clientLeaveSchedules[scheduleIndex].endDate_Date = modalscheduledata.endDate_Date;
            clientLeaveSchedules[scheduleIndex].endDate_Time = modalscheduledata.endDate_Time;
            clientLeaveSchedules[scheduleIndex].comments = modalscheduledata.comments;
        }


        if (scheduleIndex > 0) {
            // clientLeaveSchedules[scheduleIndex] = modalscheduledata;
            clientLeaveSchedules[scheduleIndex - 1].interimTravelTime = modalscheduledata.interimTravelTime;
            clientLeaveSchedules[scheduleIndex - 1].interimTransMode = modalscheduledata.interimTransMode;
            clientLeaveSchedules[scheduleIndex - 1].interimTransModeText = modalscheduledata.interimTransModeText;
            clientLeaveSchedules[scheduleIndex - 1].interimTransDriver = modalscheduledata.interimTransDriver;
            clientLeaveSchedules[scheduleIndex - 1].interimTransVehicle = modalscheduledata.interimTransVehicle;

            if (modalaction === 'add') {
                clientLeaveSchedules[scheduleIndex].interimTravelTime = null;
                clientLeaveSchedules[scheduleIndex].interimTransMode = null;
                clientLeaveSchedules[scheduleIndex].interimTransModeText = '';
                clientLeaveSchedules[scheduleIndex].interimTransDriver = null;
                clientLeaveSchedules[scheduleIndex].interimTransVehicle = null;
            }


        }
        else {
            leavedata.departTravelTime = modalscheduledata.interimTravelTime;
            leavedata.departTransMode = modalscheduledata.interimTransMode;
            leavedata.departTransModeText = modalscheduledata.interimTransModeText;
            leavedata.departTransDriver = modalscheduledata.interimTransDriver;
            leavedata.departTransVehicle = modalscheduledata.interimTransVehicle;
        }

        leavedata.clientLeaveSchedules = clientLeaveSchedules;
        this.setState({
            leavedata: leavedata,
        });
        const isValidated = await this.validateAgenda("modal", "modalfinish");
        if (!isValidated) {
            this.setState({ isdisabled: false, leavedata: templeavedata });
            return false;
        }
        else {
            this.setState({
                modalscheduledata: {
                    scheduleType: -1,
                    scheduleTypeText: '',
                    destination: -1,
                    destinationText: '',
                    startDate: '',
                    startDate_Date: '',
                    startDate_Time: '',
                    endDate: '',
                    endDate_Date: '',
                    endDate_Time: '',
                    comments: '',
                    interimTransMode: -1,
                    interimTransModeText: '',
                    interimTransDriver: -1,
                    interimTransVehicle: -1,
                    interimTravelTime: 0
                },
                schedulediff: 0,
                isdisabled: false
            });
            this.adjustLeaveTimes(scheduleIndex);
        }

    }
    render() {
        const steps = this.getSteps();
        const modalsteps = this.getModalSteps();
        const loader = this.getAddClass()
        const { showModalAudit, showModal, activeStep, activeModalStep, isdisabled } = this.state;
        return (
            <div className="Stepper_form">
                <ClientAllowLeavesModal onClose={() => this.setState({ showModalAudit: false })} showModalAudit={showModalAudit} />
                <button type="button" className="btn btn-link stepperDetailIcon" title="DETAILS" onClick={this.handleClientAllowLeavesModal} ><i className="fa fa-info-circle" aria-hidden="true" /></button>
                <Stepper activeStep={activeStep} orientation="vertical" className="stepperForm">
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                            <StepContent>
                                <Typography component={'span'}>{this.getStepContent(index)}</Typography>
                                <div className="agendaBtn">
                                    {
                                        activeStep > 0 &&
                                        <Button color="secondary" variant="contained" onClick={this.handleReset}>
                                            Start Over
                                            </Button>
                                    }
                                    {activeStep !== 6 &&
                                        <div>
                                            <Button variant="contained" color="primary" disabled={activeStep === 0} onClick={this.handleBack} >Back </Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                name={activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                                onClick={activeStep === steps.length - 1 ? this.handleFinish : this.handleNext}

                                            >
                                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                            </Button>
                                        </div>}
                                </div>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
                <NotificationContainer />
                <Modal className="stepperModal" size="xl" show={showModal} onHide={this.handleCloseModal}
                    aria-labelledby="example-modal-sizes-title-lg"
                    centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="example-modal-sizes-title-lg">
                            Add/Edit Destinations
                </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div >
                            <Stepper activeStep={activeModalStep} nonLinear>
                                {modalsteps.map(label => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            <div>
                                {activeModalStep === modalsteps.length ? (
                                    <div>
                                        <Typography component={'span'}>All steps completed</Typography>
                                        <Button onClick={this.handleModalReset}>Reset</Button>
                                    </div>
                                ) : (
                                        <div>
                                            <Typography component={'span'}>{this.getHorizontalStepContent(activeModalStep)}</Typography>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div>
                            <Button disabled={activeModalStep === 0} onClick={this.handleModalBack} >Back </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                name={activeModalStep === modalsteps.length - 1 ? 'Finish' : 'Next'}
                                onClick={activeModalStep === modalsteps.length - 1 ? this.handleModalFinish : this.handleModalNext}
                                disabled={isdisabled}
                            >
                                {activeModalStep === modalsteps.length - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </div>
                    </Modal.Footer>
                </Modal>
                <NotificationContainer />
                {loader && <div className="loaderDiv"><div className="loader"><CircularProgress /></div></div>}
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
export default connect(mapStateToProps, mapDispatchToProps)(VerticalLinearStepper);

