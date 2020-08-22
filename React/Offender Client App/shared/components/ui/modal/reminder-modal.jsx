import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import FormatDateTime from '../../functional/DateTimeFormatter';
import { history } from '../../../../helpers/history';

const ReminderModal = ({ onClose, reminder, showModal }) => {

    return (
        <Modal show={showModal} onHide={onClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                    Reminder Details
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>{
                reminder &&
                <div className="popup-border modalDetails">
                    <div className="col-xs-12 m-b-5">
                        <div className="row">
                            <div className="col-xs-6 col-md-6 col-02">Reminder Type:</div>
                            <div className="col-xs-6 hideIfEmpty col-md-6 col-02">{reminder.TaskDescription}</div>
                        </div>
                    </div>
                    <div className="col-xs-12 m-b-5">
                        <div className="row">
                            <div className="col-xs-6 col-md-6 col-02">Due Date:</div>
                            <div className="col-xs-6 hideIfEmpty col-md-6 col-02"><FormatDateTime date={reminder.DueDate} format="MM/DD/YYYY" /></div>
                        </div>
                    </div>
                    <div className="col-xs-12 m-b-5">
                        <div className="row">
                            <div className="col-xs-6 col-md-6 col-02">Created By:</div>
                            <div className="col-xs-6 hideIfEmpty col-md-6 col-02">{reminder.CreatedBy}</div>
                        </div>
                    </div>
                    <div className="col-xs-12 m-b-5">
                        <div className="row">
                            <div className="col-xs-6 col-md-6 col-02">Completed:</div>
                            <div className="col-xs-6 hideIfEmpty col-md-6 col-02">{reminder.Completed === "Y" ? 'Yes' : 'No'}</div>
                        </div>
                    </div>
                    <div className="col-xs-12 m-b-5">
                        <div className="row">
                            <div className="col-xs-6 col-md-6 col-02">Comments:</div>
                            <div className="col-xs-6 hideIfEmpty col-md-6 col-02">{reminder.Comments}</div>
                        </div>
                    </div>
                </div>
            }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => history.push('/Reminder')} >Go <i className="fa fa-arrow-right"></i></Button>
                <Button variant="secondary" onClick={onClose}> Close </Button>
            </Modal.Footer>
        </Modal >
    )
}
export default ReminderModal;