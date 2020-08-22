import React, { Fragment } from 'react';
import MaterialTable, { MTableBody } from 'material-table';
import FormatDateTime from "../../shared/components/functional/DateTimeFormatter";
import CurrencyFormatter from '../../shared/components/functional/CurrencyFormatter';

const TransactionDetail = ({ transactionDetail, isLoading, closedTransactionDetail, openTransactionModal }) => {

    return (

        <Fragment>
            <div className="backToAccount">
                <p><b>Account : </b>{transactionDetail.AccountDescription}  <b>Current Balance : </b><CurrencyFormatter currency={transactionDetail.CurrentBalance} /></p>
                <button type="button" className="btn btn-link" onClick={closedTransactionDetail}><i className="fa fa-arrow-left"></i> Back to Account</button>
            </div>



            <MaterialTable

                columns={[
                    {
                        title: "Transaction Date",
                        field: "TransactionDate",
                        render: rowData => <Fragment>
                            <div data-testid="td-before" className="tdBefore">Transaction Date</div>
                            <FormatDateTime date={rowData.TransactionDate} format="MM/DD/YYYY" />
                        </Fragment>
                    },
                    {
                        title: "Transaction Amount",
                        field: "TransactionAmount",
                        render: rowData => <Fragment>
                            <div data-testid="td-before" className="tdBefore">Transaction Amount</div>
                            <CurrencyFormatter currency={rowData.TransactionAmount} />
                        </Fragment>
                    },
                    {
                        title: "Transaction Type",
                        field: "TransactionType",
                        render: rowData => <Fragment><div data-testid="td-before" className="tdBefore">Transaction Type</div>{rowData.TransactionType}</Fragment>
                    },
                    {
                        title: "Comments",
                        field: "Description",
                        render: rowData => <Fragment><div data-testid="td-before" className="tdBefore">Comments</div>{rowData.Comments}</Fragment>
                    },
                    {
                        title: "Details",
                        field: "Details",
                        sorting: false,
                        render: rowData => <Fragment><div data-testid="td-before" className="tdBefore">Details</div>
                            <button type="button" className="btn btn-link" onClick={(e) => openTransactionModal(e, rowData)}>
                                <i className="fa fa-info" aria-hidden="true" />
                            </button>
                        </Fragment>
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
                        backgroundColor: '#4f656c',
                        color: '#FFF'
                    },
                    actionsColumnIndex: -1,
                    minBodyHeight: "300px",
                    draggable: false
                }}
                isLoading={isLoading}
                data={transactionDetail.transactionDetail}

                localization={{
                    pagination: {
                        labelRowsSelect: "rows per page"
                    }
                }}
                title="Transaction Detail"
                components={{
                    Body: props =>
                        <Fragment> {
                            props.renderData &&
                                props.renderData.length === 0 ?
                                <div className="alignCenterExt">No transactions for this account</div>
                                : <MTableBody  {...props} />

                        }
                        </Fragment>

                }}
            />

        </Fragment>
    );
}
export default TransactionDetail;