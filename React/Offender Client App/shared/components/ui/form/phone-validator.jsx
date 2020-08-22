import React, { Fragment } from 'react';
import { ValidatorComponent } from 'react-form-validator-core';
import InputMask from 'react-input-mask';

class PhoneValidator extends ValidatorComponent {

    render() {
      
        const { errorMessages, validators, requiredError, validatorListener, ...rest } = this.props;
        return (
            <Fragment>
                <div className="Form">
                    <div className="input-group">
                        <InputMask {...this.props} mask="999-999-9999" maskChar=" " className="form-control  input-sm" {...rest}
                            ref={(r) => { this.input = r; }} />
                    </div>
                    <div className="error">
                        {this.errorText()}
                    </div>
                </div>
            </Fragment>
        );
    }

    errorText() {
        const { isValid } = this.state;

        if (isValid) {
            return null;
        }

        return (
            this.getErrorMessage()
        );
    }
}

export default PhoneValidator;