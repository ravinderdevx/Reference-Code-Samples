exports.ErrorResponse = function(res, error, code) { // Error Web Response
    console.log('error------>',error);
    if(error.name == 'ValidationError') {
        return res.status(code?code: 400).json({ success:false, message: error.message  });
    } else if(error.name == 'customError') {
        return res.status(code?code: 400).json({ success:false, message: error.message });
    } else {
        return res.status(code?code: 500).json({ success:false, ...error });
    }
};

exports.SuccessResponse = function(res, response, code){ // Success Web Response
    return res.status(code?code:200).json({ success:true, ...response });
};

exports.ThrowException  = function(error) { // TE stands for Throw Error
    console.log(error);
    throw error;
};