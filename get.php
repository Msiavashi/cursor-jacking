<?php
 	header("Access-Control-Allow-Origin: *");
	$long=$_POST['longitude'];
	$lat=$_POST['latitude'];
	$file = "data.txt";
	$current = file_get_contents($file);
	$current .= $long."   ,   ".$lat."\n";
	file_put_contents($file, $current);
?>.
