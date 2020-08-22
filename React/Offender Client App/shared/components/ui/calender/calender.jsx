import React, { Component } from "react";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { DatePicker } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';


class StaticDatePicker extends Component {

    constructor(props) {

        super(props);
        this.state = {
            date: this.props.defaultDate ? new Date(this.props.defaultDate) : new Date(),
            name: this.props.name,
            minDate: this.props.minDate ? this.props.minDate : '',
            maxDate: this.props.maxDate ? this.props.maxDate : '',
            objIndex: this.props.objIndex ? this.props.objIndex : ''
        };
    }
    changeDate = (data) => {

        const obj = this.state;
        this.setState({ date: data });
        this.props.onDateChange(data, obj.name, obj.objIndex);
    };
    // prettier-ignore
    render() {
        return (
            <>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                        autoOk
                        variant="static"
                        openTo="date"
                        name={this.state.name}
                        minDate={this.state.minDate}
                        maxDate={this.state.maxDate}
                        value={this.state.date}
                        onChange={this.changeDate}
                        showTodayButton="true"
                        inputVariant="standard"
                        animateYearScrolling="true"
                    />
                </MuiPickersUtilsProvider>
            </>
        );
    }
};

export default StaticDatePicker;