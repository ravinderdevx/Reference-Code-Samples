<?php
namespace App\Helpers;

use Illuminate\Http\Request;

class ResponseHelper
{
	/**
     * success response method.
     *
     * @return \Illuminate\Http\Response
     */
    public static function sendResponse($result, $message = null)
    {
    	$response = [
            'success' => true,
            'data'    => $result,
            'message' => $message,
        ];
        
        return response()->json($response, 200);
    }


    /**
     * return error response.
     *
     * @return \Illuminate\Http\Response
     */
    public static function sendError($error, $errorMessages = [], $code = 400)
    {
    	$response = [
          // 'success' => failure,
            'success' => false,
            'message' => $error,
        ];


        if(!empty($errorMessages)){
            $response['data'] = $errorMessages;
        }


        return response()->json($response, $code);
    }
}