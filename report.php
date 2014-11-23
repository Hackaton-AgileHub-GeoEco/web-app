<?php

echo (floatval($_POST['lat']) * 1000) % 2 == 0 ? 7 : false;
