import React, { Fragment } from 'react';
import { Modal, Button } from 'react-bootstrap';
import FormatDateTime from '../../functional/DateTimeFormatter';
import { history } from '../../../../helpers/history';

const AgendaDetailModal = ({ onClose, Agenda, showModal, showNavigation }) => {

    return (
        <Modal show={showModal} onHide={onClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                    Agenda Details
     </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    Agenda && Agenda.clientLeave &&
                    <div>
                        <div id="details" className="Agenda clientLeavesDetails">
                            <div className="row">
                                <div className="col-xs-12">
                                    <b>{Agenda.clientLeave.LeaveTypeDescription}</b>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12 col-md-6">
                                    <div className="col-xs-12 m-b-5">
                                        <div className="row">
                                            <div className="col-xs-6 col-md-6 col-02">Scheduled Departure:</div>
                                            <div className="col-xs-6 col-md-6 col-02"><FormatDateTime date={Agenda.clientLeave.ScheduledDeparture} format="MM/DD/YYYY h:mm A" /></div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 m-b-5">
                                        <div className="row">
                                            <div className="col-xs-6 col-md-6 col-02">Transportation:</div>
                                            <div className="col-xs-6 col-md-6 col-02">{Agenda.clientLeave.DepartTransModeDetailsDescription}</div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 m-b-5">
                                        <div className="row">
                                            <div className="col-xs-6 col-md-6 col-02">Details:</div>
                                            <div className="col-xs-6 col-md-6 col-02">{Agenda.clientLeave.DepartTransDetails}</div>
                                        </div>
                                    </div>

                                    {Agenda.clientLeave.DepartTransModeDetailsDescription === "Car" &&
                                        <Fragment>
                                            < div className="col-xs-12 m-b-5">
                                                <div className="row">
                                                    <div className="col-xs-6 col-md-6 col-02">Driver:</div>
                                                    <div className="col-xs-6 col-md-6 col-02">
                                                        {Agenda.clientLeave.DepartTransDriverName !== null ? Agenda.clientLeave.DepartTransDriverName : ""}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xs-12 m-b-5">
                                                <div className="row">
                                                    <div className="col-xs-6 col-md-6 col-02">Vehicle:</div>
                                                    <div className="col-xs-6 col-md-6 col-02">
                                                        {Agenda.clientLeave.DepartTransportVehicleDescription}
                                                    </div>
                                                </div>
                                            </div>
                                        </Fragment>
                                    }
                                    <div className="col-xs-12 m-b-5">
                                        <div className="row">
                                            <div className="col-xs-6 col-md-6 col-02">Travel Time:</div>
                                            <div className="col-xs-6 col-md-6 col-02">{Agenda.clientLeave.DepartTravelTime}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-md-6">
                                    <div className="col-xs-12 m-b-5">
                                        <div className="row">
                                            <div className="col-xs-6 col-md-6 col-02">Scheduled Return:</div>
                                            <div className="col-xs-6 col-md-6 col-02"><FormatDateTime date={Agenda.clientLeave.ScheduledReturn} format="MM/DD/YYYY h:mm A" /></div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 m-b-5">
                                        <div className="row">
                                            <div className="col-xs-6 col-md-6 col-02">Transportation:</div>
                                            <div className="col-xs-6 col-md-6 col-02">{Agenda.clientLeave.ReturnTransModeDetailsDescription}</div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 m-b-5">
                                        <div className="row">
                                            <div className="col-xs-6 col-md-6 col-02">Details:</div>
                                            <div className="col-xs-6 col-md-6 col-02">{Agenda.clientLeave.ReturnTransDetails}</div>
                                        </div>
                                    </div>
                                    {Agenda.clientLeave.ReturnTransModeDetailsDescription === "Car" &&
                                        <Fragment>
                                            < div className="col-xs-12 m-b-5">
                                                <div className="row">
                                                    <div className="col-xs-6 col-md-6 col-02">Driver:</div>
                                                    <div className="col-xs-6 col-md-6 col-02">
                                                        {Agenda.clientLeave.ReturnTransDriverName !== null ? Agenda.clientLeave.ReturnTransDriverName : ""}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xs-12 m-b-5">
                                                <div className="row">
                                                    <div className="col-xs-6 col-md-6 col-02">Vehicle:</div>
                                                    <div className="col-xs-6 col-md-6 col-02">
                                                        {Agenda.clientLeave.ReturnTransportVehicleDescription}
                                                    </div>
                                                </div>
                                            </div>
                                        </Fragment>
                                    }
                                    <div className="col-xs-12 m-b-5">
                                        <div className="row">
                                            <div className="col-xs-6 col-md-6 col-02">Travel Time:</div>
                                            <div className="col-xs-6 col-md-6 col-02">{Agenda.clientLeave.ReturnTravelTime}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=" Agenda clientLeavesDetails borderBottom">
                            <div className="row">
                                <div className="col-xs-12">
                                    <b>Destination(s){Agenda.clientLeaveSchedules && Agenda.clientLeaveSchedules.length > 0 ? "" : " : None"}</b>
                                </div>
                            </div>
                            {
                                Agenda.clientLeaveSchedules &&
                                Agenda.clientLeaveSchedules.map((schedule, index) => {
                                    return <div className="destinationRow">
                                        <div className="row" >
                                            <div className="col-xs-12 col-md-6">
                                                {/*<div className="col-xs-12 m-b-5 hidden">
                                                <div className="col-xs-6">Schedule ID:</div>
                                                <div className="col-xs-6">{schedule.Id}</div>
                                            </div>
                                            */}
                                                <div className="col-xs-12 m-b-5">
                                                    <div className="row">
                                                        <div className="col-xs-6 col-md-6 col-02">Destination:</div>
                                                        <div className="col-xs-6 col-md-6 col-02">{schedule.Destination}</div>
                                                    </div>
                                                </div>
                                                <div className="col-xs-12 m-b-5">
                                                    <div className="row">
                                                        <div className="col-xs-6 col-md-6 col-02">Start Date:</div>
                                                        <div className="col-xs-6 col-md-6 col-02"><FormatDateTime date={schedule.StartDate} format="MM/DD/YYYY h:mm A" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xs-12 col-md-6">
                                                {/* <div className="col-xs-12 m-b-5 hidden">
                                                <div className="col-xs-6">Schedule Type:</div>
                                                <div className="col-xs-6">{schedule.ScheduleType}</div>
                                            </div> 
                                            <div className="hidden-xs hidden-sm col-xs-12 m-b-5">
                                                <div className="col-xs-6">&nbsp;</div>
                                                <div className="col-xs-6">&nbsp;</div>
                                            </div>
                                            */}
                                                <div className="col-xs-12 m-b-5">
                                                    <div className="row">
                                                        <div className="col-xs-6 col-md-6 col-02">End Date:</div>
                                                        <div className="col-xs-6 col-md-6 col-02"><FormatDateTime date={schedule.EndDate} format="MM/DD/YYYY h:mm A" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {schedule.ReturnsToCenter === "N" && <div className="row">
                                            <div className="col-xs-12 col-md-6">
                                                <div className="col-xs-12 m-b-5">
                                                    <div className="row">
                                                        <div className="col-xs-6 col-md-6 col-02">Transportation:</div>
                                                        <div className="col-xs-6 col-md-6 col-02">{schedule.TransMode}</div>
                                                    </div>
                                                </div>
                                                {
                                                    schedule.TransMode === "Car" &&
                                                    <div className="col-xs-12 m-b-5">
                                                        <div className="row">
                                                            <div className="col-xs-6 col-md-6 col-02">Driver:</div>
                                                            <div className="col-xs-6 col-md-6 col-02"> {schedule.TransDriver}</div>
                                                        </div>
                                                    </div>
                                                }
                                                {/* <div className="col-xs-12 m-b-5 hidden">
                                                <div className="col-xs-6">Trans Details:</div>
                                                <div className="col-xs-6">{schedule.TransDetails}</div>
                                            </div> */}
                                            </div>
                                            <div className="col-xs-12 col-md-6">
                                                <div className="col-xs-12 m-b-5">
                                                    <div className="row">
                                                        <div className="col-xs-6 col-md-6 col-02">Travel Time:</div>
                                                        <div className="col-xs-6 col-md-6 col-02">{schedule.TravelTime}</div>
                                                    </div>
                                                </div>
                                                {
                                                    schedule.TransMode === "Car" &&
                                                    <div className="col-xs-12 m-b-5">
                                                        <div className="row">
                                                            <div className="col-xs-6 col-md-6 col-02">Vehicle:</div>
                                                            <div className="col-xs-6 col-md-6 col-02">{schedule.Vehicle}</div>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        }
                                        <div className="row" >
                                            <div className="col-xs-12 col-md-6">
                                                <div className="col-xs-12 m-b-5">
                                                    <div className="row">
                                                        <div className="col-xs-12 col-md-6 col-02">Comments:</div>
                                                        <div className="col-xs-12 col-md-6 col-02">{schedule.Comments ? schedule.Comments : "N/A"}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                        <div className="row Agenda clientLeavesDetails borderBottom">
                            <div className="col-xs-12"><b>Request Status</b></div>
                            <div className="col-xs-12 col-md-12 m-b-5 p-0"><div className="col-xs-6">{Agenda.clientLeave.RequestStatusDescription} {Agenda.clientLeave.RequestStatusDescription === "Deny" && Agenda.clientLeave.DenialReason ? " (" + Agenda.clientLeave.DenialReason + ")" : ""}</div></div>
                        </div>

                        <div className="row Agenda clientLeavesDetails ">
                            <div className="col-xs-12"><b>Comments</b></div>
                            <div className="col-xs-12 col-md-12 m-b-5 p-0"><div className="col-xs-12">{Agenda.clientLeave.Comments ? Agenda.clientLeave.Comments : "N/A"}</div></div>
                        </div>

                    </div>
                }
            </Modal.Body>
            <Modal.Footer className="Agenda.clientLeavesBtn">
                {showNavigation && <Button variant="primary" onClick={() => history.push('/Agenda')}>Go  <i className="fa fa-arrow-right"></i></Button>}
                <Button variant="secondary" onClick={onClose}> Close </Button>
            </Modal.Footer>
        </Modal >
    )
}


export default AgendaDetailModal;