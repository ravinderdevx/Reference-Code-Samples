import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import FormatDateTime from '../../functional/DateTimeFormatter';
import { history } from '../../../../helpers/history';
import CurrencyFormatter from '../../functional/CurrencyFormatter';

const TransactionModal = ({ onClose, transaction, showModal, showNavigation }) => {
    return (
        <Modal show={showModal} onHide={onClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                    Transaction Details
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>{
                transaction &&
                <div className="popup-border modalDetails">
                    {transaction.TransactionType &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">Transaction Type:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02">{transaction.TransactionType}</div>
                            </div>
                        </div>
                    }
                    {transaction.TransactionDate &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">Transaction Date:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02"><FormatDateTime date={transaction.TransactionDate} format="MM/DD/YYYY" /></div>
                            </div>
                        </div>
                    }
                    {transaction.CheckDate &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">Check Date:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02"><FormatDateTime date={transaction.CheckDate} format="MM/DD/YYYY" /></div>
                            </div>
                        </div>
                    }
                    {transaction.TransactionAmount &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">Transaction Amount:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02">
                                    <CurrencyFormatter currency={transaction.TransactionAmount} />

                                </div>
                            </div>
                        </div>
                    }
                    {transaction.PayPeriodStartDate &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">Pay Period Start Date:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02"><FormatDateTime date={transaction.PayPeriodStartDate} format="MM/DD/YYYY" /></div>
                            </div>
                        </div>
                    }
                    {transaction.PayPeriodEndDate &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">Pay Period End Date:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02"><FormatDateTime date={transaction.PayPeriodEndDate} format="MM/DD/YYYY" /></div>
                            </div>
                        </div>
                    }
                    {transaction.GrossPay &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">Gross Pay:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02"><CurrencyFormatter currency={transaction.GrossPay} /></div>
                            </div>
                        </div>
                    }
                    {transaction.NetPay &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">Net Pay:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02"><CurrencyFormatter currency={transaction.NetPay} /></div>
                            </div>
                        </div>
                    }
                    {transaction.HoursWorked &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">Hours Worked:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02">{transaction.HoursWorked}</div>
                            </div>
                        </div>
                    }
                    {transaction.Tips &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">Tips:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02"><CurrencyFormatter currency={transaction.Tips} /></div>
                            </div>
                        </div>
                    }
                    {transaction.Payee &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">Payee:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02">transaction.Payee</div>
                            </div>
                        </div>
                    }
                    {transaction.AdditionalPayeeInfo &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">Additional Payee Info:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02">{transaction.AdditionalPayeeInfo}</div>
                            </div>
                        </div>
                    }
                    {transaction.Comments &&
                        <div className="col-xs-12 m-b-5">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 col-02">Comments:</div>
                                <div className="col-xs-6 hideIfEmpty col-md-6 col-02">{transaction.Comments}</div>
                            </div>
                        </div>
                    }
                </div>
            }
            </Modal.Body>
            <Modal.Footer>
                {showNavigation && <Button variant="primary" onClick={() => history.push('/Financial')}>Go <i className="fa fa-arrow-right"></i></Button>}
                <Button variant="secondary" onClick={onClose}> Close </Button>
            </Modal.Footer>
        </Modal >
    )
}
export default TransactionModal;