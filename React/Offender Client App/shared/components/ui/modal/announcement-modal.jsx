import React, { Fragment } from "react";
import { Modal, Button } from "react-bootstrap";
import FormatDateTime from "../../functional/DateTimeFormatter";
import { history } from "../../../../helpers/history";

const AnnouncementModal = ({ onClose, announcement, showModal }) => {
  debugger;
  const createMarkup = (htmlString) => ({ __html: htmlString });
  return (
    <Modal
      show={showModal}
      onHide={onClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-custom-modal-styling-title">
          Announcement Detail
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {announcement && (
          <div className="popup-border modalDetails">
            <div className="col-xs-12 m-b-5">
              <div className="row">
                <div className="col-xs-5 col-md-5 col-02">Announcement:</div>
                <div
                  className="col-xs-7 hideIfEmpty col-md-7 col-02"
                  dangerouslySetInnerHTML={createMarkup(
                    announcement.Announcement
                  )}
                ></div>
              </div>
            </div>
            <div className="col-xs-12 m-b-5">
              <div className="row">
                <div className="col-xs-5 col-md-5 col-02">Expiration Date:</div>
                <div className="col-xs-7 hideIfEmpty col-md-7 col-02">
                  <FormatDateTime
                    date={announcement.ExpirationDate}
                    format="MM/DD/YYYY"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => history.push("/Announcement")}>
          Go <i className="fa fa-arrow-right"></i>
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {" "}
          Close{" "}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default AnnouncementModal;
