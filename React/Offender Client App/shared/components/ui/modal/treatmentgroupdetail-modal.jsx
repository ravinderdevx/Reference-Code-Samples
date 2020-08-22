import React, { } from 'react';
import { Modal, Button } from 'react-bootstrap';
import FormatDateTime from '../../functional/DateTimeFormatter';
import { history } from '../../../../helpers/history';

const TreatmentDetailModal = ({ onClose, treatment, showModal, showNavigation }) => {

    return (
        <Modal show={showModal} onHide={onClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                    Group Details
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>{
                treatment &&
                <div className="popup-border modalDetails">
                    {treatment.Name &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">Name:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02">{treatment.Name}</div>
                            </div>
                        </div>
                    }
                    {treatment.Location &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">Location:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02">{treatment.Location}</div>
                            </div>
                        </div>
                    }
                    {treatment.StartTime &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">Start Time:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02"><FormatDateTime date={treatment.StartTime} format="MM/DD/YYYY h:mm A" /></div>
                            </div>
                        </div>
                    }
                    {treatment.EndDate &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">End Time:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02"><FormatDateTime date={treatment.EndDate} format="MM/DD/YYYY h:mm A" /></div>
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
export default TreatmentDetailModal;