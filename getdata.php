<?php

$conn = new mysqli($server, $user, $pass, $db);
$loc = $_POST['l_id'];

$sql  = 'CREATE TEMPORARY TABLE cel1 SELECT n_id FROM nodes WHERE location =' .$loc. ';';	
$sql .= 'CREATE TEMPORARY TABLE lin1 SELECT source, target FROM links WHERE source IN (SELECT * FROM cel1);';
$sql .=	'CREATE TEMPORARY TABLE lin2 SELECT source, target FROM links WHERE target IN (SELECT * FROM cel1);';
$sql .=	'CREATE TEMPORARY TABLE loc2 SELECT location FROM nodes WHERE n_id IN (SELECT target FROM lin1) OR n_id IN (SELECT target FROM lin2);';
$sql .=	'CREATE TEMPORARY TABLE loc3 SELECT l_id, l_name FROM locations WHERE l_id IN (SELECT * FROM loc2);';
$sql .=	'CREATE TEMPORARY TABLE cel2 SELECT n_id, name, location FROM nodes WHERE location in (SELECT l_id FROM loc3); ';
$sql .=	'CREATE TEMPORARY TABLE cel3 SELECT n_id FROM cel2;';
$sql .=	'CREATE TEMPORARY TABLE lin3 SELECT source, target FROM links WHERE source IN (SELECT n_id FROM cel2) AND target IN (SELECT n_id FROM cel3);';
$sql .= 'SELECT * FROM loc3';
$sql2 = 'SELECT * FROM cel2';
$sql3 = 'SELECT * FROM lin3';

    echo '{
"locations": [';
if (mysqli_multi_query($conn,$sql))
{
  do
    {
    if ($result=mysqli_store_result($conn)) {
      while ($row=mysqli_fetch_assoc($result))
        {
        echo json_encode ($row);
		}
      mysqli_free_result($result);
      }
    }
  while (mysqli_next_result($conn));
}
	echo '],
"cells": [';
if ($result = $conn->query($sql2)) {

    while ($row = $result->fetch_assoc()) {
		echo json_encode ($row);
    }
    $result->free();
}
echo '],
"links": [';
if ($result = $conn->query($sql3)) {

    while ($row = $result->fetch_assoc()) {
		echo json_encode ($row);
    }
    $result->free();
}
echo ']
}';
mysqli_close($conn);
?>



    