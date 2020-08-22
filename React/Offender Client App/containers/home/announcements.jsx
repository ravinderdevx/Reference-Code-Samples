import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import moment from "moment";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as actions from "../../store/actions";
import { bindActionCreators } from "redux";
import { apiService } from "../../services/api.service";
import FormatDateTime from "../../shared/components/functional/DateTimeFormatter";
import AnnouncementModal from "../../shared/components/ui/modal/announcement-modal";
import { Link } from "react-router-dom";

class Announcements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kioskAnnouncements: [],
      loading: true,
    };
  }
  close = () => {
    this.setState({ showModal: false, kioskAnnouncement: "" });
  };
  open = (e, kioskAnnouncement) => {
    e.preventDefault();
    this.setState({ showModal: true, kioskAnnouncement: kioskAnnouncement });
  };
  GetKioskAnnouncements = () => {
    const { auth } = this.props;

    apiService
      .post("GETKIOSKANNOUNCEMENTS", {
        Id: -1,
        Expired: false,
        CompanyId: auth.user.CompanyId,
      })
      .then(
        (response) => {
          if (response.Success && response.announcementLists) {
            this.setState({
              kioskAnnouncements: response.announcementLists,
            });
          }
          this.setState({ loading: false });
        },
        (error) => {
          this.props.actions.showAlert({ message: error, variant: "error" });
          this.setState({ loading: false });
        }
      );
  };
  componentDidMount() {
    this.GetKioskAnnouncements();
  }
  render() {
    const {
      kioskAnnouncements,
      kioskAnnouncement,
      loading,
      showModal,
    } = this.state;
    return (
      <Fragment>
        <div className="card">
          <div className="card-header announcement">
            <div className="icon">
              <i className="fa fa-bullhorn"></i>
            </div>
            Announcements <small>Recently posted important information</small>
            <div className="arrowRight">
              <Link className="active" to={`/Announcement`}>
                <i className="fa fa-arrow-right"></i>
              </Link>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table tableBodyScroll">
                <tbody>
                  {!loading &&
                    (kioskAnnouncements.length > 0 ? (
                      kioskAnnouncements.map((kioskAnnouncement) => (
                        <tr key={kioskAnnouncement.Id}>
                          <td>{kioskAnnouncement.AnnouncementDecoded}</td>
                          <td className="text-right">
                            <i
                              className="fa fa-info"
                              aria-hidden="true"
                              onClick={(e) => this.open(e, kioskAnnouncement)}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>No annoucments</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {loading && (
                <div className="loaderDiv">
                  <div className="loader">
                    <CircularProgress />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <AnnouncementModal
          onClose={this.close}
          announcement={kioskAnnouncement}
          showModal={showModal}
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
