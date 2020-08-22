import React, { Fragment } from 'react';

import { ValidatorComponent } from 'react-form-validator-core';

class SelectValidator extends ValidatorComponent {

    render() {
        const { errorMessages, validators, requiredError, validatorListener, ...rest } = this.props;
        return (

            <Fragment>
                <div className="Form">
                    <div className="input-group">
                        <select
                            {...rest}
                            ref={(r) => { this.input = r; }}
                        />
                    </div>
                    <div className="error">
                        {this.errorText()}
                    </div>
                </div>
            </Fragment>

            // <div className="Inputbox">
            //     <select
            //         {...rest}
            //         ref={(r) => { this.select = r; }}
            //     />
            //     {this.errorText()}
            // </div>
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

export default SelectValidator;