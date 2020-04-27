<?php
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
?>

<!DOCTYPE html>
<html class="htmlStyle">
    <head>
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
        <meta http-equiv="Pragma" CONTENT="no-cache">
        <meta http-equiv="Expires" CONTENT="-1">
        
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, target-densitydpi=device-dpi">
        <meta http-equiv="content-type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="./css/fonts/exo2.css">
        <link rel="icon" href="./img/favicon.ico" type="image/vnd.microsoft.icon">
        <link rel="stylesheet" type="text/css" href="./css/fontAwesome/css/fontawesome-all.min.css">
        <link rel="stylesheet" type="text/css" href="./css/devos3d.css">
        <script type="text/javascript" src="./incl/threejs/build/three.js"></script>
        <script type="text/javascript" src="./js/addons/GeometryUtils.js"></script>
        <script type="text/javascript" src="./js/addons/QuickHull.js"></script>
        <script type="text/javascript" src="./js/addons/ConvexGeometry.js"></script>
        <script type="text/javascript" src="./incl/threejs/examples/js/controls/controls/OrbitControls.js"></script>
        <script type="text/javascript" src="./js/common.js"></script>
        <script type="text/javascript" src="./js/devos3d.js"></script>
        <script type="text/javascript" src="./js/logging.js"></script>
        <script type="text/javascript" src="./js/addons/es6shim.js"></script>
        <script type="text/javascript" src="./js/addons/math.js"></script>
        <script type="text/javascript" src="./js/addons/fileSaver.js"></script>
        <title>DEVOS3d - Datenerfassungs-, Visualisierungs- und Organisationssystem in 3D</title>
    </head>
    <body onload="devos3d.pageLoad();" onresize="devos3d.gui.resize();">
        <?php include "./incl/devos3d.php"; ?>
    </body>
</html>