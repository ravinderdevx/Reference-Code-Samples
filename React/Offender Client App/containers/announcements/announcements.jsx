import React, { Component, Fragment } from "react";
import MaterialTable, { MTableBody } from "material-table";
import FormatDateTime from "../../shared/components/functional/DateTimeFormatter";
import { apiService } from "../../services/api.service";
import * as actions from "../../store/actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class Announcements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kioskAnnouncements: [],
      isLoading: true,
    };
  }
  GetKioskAnnouncements = () => {
    const { auth } = this.props;

    apiService
      .post("GETKIOSKANNOUNCEMENTS", {
        Id: -1,
        Expired: true,
        CompanyId: auth.user.CompanyId,
      })
      .then(
        (response) => {
          if (response.Success && response.announcementLists) {
            this.setState({
              kioskAnnouncements: response.announcementLists,
            });
          }
          this.setState({ isLoading: false });
        },
        (error) => {
          this.setState({ isLoading: false });
          this.props.actions.showAlert({ message: error, variant: "error" });
        }
      );
  };

  componentDidMount() {
    this.GetKioskAnnouncements();
  }
  render() {
    const { kioskAnnouncements, isLoading } = this.state;
    const createMarkup = (htmlString) => ({ __html: htmlString });
    return (
      <Fragment>
        <MaterialTable
          columns={[
            {
              title: "Announcement",
              field: "Announcement",
              render: (rowData) => (
                <Fragment>
                  <div data-testid="td-before" className="tdBefore">
                    Announcement
                  </div>
                  <div
                    dangerouslySetInnerHTML={createMarkup(rowData.Announcement)}
                  ></div>
                </Fragment>
              ),
            },
            {
              title: "Expiration Date",
              field: "ExpirationDate",
              render: (rowData) => (
                <Fragment>
                  <div data-testid="td-before" className="tdBefore">
                    Expiration Date
                  </div>
                  <FormatDateTime
                    date={rowData.ExpirationDate}
                    format="MM/DD/YYYY"
                  />
                </Fragment>
              ),
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
              color: "#FFF",
            },
            actionsColumnIndex: -1,
            minBodyHeight: "300px",
            draggable: false,
          }}
          isLoading={isLoading}
          data={kioskAnnouncements}
          localization={{
            pagination: {
              labelRowsSelect: "rows per page",
            },
          }}
          title="Announcements"
          components={{
            Body: (props) => (
              <Fragment>
                {props.renderData && props.renderData.length === 0 ? (
                  <div className="alignCenterExt">
                    No announcements to display
                  </div>
                ) : (
                  <MTableBody {...props} />
                )}
              </Fragment>
            ),
          }}
        />
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      showAlert: bindActionCreators(actions.showAlert, dispatch),
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Announcements);
