import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import { bindActionCreators } from 'redux';
import { apiService } from '../../services/api.service'
import CircularProgress from '@material-ui/core/CircularProgress';
import ImageUploader from 'react-images-upload';
import upload from '../../assets/images/upload.png';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';        
class UploadImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clickedImage: '',
            isImageUplodaed: false,
            loading: false
        }
    }

    handlePhotoUpload = (file) => {
        if (file.length > 0) {
            this.setState({ isImageUplodaed: true, clickedImage: file[0] });
        } else {
            this.setState({ isImageUplodaed: false, clickedImage: '' });
        }
    }

    SaveClientImageDetails = () => {
        const { auth } = this.props;
        this.setState({ loading: true });
        var formData = new FormData();
        let data = { ClientId: auth.user.ClientId };
        formData.append("file", this.state.clickedImage);
        formData.append("requestdata", JSON.stringify(data));
        apiService.post("INSERTCLIENTIMAGE", formData).then(
            response => {
                if (response.Success === true) {

                    this.props.actions.showAlert({ message: response.Message, variant: "success" });

                    this.props.history.push('/checkin/capture');
                }
                else {
                    this.props.actions.showAlert({ message: response.Message, variant: "error" });
                }
                this.setState({ loading: false });
            },
            error => {
                this.setState({ loading: false });
                this.props.actions.showAlert({ message: error, variant: "error" });
            }
        );
    };

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
   
    render() {
        const { isImageUplodaed, loading } = this.state;
        const loader = this.getAddClass()
        return (
            <div className="materImageUpload">

                <ImageUploader
                    withIcon={true}
                    singleImage={true}
                    buttonText='Click here to select image'
                    singleImage={true}
                    maxFileSize={6000000}
                    accept="image/*"
                    imgExtension={['.jpeg', '.jpg', '.png']}
                    label=""
                    withPreview={true}
                    onChange={this.handlePhotoUpload}
                    buttonStyles={this.state.clickedImage !== '' ? { display: "none" } : { display: "block" }}
                />

                {isImageUplodaed === true &&
                    <Tooltip title="Upload Image" aria-label="add">

                        <button className="uploadButton" color="primary" onClick={this.SaveClientImageDetails} >
                            <Fab color="secondary" >
                                <AddIcon />
                            </Fab>
                        </button>

                    </Tooltip>
                }
                {loading && <div className="loaderDiv"><div className="loader"><CircularProgress /></div></div>}
            </div>
        )
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
export default connect(mapStateToProps, mapDispatchToProps)(UploadImage)