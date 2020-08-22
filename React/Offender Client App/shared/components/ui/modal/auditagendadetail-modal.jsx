import React, { Fragment } from 'react';
import MaterialTable, { MTableBody } from "material-table";
import { Modal, Button } from 'react-bootstrap';
import FormatDateTime from '../../functional/DateTimeFormatter';

const AuditAgendaDetailModal = ({ onClose, AuditClientLeave, showModalAudit }) => {
    const compareData = (columnName, previousRow, currentRow) => {
        if (previousRow) {
            return previousRow[columnName] !== currentRow[columnName];
        }
        return false;
    }
    return (
        <div className="card-body">
            <div className="table-responsive">
                <Modal show={showModalAudit} onHide={onClose}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">Agenda Detail History</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="leaveTypeDetails">
                        <div>
                            <MaterialTable

                                columns={[
                                    {
                                        title: "Leave Type",
                                        field: "LeaveType",
                                        render: rowData => {
                                            const isChanged = compareData("LeaveType", AuditClientLeave[rowData.tableData.id - 1], rowData);
                                            return (<Fragment>
                                                <div data-testid="td-before" className='tdBefore'>Leave Type</div>
                                                <div className={isChanged ? 'changed' : ''}>{rowData.LeaveType}</div>
                                            </Fragment>)
                                        }
                                    },
                                    {
                                        title: "Scheduled Departure",
                                        field: "ScheduledDeparture",
                                        render: rowData => {
                                            const isChanged = compareData("ScheduledDeparture", AuditClientLeave[rowData.tableData.id - 1], rowData);
                                            return (<Fragment>
                                                <div data-testid="td-before" className='tdBefore'>Scheduled Departure</div>
                                                <div className={isChanged ? 'changed' : ''}>
                                                    <FormatDateTime date={rowData.ScheduledDeparture} format="MM/DD/YYYY h:mm A" />
                                                </div>

                                            </Fragment>)
                                        }
                                    },
                                    {
                                        title: "Depart Trans Mode",
                                        field: "DepartTransMode",
                                        render: rowData => {
                                            const isChanged = compareData("DepartTransMode", AuditClientLeave[rowData.tableData.id - 1], rowData);
                                            return (<Fragment>
                                                <div data-testid="td-before" className='tdBefore'>Depart Trans Mode</div>
                                                <div className={isChanged ? 'changed' : ''}>{rowData.DepartTransMode}</div>
                                            </Fragment>)
                                        }
                                    },
                                    {
                                        title: "Depart Trans Details",
                                        field: "DepartTransDetails",
                                        render: rowData => {
                                            const isChanged = compareData("DepartTransDetails", AuditClientLeave[rowData.tableData.id - 1], rowData);
                                            return (<Fragment>
                                                <div data-testid="td-before" className='tdBefore'>Depart Trans Details</div>
                                                <div className={isChanged ? 'changed' : ''}>{rowData.DepartTransDetails}</div>

                                            </Fragment>)
                                        }
                                    },
                                    {
                                        title: "Depart Trans Driver",
                                        field: "DepartTransDriver",
                                        render: rowData => {
                                            const isChanged = compareData("DepartTransDriver", AuditClientLeave[rowData.tableData.id - 1], rowData);
                                            return (<Fragment>
                                                <div data-testid="td-before" className='tdBefore'>Depart Trans Driver</div>
                                                <div className={isChanged ? 'changed' : ''}>{rowData.DepartTransDriver}</div>

                                            </Fragment>)
                                        }
                                    },
                                    {
                                        title: "Depart Trans Vehicle",
                                        field: "DepartTransVehicle",
                                        render: rowData => {
                                            const isChanged = compareData("DepartTransVehicle", AuditClientLeave[rowData.tableData.id - 1], rowData);
                                            return (<Fragment>
                                                <div data-testid="td-before" className='tdBefore'>Depart Trans Vehicle</div>
                                                <div className={isChanged ? 'changed' : ''}>{rowData.DepartTransVehicle}</div>

                                            </Fragment>)
                                        }
                                    },
                                    {
                                        title: "Depart Travel Time",
                                        field: "DepartTravelTime",
                                        render: rowData => {
                                            const isChanged = compareData("DepartTravelTime", AuditClientLeave[rowData.tableData.id - 1], rowData);
                                            return (<Fragment>
                                                <div data-testid="td-before" className='tdBefore'>Depart Travel Time</div>
                                                <div className={isChanged ? 'changed' : ''}>{rowData.DepartTravelTime}</div>

                                            </Fragment>)
                                        }
                                    },
                                    {
                                        title: "Return Trans Details",
                                        field: "ReturnTransDetails",

                                        render: rowData => {
                                            const isChanged = compareData("ReturnTransDetails", AuditClientLeave[rowData.tableData.id - 1], rowData);
                                            return (<Fragment>
                                                <div data-testid="td-before" className='tdBefore'>Return Trans Details</div>
                                                <div className={isChanged ? 'changed' : ''}>{rowData.ReturnTransDetails}</div>
                                            </Fragment>)
                                        }
                                    },
                                    {
                                        title: "Return Trans Driver",
                                        field: "ReturnTransDriver",

                                        render: rowData => {
                                            const isChanged = compareData("ReturnTransDriver", AuditClientLeave[rowData.tableData.id - 1], rowData);
                                            return (<Fragment>
                                                <div data-testid="td-before" className='tdBefore'>Return Trans Driver</div>
                                                <div className={isChanged ? 'changed' : ''}>{rowData.ReturnTransDriver}</div>
                                            </Fragment>)
                                        }
                                    },
                                    {
                                        title: "Return Trans Vehicle",
                                        field: "ReturnTransVehicle",
                                        render: rowData => {
                                            const isChanged = compareData("ReturnTransVehicle", AuditClientLeave[rowData.tableData.id - 1], rowData);
                                            return (<Fragment>
                                                <div data-testid="td-before" className='tdBefore'>Return Trans Vehicle</div>
                                                <div className={isChanged ? 'changed' : ''}>{rowData.ReturnTransVehicle}</div>

                                            </Fragment>)
                                        }
                                    },
                                    {
                                        title: "Return Travel Time",
                                        field: "ReturnTravelTime",
                                        render: rowData => {
                                            const isChanged = compareData("ReturnTravelTime", AuditClientLeave[rowData.tableData.id - 1], rowData);
                                            return (<Fragment>
                                                <div data-testid="td-before" className='tdBefore'>Return Travel Time</div>
                                                <div className={isChanged ? 'changed' : ''}>{rowData.ReturnTravelTime}</div>

                                            </Fragment>)
                                        }
                                    }
                                    , {
                                        title: "Scheduled Return",
                                        field: "ScheduledReturn",
                                        render: rowData => {
                                            const isChanged = compareData("ScheduledReturn", AuditClientLeave[rowData.tableData.id - 1], rowData);
                                            return (<Fragment>
                                                <div data-testid="td-before" className='tdBefore'>Scheduled Return</div>
                                                <div className={isChanged ? 'changed' : ''}>
                                                    <FormatDateTime date={rowData.ScheduledReturn} format="MM/DD/YYYY h:mm A" />
                                                </div>

                                            </Fragment>)
                                        }
                                    },
                                    {
                                        title: "Return Trans Mode",
                                        field: "ReturnTransMode",
                                        render: rowData => {
                                            const isChanged = compareData("ReturnTransMode", AuditClientLeave[rowData.tableData.id - 1], rowData);
                                            return (<Fragment>
                                                <div data-testid="td-before" className='tdBefore'>Return Trans Mode</div>
                                                <div className={isChanged ? 'changed' : ''}>
                                                    {rowData.ReturnTransMode}
                                                </div>
                                            </Fragment>)
                                        }
                                    },
                                    {
                                        title: "Request Status",
                                        field: "RequestStatus",
                                        render: rowData => {
                                            const isChanged = compareData("RequestStatus", AuditClientLeave[rowData.tableData.id - 1], rowData);
                                            return (<Fragment>
                                                <div data-testid="td-before" className='tdBefore'>Request Status</div>
                                                <div className={isChanged ? 'changed' : ''}>{rowData.RequestStatus}</div>
                                            </Fragment>)
                                        }
                                    },
                                    {
                                        title: "Denial Reason",
                                        field: "DenialReason",
                                        render: rowData => {
                                            const isChanged = compareData("DenialReason", AuditClientLeave[rowData.tableData.id - 1], rowData);
                                            return (<Fragment>
                                                <div data-testid="td-before" className='tdBefore'>Denial Reason</div>
                                                <div className={isChanged ? 'changed' : ''}>{rowData.DenialReason}</div>
                                            </Fragment>)
                                        }

                                    },
                                    {
                                        title: "Comments",
                                        field: "Comments",
                                        render: rowData => {
                                            const isChanged = compareData("Comments", AuditClientLeave[rowData.tableData.id - 1], rowData);
                                            return (<Fragment>
                                                <div data-testid="td-before" className='tdBefore'>Comments</div>
                                                <div className={isChanged ? 'changed' : ''}>{rowData.Comments}</div>
                                            </Fragment>)
                                        }

                                    },
                                    {
                                        title: "Change Date",
                                        field: "LogDate",
                                        render: rowData => {
                                            const isChanged = compareData("LogDate", AuditClientLeave[rowData.tableData.id - 1], rowData);
                                            return (<Fragment>
                                                <div data-testid="td-before" className='tdBefore'>Change Date</div>
                                                <div className={isChanged ? 'changed' : ''}>
                                                    <FormatDateTime date={rowData.LogDate} format="MM/DD/YYYY h:mm A" /></div>

                                            </Fragment>)
                                        }

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
                                    minBodyHeight: "200px",
                                    draggable: false
                                }}
                                data={AuditClientLeave}
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
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={onClose}> Close </Button>
                    </Modal.Footer>
                </Modal >
            </div>
        </div>
    )
}
export default AuditAgendaDetailModal;