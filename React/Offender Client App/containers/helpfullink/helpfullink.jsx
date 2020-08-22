import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { apiService } from '../../services/api.service';
import MaterialTable, { MTableBody } from "material-table";
import * as actions from '../../store/actions';
import { bindActionCreators } from 'redux';

class HelpFulLink extends Component {
    constructor(props) {
        super(props);
        this.state = {
            helpfullink: [],
            isLoading: true
        }
    }
    GetHelpfulLinks = () => {
        apiService.post('GETHELPFULLINKS', { linkId: 0, }).then(response => {
            if (response.Success && response.HelpfulLinks) {
                var Links = response.HelpfulLinks
                this.setState({ helpfullink: Links });
            }
            this.setState({ isLoading: false });
        }, error => {
            this.setState({ isLoading: false });
            this.props.actions.showAlert({ message: error, variant: 'error' });

        });
    }

    componentDidMount() {
        this.GetHelpfulLinks();
    }
    render() {

        const { helpfullink, isLoading } = this.state;
        return (

            <Fragment>
                <MaterialTable

                    columns={[
                        {
                            title: "LINK",
                            field: "link",
                            sorting: false,
                            render: rowData => <Fragment><div data-testid="td-before" className="tdBefore">LINK</div> <a target="_blank" href={rowData.URL} rel="noopener noreferrer">{rowData.Name}</a></Fragment>
                        },
                        {
                            title: "DESCRIPTION",
                            field: "Description",
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
                        draggable:false
                    }}
                    isLoading={isLoading}
                    data={helpfullink}

                    localization={{
                        pagination: {
                            labelRowsSelect: "rows per page"
                        }
                    }}
                    title="Helpful Links"
                    components={{
                        Body: props =>
                            <Fragment> {
                               props.renderData &&
                               props.renderData.length===0 ?
                               <div className="alignCenterExt">No help Links found</div>
                               :  <MTableBody  {...props} /> 
                                   
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

export default connect(mapStateToProps, mapDispatchToProps)(HelpFulLink);