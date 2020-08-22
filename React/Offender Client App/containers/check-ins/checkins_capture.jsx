import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import { bindActionCreators } from 'redux';
import { apiService } from '../../services/api.service';
import { isMobile } from 'react-device-detect';
import capture_img from '../../assets/images/capture_image.png';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { geolocated, geoPropTypes } from "react-geolocated";
import moment from 'moment';


class CheckIn_Capture extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isImageClicked: false,
            imageData: '',
            clickedDate: '',
            orignalFaceId: 0,
            clickedfaceId: 0,
            lat: '',
            long: '',
            loading: false
        }
    }
    componentDidMount() {
        if (isMobile) {
            this.getGeoLocation();
        }
    }

    handleChange = (e) => {
        let fileData = e.target.files[0];
        if (e.target.value) {
            this.setState({
                isImageClicked: true, imageData: fileData, clickedDate: new Date()
            });
        } else {
            this.setState({ isImageClicked: false, imageData: '', clickedDate: '' });
        }
    }

    SaveClientLocationDetails = (clickedDate, latitudeCoordinates, longitudeCoordinates) => {
        const { auth } = this.props;
        this.setState({ loading: true });
        var formData = new FormData();
        let data = { ClientId: auth.user.ClientId, Latitude: latitudeCoordinates, Longitude: longitudeCoordinates, CreatedDate: clickedDate };
        formData.append("file", this.state.imageData);
        formData.append("requestdata", JSON.stringify(data));
        apiService.post("VALIDATEANDINSERTLOCATIONDETAILS", formData).then(
            response => {
                if (response.Success === true) {
                    this.props.history.push('/checkin/history');
                    this.props.actions.showAlert({ message: response.Message, variant: "success" });
                }
                else if (response.Success === false) {
                    if (response.Message.includes("isIdentical")) {
                        var responsedata = JSON.parse(response.Message);
                        this.props.actions.showAlert({ message: `Trouble confirming faces. Please upload another one.`, variant: "error" });
                    }
                    else {
                        this.props.actions.showAlert({ message: response.Message, variant: "error" });
                    }
                }
                this.setState({ loading: false });
            },
            error => {
                this.setState({ loading: false });
                this.props.actions.showAlert({ message: error, variant: "error" });
            }
        );
    };



    validateImage = () => {
        const { lat, long, clickedDate } = this.state;
        if (clickedDate < moment(new Date()).subtract(5, "minutes").toDate()) {
            this.props.actions.showAlert({ message: "Please upload image of recent 5 minutes.", variant: 'error' });
            return false;
        }
        if (lat === '' && long === '') {
            this.props.actions.showAlert({ message: "Please turn on your browser location services.", variant: 'error' });
            return false;
        }
        this.SaveClientLocationDetails(clickedDate, lat, long);

    }

    getGeoLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.ShowPosition, this.geoLocationError);
        }
        else {
            this.props.actions.showAlert({ message: "Geolocation is not supported by this browser.", variant: "error" });
        }
    }
    ShowPosition = (position) => {
        this.setState({ lat: position.coords.latitude, long: position.coords.longitude });
    }

    getAddClass = () => {
        if (this.state.loading) {
            document.body.classList.add('addloding');
            return true;
        }
        else {
            document.body.classList.remove('addloding');
            return false;
        }
    }
    geoLocationError = (error) => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                this.props.actions.showAlert({ message: "Please allow location access from browser settings.", variant: "warning" });
                break;
            case error.POSITION_UNAVAILABLE:
                this.props.actions.showAlert({ message: "Location information is unavailable.", variant: "warning" });
                break;
            case error.TIMEOUT:
                this.props.actions.showAlert({ message: "The request to get user location timed out.", variant: "warning" });
                break;
            case error.UNKNOWN_ERROR:
                this.props.actions.showAlert({ message: "An unknown error occurred.", variant: "warning" });
                break;
        }
    }

    render() {
        const { isImageClicked, loading } = this.state;
        const loader = this.getAddClass()
        if (isMobile) {
            return (
                <div className="checkin_capture">
                    <label>Click here to capture </label>
                    <label htmlFor="image_capture">
                        <img src={capture_img} />
                    </label>
                    <input style={{ "display": "none" }} id="image_capture" type="file" accept="image/*" capture="camera" onChange={this.handleChange} />
                    {isImageClicked === true &&
                        <Button variant="outlined" color="primary" onClick={this.validateImage}>
                            Upload
                        </Button>
                    }
                    {loading && <div className="loaderDiv"><div className="loader"><CircularProgress /></div></div>}
                </div>
            )
        } else {
            return <div className="checkin_capture" > Content of this page is available on mobile view</div>
        }
    }
}


CheckIn_Capture.propTypes = { ...CheckIn_Capture.propTypes, ...geoPropTypes };
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
export default connect(mapStateToProps, mapDispatchToProps)(CheckIn_Capture)