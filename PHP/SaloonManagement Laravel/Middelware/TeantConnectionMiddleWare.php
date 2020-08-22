<?php

namespace App\Http\Middleware;

use App\Helpers\OptionHelper;
use App\Models\tanlink\ClientDatabase;
use Closure;
use Config;
use URL;

class ClientDatabaseConnectionSetup
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        try {
            $client = $request->route()->client;

            $databaseRow = ClientDatabase::where('ClientURL', $client . '.' . env("APP_DOMAIN", "tan-link.com"))->first();

            if (!$databaseRow) {
                die("Database not found. Contact Tan-Link.\r\n");
            }

            $host = config('app.mysql_host');
            $username = config('app.mysql_username');
            $password = config('app.mysql_password');
            $ServerAddress = $request->server('SERVER_ADDR');

            $ServerID = -1;

            if ($ServerAddress == "45.79.3.4") {
                $ServerID = 1;
                $host = "192.168.195.161";
                $backup_host = "66.175.219.83";
            } else if ($ServerAddress == "66.175.219.83") {
                $ServerID = 2;
                $host = "192.168.135.175";
                $backup_host = "45.79.3.4";
            } else if ($ServerAddress == "172.31.8.172") {
                $ServerID = 3;
                $host = "172.31.8.172";
            }

            if ($ServerID == 1) {
                $host = $databaseRow->PrimaryDB;
            } else if ($ServerID == 2) {
                $host = $databaseRow->BackupDB;
            } else if ($ServerID == 3) {
                $host = $databaseRow->BackupDB2;
            }

            $database = $databaseRow->DatabaseName;

            // Get the database config details from wherever and however you want,
            // Could be stored in a database (as JSON), separate file, or stored in an array here

            // And then do something like this
            Config::set('database.connections.mysql2.host', $host);
            Config::set('database.connections.mysql2.database', $database);
            Config::set('database.connections.mysql2.username', $username);
            Config::set('database.connections.mysql2.password', $password);

            URL::defaults(['client' => $client]);

            return $next($request);
        } catch (Exception $e) {
            die("Call Tan-Link at 855-TAN-LINK.\r\n");
        }
    }
}
