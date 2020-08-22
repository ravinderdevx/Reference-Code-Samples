import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import FormatDateTime from '../../shared/components/functional/DateTimeFormatter';
import MaterialTable, { MTableBody } from "material-table";
import { apiService } from '../../services/api.service';
import CircularProgress from '@material-ui/core/CircularProgress';

class CheckIn_History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clientlocationdetails: [],
            isLoading: false

        };
    }
    componentDidMount() {
        this.GetclientLocationDetails();
    }
    GetclientLocationDetails = () => {
        const { auth } = this.props;
        this.setState({ isLoading: true });
        let requestdata = { ClientId: auth.user.ClientId };
        apiService.post("GETCLIENTLOCATIONDETAILS", requestdata).then(
            response => {
                if (response.Success && response.LocationDetails) {
                    let locationdetails = response.LocationDetails;
                    this.setState({ clientlocationdetails: locationdetails });
                }
                this.setState({ isLoading: false });
            },
            error => {
                this.setState({ isLoading: false });
                this.props.actions.showAlert({ message: error, variant: "error" });
            }
        );
    };
    render() {
        const { clientlocationdetails, isLoading } = this.state;
        return (
            <Fragment>
                <MaterialTable
                    columns={[
                        {
                            title: "Visited on",
                            field: "CreatedDate",
                            render: rowData => <Fragment>
                                <div data-testid="td-before" className="tdBefore">Visited on</div>
                                {/* <FormatDateTime date={rowData.CreatedDate} format="MM/DD/YYYY  hh:mm A" /> */}
                                {/* {moment.utc(rowData.CreatedDate).format("MM/DD/YYYY hh:mm A")} */}
                                {rowData.CreatedDate}
                            </Fragment>

                        },
                        {
                            title: "Actions",
                            sorting: false,
                            render: rowData => <Fragment>
                                <div data-testid="td-before" className="tdBefore">Actions</div>
                                <a href={`http://www.google.com/maps/place/${rowData.Latitude},${rowData.Longitude}`} target="_blank"> Go to map</a>
                            </Fragment>
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
                            backgroundColor: '#4f656c',
                            color: '#FFF'
                        },
                        actionsColumnIndex: -1,
                        minBodyHeight: "300px",
                        draggable: false
                    }}
                    isLoading={isLoading}
                    data={clientlocationdetails}
                    localization={{
                        pagination: {
                            labelRowsSelect: "rows per page"
                        }
                    }}
                    title="Visited Location Details"

                />
                {isLoading && <div className="loaderDiv"><div className="loader"><CircularProgress /></div></div>}
            </Fragment>
        );
    }
}
const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}
const mapDispatchToProps = dispatch => {
    return {
        actions: {
            showAlert: bindActionCreators(
                actions.showAlert,
                dispatch
            )
        }
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(CheckIn_History)