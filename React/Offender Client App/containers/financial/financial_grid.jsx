import React, { Fragment } from "react";
import MaterialTable, { MTableBody } from "material-table";
import CurrencyFormatter from '../../shared/components/functional/CurrencyFormatter'
const FinancialGrid = ({ DetailsFinancialAccounts, isLoading, oncheckboxchange }) => {

    return (
        <Fragment>
            <MaterialTable
                columns={[
                    {
                        title: "Select",
                        field: "AccountDescription",
                        sorting: false,
                        render: rowData =>
                            <Fragment>
                                <div data-testid="td-before" className="tdBefore">Select</div>
                                <i className="fa fa-circle-o" aria-hidden="true" onClick={(e) => { oncheckboxchange(e, rowData) }}></i>
                            </Fragment>

                    },
                    {
                        title: "Account Type",
                        field: "AccountDescription",
                        sorting: false,
                        render: rowData =>
                            <Fragment>
                                <div data-testid="td-before" className="tdBefore"> Account Type</div>
                                {rowData.AccountDescription}
                            </Fragment>

                    },
                    {
                        title: "Current Balance",
                        field: "CurrentBalance",
                        render: rowData => (
                            <Fragment>
                                <div data-testid="td-before" className="tdBefore">Current Balance</div>
                                <CurrencyFormatter currency={rowData.CurrentBalance} />
                            </Fragment>
                        )
                    },
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
                data={DetailsFinancialAccounts}
                localization={{
                    pagination: {
                        labelRowsSelect: "rows per page"
                    }
                }}
                title="Accounts "
                components={{
                    Body: props =>
                        <Fragment> {
                            props.renderData &&
                                props.renderData.length === 0 ?
                                <div className="alignCenterExt">No account to display</div>
                                : <MTableBody  {...props} />

                        }
                        </Fragment>

                }}
            />
        </Fragment>
    );
}


export default FinancialGrid;
