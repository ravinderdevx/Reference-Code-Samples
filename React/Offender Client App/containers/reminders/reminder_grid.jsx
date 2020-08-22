import React, { Fragment } from "react";
import MaterialTable, { MTableBody } from "material-table";
import FormatDateTime from "../../shared/components/functional/DateTimeFormatter";
const RemindersGrid = ({ remindersclienttasks, isLoading, oncheckboxchange }) => {
    return (
        <Fragment>
            <MaterialTable
                columns={[
                    {
                        title: "Actions",
                        field: "Completed",
                        sorting: false,
                        render: rowData =>
                            <Fragment>
                                <div data-testid="td-before" className="tdBefore"> Actions</div>
                                {rowData.Completed === "Y" ?
                                    <i className="fa fa-check-square-o" aria-hidden="true" onClick={(e) => { oncheckboxchange(e, rowData) }}></i>
                                    :
                                    <i className="fa fa-square-o" aria-hidden="true" onClick={(e) => { oncheckboxchange(e, rowData) }}></i>
                                }
                            </Fragment>

                    },
                    {
                        title: "Description",
                        field: "TaskDescription",
                        render: rowData => (
                            <Fragment>
                                <div data-testid="td-before" className="tdBefore">Description</div>
                                {rowData.TaskDescription}
                            </Fragment>
                        )

                    },
                    {
                        title: "Comments",
                        field: "Comments",
                        render: rowData => (
                            <Fragment>
                                <div data-testid="td-before" className="tdBefore">Comments</div>
                                {rowData.Comments}
                            </Fragment>
                        )
                    },
                    {
                        title: "Due Date",
                        field: "DueDate",
                        render: rowData => (
                            <Fragment>
                                <div data-testid="td-before" className="tdBefore">Due Date</div>
                                <FormatDateTime date={rowData.DueDate} format="MM/DD/YYYY" />
                            </Fragment>

                        )
                    },
                    {
                        title: "Created By",
                        field: "CreatedBy",
                        render: rowData => (
                            <Fragment>
                                <div data-testid="td-before" className="tdBefore">Created By</div>
                                {rowData.CreatedBy}
                            </Fragment>
                        )
                    }
                ]}
                options={{
                    pageSize: 25,
                    pageSizeOptions: [5, 10, 25, 50, 100],
                    toolbar: true,
                    paging: true,
                    paginationType: "normal",
                    view: true,
                    headerStyle: {
                        backgroundColor: "#4f656c",
                        color: "#FFF"
                    },
                    actionsColumnIndex: -1,
                    minBodyHeight: "300px",
                    draggable: false
                }}
                isLoading={isLoading}
                data={remindersclienttasks}
                localization={{
                    pagination: {
                        labelRowsSelect: "rows per page"
                    }
                }}
                title="Reminders"
                    components={{
                        Body: props =>
                            <Fragment> {
                               props.renderData &&
                               props.renderData.length===0 ?
                               <div className="alignCenterExt">No reminders to display</div>
                               :  <MTableBody  {...props} /> 
                                   
                            }
                            </Fragment>
    
                    }}

            />
        </Fragment>
    );
}


export default RemindersGrid;
