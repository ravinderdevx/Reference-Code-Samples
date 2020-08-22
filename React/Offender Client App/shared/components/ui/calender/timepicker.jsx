import React, { Component } from "react";
import { TimePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';

class StaticTimePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: this.props.defaultTime ? new Date(this.props.defaultTime) : new Date(),
            name: this.props.name,
            objIndex: this.props.objIndex ? this.props.objIndex : '',
        };
    }

    changeDate = (data) => {
        this.setState({ date: data });
        this.props.onTimeChange(data, this.state.name, this.state.objIndex);
    };

    // prettier-ignore

    render() {
        return (
            <>

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <TimePicker
                        autoOk
                        variant="static"
                        name={this.state.name}
                        openTo="hours"
                        value={this.state.date}
                        onChange={this.changeDate}
                    />
                </MuiPickersUtilsProvider>
            </>
        );
    }

}
export default StaticTimePicker;
