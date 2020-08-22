import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { apiService } from '../../services/api.service';
import MaterialTable, { MTableBody } from "material-table";
import * as actions from '../../store/actions';
import { bindActionCreators } from 'redux';
import { APP_URLS } from "../../config/api.config";

class ResourceLibrary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ResourceLibrary: [],
            isLoading: true
        }
    }

    DownloadResourceLiberary = fileObject => {
        //this.setState({ isLoading: true });
        const DownloadResourceLibraryRequest = {
            Path: fileObject.Id
        };
        apiService.post("DOWNLOADRESOURCELIBRARY", DownloadResourceLibraryRequest).then(response => {
            if (response.Success) {
                window.open(APP_URLS.API_URL + response.path)
            }
            else {
                this.props.actions.showAlert({ message: response.Message, variant: 'error' });
            }
            //this.setState({ isLoading: false });
        }, error => {
            this.props.actions.showAlert({ message: error, variant: 'error' });
            //this.setState({ isLoading: false });
        });
    };

    GetResourceLibraries = () => {
        apiService.post('GETRESOURCELIBRARIES', { linkId: 0, }).then(response => {
            if (response.Success && response.ResourceLibraries) {
                var Links = response.ResourceLibraries
                this.setState({ ResourceLibrary: Links });
            }
            this.setState({ isLoading: false });
        }, error => {
            this.setState({ isLoading: false });
            this.props.actions.showAlert({ message: error, variant: 'error' });
        });
    }

    componentDidMount() {
        this.GetResourceLibraries();
    }
    render() {

        const { ResourceLibrary, isLoading } = this.state;
        return (

            <Fragment>
                <MaterialTable

                    columns={[
                        {
                            title: "FILE/DIRECTORY",
                            field: "Name",
                            sorting: false,
                            render: rowData => <Fragment><div data-testid="td-before" className="tdBefore">FILE/DIRECTORY</div>{rowData.Type === "file" ? <button className='link-button' onClick={() => this.DownloadResourceLiberary(rowData)}>{rowData.Name}</button> : <i className="fa fa-folder-open"> {rowData.Name}</i>}</Fragment>
                        },
                        {
                            title: "DESCRIPTION",
                            field: "Description",
                            sorting: false,
                            render: rowData => <Fragment><div data-testid="td-before" className="tdBefore">DESCRIPTION</div>{rowData.Description}</Fragment>
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
                    data={ResourceLibrary}

                    localization={{
                        pagination: {
                            labelRowsSelect: "rows per page"
                        }
                    }}
                    title="Resource Library"
                    components={{
                        Body: props =>
                            <Fragment> {
                                props.renderData &&
                                    props.renderData.length === 0 ?
                                    <div className="alignCenterExt">No Resource library found</div>
                                    : <MTableBody  {...props} />

                            }
                            </Fragment>

                    }}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(ResourceLibrary);