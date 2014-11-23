<?php

header("Content-type: text/json");

echo (floatval($_POST['lat']) * 1000) % 2 == 0 ? '{"id": ' . rand(1, 100) . '}' : false;
