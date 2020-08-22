import React, { } from 'react';
import { Modal, Button } from 'react-bootstrap';
import FormatDateTime from '../../functional/DateTimeFormatter';
import { history } from '../../../../helpers/history';

const MeetingModal = ({ onClose, meeting, showModal, showNavigation }) => {
    return (
        <Modal show={showModal} onHide={onClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                    Meeting Details
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>{
                meeting &&
                <div className="popup-border modalDetails">
                    {meeting.Title &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">Title:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02">{meeting.Title}</div>
                            </div>
                        </div>
                    }
                    {meeting.MeetingTypeDescription &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">Type:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02">{meeting.MeetingTypeDescription}</div>
                            </div>
                        </div>
                    }
                    {meeting.MeetingLocationDescription &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">Location:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02">{meeting.MeetingLocationDescription}</div>
                            </div>
                        </div>
                    }
                    {meeting.StartTime &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">Start Time:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02"><FormatDateTime date={meeting.StartTime} format="MM/DD/YYYY h:mm A" /></div>
                            </div>
                        </div>
                    }
                    {meeting.StartTime &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">End Time:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02"><FormatDateTime date={meeting.EndTime} format="MM/DD/YYYY h:mm A" /></div>
                            </div>
                        </div>
                    }
                </div>
            }
            </Modal.Body>
            <Modal.Footer>
                {showNavigation && <Button variant="primary" onClick={() => history.push('/Agenda')}>Go  <i className="fa fa-arrow-right"></i></Button>}
                <Button variant="secondary" onClick={onClose}> Close </Button>
            </Modal.Footer>
        </Modal >
    )
}
export default MeetingModal;