import React, { Fragment } from 'react';
import { Modal, Button } from 'react-bootstrap';
import FormatDateTime from '../../functional/DateTimeFormatter';

const MettingModal = ({ onClose, metting, showModal }) => {

    return (
        <Modal show={showModal} onHide={onClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                    Metting Details
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>{
                metting &&
                <div className="popup-border modalDetails">
                    {metting.Title &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">Title:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02">{metting.Title}</div>
                            </div>
                        </div>
                    }
                    {metting.MeetingTypeDescription &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">Type:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02">{metting.MeetingTypeDescription}</div>
                            </div>
                        </div>
                    }
                    {metting.MeetingLocationDescription &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">Location:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02">{metting.MeetingLocationDescription}</div>
                            </div>
                        </div>
                    }
                    {metting.StartTime &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">Start Time:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02"><FormatDateTime date={metting.StartTime} format="MM/DD/YYYY" /></div>
                            </div>
                        </div>
                    }
                    {metting.StartTime &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">End Time:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02"><FormatDateTime date={metting.EndTime} format="MM/DD/YYYY" /></div>
                            </div>
                        </div>
                    }
                </div>
            }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}> Close </Button>
            </Modal.Footer>
        </Modal >
    )
}
export default MettingModal;