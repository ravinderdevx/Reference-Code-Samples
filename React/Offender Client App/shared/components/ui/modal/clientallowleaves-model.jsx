import React, { Fragment, useState, useEffect } from 'react';
import { connect } from "react-redux";
import MaterialTable, { MTableBody } from "material-table";
import { Modal, Button } from 'react-bootstrap';
import { apiService } from '../../../../services/api.service';
import * as actions from '../../../../store/actions';
import { bindActionCreators } from "redux";
import Radio from '@material-ui/core/Radio';

const ClientAllowLeavesModal = ({ onClose, showModalAudit, auth }) => {
    const [count, setCount] = useState(0);

    const [ScheduleTypes, setScheduleTypes] = useState(false);

    const [type, setType] = React.useState('W');

    const [data] = useState({ ProgramPhaseId: auth.user.PhaseId, ClientId: auth.user.ClientId, ScheduledDate: new Date(), Type: type });
    useEffect(() => {
        function fetchdata() {
            apiService.post('GETALLOWABLELEAVES', data).then(response => {
                if (response.Success) {
                    setCount(response)
                }
                else {
                    setCount([])
                }
            }, error => {
                this.props.actions.showAlert({ message: error, variant: 'error' });
            });
        }
        fetchdata();
    }, [data]);

    const handleChange = (e) => {
        setType(e.target.value)
        let dataWeek = {
            ProgramPhaseId: auth.user.PhaseId, ClientId: auth.user.ClientId, ScheduledDate: new Date(), Type: e.target.value
        }
        apiService.post('GETALLOWABLELEAVES', dataWeek).then(response => {
            if (response.Success) {
                setCount(response)
            }
            else {
                setCount([])
            }
        }, error => {
            this.props.actions.showAlert({ message: error, variant: 'error' });
        });

    }

    return (
        <div className="card-body">
            <div className="table-responsive">
                <Modal show={showModalAudit} onHide={onClose}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header className="modalStrickHeader" closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">Current Leave/Destination Counts of
                         ({count &&
                                count.LeaveWeekRange.DateRange
                            })

                        </Modal.Title>
                        <div className="clientLeavesBtn">
                            <div className="leaveTypeBtn">
                                <button className={`btn btn-outline-primary ${ScheduleTypes ? '' : 'active'}`} onClick={() => { setScheduleTypes(false) }}>Leave Types</button>
                                <button className={`btn btn-outline-primary ${ScheduleTypes ? 'active' : ''}`} onClick={() => { setScheduleTypes(true) }}>Destination Types</button>
                            </div>
                            <div className="allowAbleLeaveRadioBtn">
                                <Radio checked={type === 'W'} color="primary" value="W" name="weekCount" onChange={handleChange} /> Week
                            <Radio checked={type === 'M'} color="primary" value="M" name="weekCount" onChange={handleChange} /> Month
                            </div>
                        </div>
                    </Modal.Header>
                    <Modal.Body className="leaveTypeDetails">

                        <MaterialTable
                            columns={[
                                {
                                    title: ScheduleTypes ? "Schedule Type" : "Leave Type",
                                    field: "LeaveType",
                                    sorting: false,
                                    render: rowData =>
                                        (<Fragment>
                                            <div data-testid="td-before" className="tdBefore"> {ScheduleTypes ? "Schedule Type" : "Leave Type"}</div>
                                            {ScheduleTypes ? rowData.ScheduleType : rowData.LeaveType}
                                        </Fragment>),


                                },
                                {
                                    title: "Allowed", // "Per Week"
                                    field: "Allowed ",
                                    render: rowData => (
                                        <Fragment>
                                            <div data-testid="td-before" className="tdBefore">Allowed</div>
                                            {rowData.Allowed}
                                        </Fragment>
                                    )

                                },

                                {
                                    title: "Actual Used",
                                    field: "ActualUsed",
                                    render: rowData => (
                                        <Fragment>
                                            <div data-testid="td-before" className="tdBefore">Actual Used</div>
                                            {rowData.ActualUsed}
                                        </Fragment>

                                    ),

                                },
                                {
                                    title: "Future Scheduled",
                                    field: "FutureScheduled",
                                    render: rowData => (
                                        <Fragment>
                                            <div data-testid="td-before" className="tdBefore">Future Scheduled</div>
                                            {rowData.FutureScheduled}
                                        </Fragment>
                                    )

                                },
                                {
                                    title: "Available",
                                    field: "Available",
                                    render: rowData => (
                                        <Fragment>
                                            <div data-testid="td-before" className="tdBefore">Available</div>
                                            {rowData.Available}
                                        </Fragment>
                                    )
                                }

                            ]}
                            options={{
                                pageSize: 25,
                                pageSizeOptions: [5, 10, 25, 50, 100],
                                toolbar: false,
                                paging: true,
                                paginationType: "normal",
                                view: true,
                                headerStyle: {
                                    backgroundColor: "#4f656c",
                                    color: "#FFF"
                                },
                                actionsColumnIndex: -1,
                                // minBodyHeight: "300px",
                                maxBodyHeight: '100px',
                                draggable: false

                            }}
                            data={ScheduleTypes ? count.AllowedScheduleTypes : count.AllowedLeaveTypes}
                            localization={{
                                pagination: {
                                    labelRowsSelect: "rows per page"
                                }
                            }}
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
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={onClose}> Close </Button>
                    </Modal.Footer>
                </Modal >
            </div>
        </div >
    )
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
export default connect(mapStateToProps, mapDispatchToProps)(ClientAllowLeavesModal);