const dismissOnTimeout = 5000;

const successMessageObject = (message) => {
    return {
        type: "success",
        message: message,
        text: "Success",
        timeout: dismissOnTimeout
    };
}

const errorMessageObject = (message) => {
    return {
        type: "danger",
        message: message,
        text: "Error",
        timeout: dismissOnTimeout
    };
}

const warningMessageObject = (message) => {
    return {
        type: "warning",
        message: message,
        text: "Warning",
        timeout: dismissOnTimeout
    };
}

const infoMessageObject = (message) => {
    return {
        type: "info",
        message: message,
        text: "Info",
        timeout: dismissOnTimeout
    };
}

export const messageService = {
    successMessageObject,
    errorMessageObject,
    warningMessageObject,
    infoMessageObject
};