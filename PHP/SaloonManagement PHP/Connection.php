<?
	$Host = "127.0.0.1";
	$Username = "root";
	$Password = "";
	
	$Connection = mysql_connect($Host, $Username, $Password);
	if (!$Connection)
	{
		echo "Connection failed to $host.";
		exit;
	}
	
	if (!mysql_select_db($database))
	{
		echo "Database not found.";
		exit;
	}

?>