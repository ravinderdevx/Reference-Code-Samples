<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
 */

Route::group(['middleware' => 'auth'], function () {
    Route::group([
        'prefix' => '',
    ], function () {
        Route::get('/', 'HomeController@index');
        Route::get('/get-notice', 'HomeController@getNotice');
        Route::post('/edit-notice', 'HomeController@editNotice');
        Route::post('/toggle-notice', 'HomeController@toggleNotice');
    });

    //Appointments Section
    Route::group([
        'prefix' => 'appointments',
    ], function () {
        Route::get('/', 'appointmentController@index');
        Route::post('searchAppointments', 'appointmentController@searchAppointments');
        Route::post('deleteAppointment', 'appointmentController@deleteAppointment');
        Route::get('getShiftData', 'appointmentController@getShiftData');
        Route::post('addSchedule', 'appointmentController@addSchedule');
        Route::post('deleteSchedule', 'appointmentController@deleteSchedule');
    });
});

Route::get('/login', 'Auth\LoginController@showLoginForm');
Route::post('/login', 'Auth\LoginController@login')->name('login');
Route::get('/logout', 'Auth\LoginController@logout')->name('logout');
