<!DOCTYPE html>
<html lang="en">
<head>
    <title>DEVOS3d - Datenerfassungs-, Visualisierungs- und Organisationssystem in 3D</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Pragma" CONTENT="no-cache">
    <meta http-equiv="Expires" CONTENT="-1">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <style>
        body {
            color: #61443e;
            font-family: Monospace;
            font-size: 13px;
            text-align: center;

            background-color: #bfd1e5;
            margin: 0px;
            overflow: hidden;
        }

        #info {
            position: absolute;
            top: 0px;
            width: 100%;
            padding: 5px;
        }

        a {

            color: #a06851;
        }

    </style>
    <link rel="icon" href="img/favicon.ico" type="image/vnd.microsoft.icon">
    <link rel="stylesheet" type="text/css" href="css/fonts/exo2.css">
    <link rel="stylesheet" type="text/css" href="css/fontAwesome/css/fontawesome-all.min.css">
    <link rel="stylesheet" type="text/css" href="css/devos3d.css">
    <link rel="stylesheet" type="text/css" href="css/footer.css">

    <script type="text/javascript" src="./incl/threejs/build/three.js"></script>
    <!--<script type="text/javascript" src="incl/threejs/src/Three.js"></script>-->
    <script type="text/javascript" src="incl/threejs/examples/js/ImprovedNoise.js"></script>
    <script type="text/javascript" src="incl/threejs/examples/js/Detector.js"></script>
    <script type="text/javascript" src="incl/threejs/examples/js/libs/stats.min.js"></script>


    <script type="text/javascript" src="incl/threejs/examples/js/controls/OrbitControls.js"></script>
    <script type="text/javascript" src="incl/threejs/examples/js/controls/DeviceOrientationControls.js"></script>
    <script type="text/javascript" src="incl/threejs/examples/js/controls/MapControls.js"></script>
    <script type="text/javascript" src="incl/threejs/examples/js/controls/PointerLockControls.js"></script>
    <script type="text/javascript" src="incl/threejs/examples/js/controls/TrackballControls.js"></script>
    <script type="text/javascript" src="incl/threejs/examples/js/controls/PointerLockControls.js"></script>
    <script type="text/javascript" src="incl/threejs/examples/js/controls/FirstPersonControls.js"></script>

    <script type="text/javascript" src="incl/fpControls.js"></script>

    <script type="text/javascript" src="incl/threejs/examples/js/renderers/CSS2DRenderer.js"></script>


    <script type="text/javascript" src="incl/simplify-js-3d/simplify.js"></script>
    <script type="text/javascript" src="incl/exif.js"></script>
    <!-- TODO decide which controls to use -->

    <script type="text/javascript" src="incl/threejs/examples/js/objects/Sky.js"></script>
    <script type="text/javascript" src="incl/threejs/examples/js/libs/dat.gui.min.js"></script>

    <script type="text/javascript" src="incl/osmtogeojson-gh-pages/osmtogeojson.js"></script>

    <script type="text/javascript" src="https://code.jquery.com/jquery-1.10.0.min.js"></script>
    <script type="text/javascript" src='incl/proj4js-2.4.3/dist/proj4-src.js'></script>

    <script type="text/javascript" src="incl/suncalc-master/suncalc.js"></script>

    <script type="text/javascript" src="js/devos3d.js"></script>
    <script type="text/javascript" src="js/common.js"></script>
    <script type="text/javascript" src="js/gui.js"></script>
    <script type="text/javascript" src="js/userSettings.js"></script>

    <script type="text/javascript" src="js/addons/geoTiffParser.js"></script>
    <script type="text/javascript" src="js/sceneObjects/map/TerrainTile.js"></script>
    <script type="text/javascript" src="js/sceneObjects/map/terrain.js"></script>

    <script type="text/javascript" src="js/sceneObjects/map/dgm.js"></script>
    <script type="text/javascript" src="js/sceneObjects/sceneObjects.js"></script>
    <script type="text/javascript" src="js/sceneObjects/userPosition.js"></script>
    <script type="text/javascript" src="js/sceneObjects/sky.js"></script>
    <script type="text/javascript" src="js/sceneObjects/osmObjects/openStreetMap.js"></script>
    <script type="text/javascript" src="js/sceneObjects/osmObjects/streets.js"></script>
    <script type="text/javascript" src="js/sceneObjects/osmObjects/building.js"></script>
    <script type="text/javascript" src="js/sceneObjects/osmObjects/railway.js"></script>
    <script type="text/javascript" src="js/sceneObjects/osmObjects/waterway.js"></script>
    <script type="text/javascript" src="js/sceneObjects/osmObjects/fixOSMObject.js"></script>
    <script type="text/javascript" src="js/sceneObjects/projectData/ProjectTileInfos.js"></script>
    <script type="text/javascript" src="js/sceneObjects/projectData/imageLoader.js"></script>
    <script type="text/javascript" src="js/sceneObjects/projectData/projectDataObjects/Point.js"></script>
    <script type="text/javascript" src="js/sceneObjects/projectData/projectDataObjects/Line.js"></script>
    <script type="text/javascript" src="js/sceneObjects/projectData/projectDataObjects/Polygon.js"></script>
    <script type="text/javascript" src="js/sceneObjects/projectData/projectDataObjects/ProjectObjects.js"></script>


    <!--
    <script type="text/javascript" src="js/sceneObjects/projectData/projectFiles.js"></script>
    <script type="text/javascript" src="js/sceneObjects/projectData/ProjectObjects.js"></script>
    <script type="text/javascript" src="js/sceneObjects/projectData/ProjectData.js"></script>
    <script type="text/javascript" src="js/sceneObjects/projectData/catalogsImporter.js"></script>
    <script type="text/javascript" src="js/sceneObjects/projectData/tagsImporter.js"></script>
    <script type="text/javascript" src="js/sceneObjects/projectData/projectDataObjects/text.js"></script>
    <script type="text/javascript" src="js/sceneObjects/projectData/projectDataObjects/icon.js"></script>
    <script type="text/javascript" src="js/sceneObjects/projectData/projectDataObjects/positionInfo.js"></script>
    <script type="text/javascript" src="js/sceneObjects/projectData/projectDataObjects/notify.js"></script>
    <script type="text/javascript" src="js/sceneObjects/projectData/projectDataObjects/marker.js"></script>
    <script type="text/javascript" src="js/sceneObjects/projectData/projectDataObjects/markerDirection.js"></script>
    <script type="text/javascript" src="js/sceneObjects/projectData/projectDataObjects/currentPosition.js"></script>
    -->
    <script type="text/javascript" src="js/sceneObjects/contentImporter.js"></script>

    <script type="text/javascript" src="js/addons/es6shim.js"></script>
    <script type="text/javascript" src="js/addons/math.js"></script>
    <script type="text/javascript" src="js/addons/fileSaver.js"></script>
    <script type="text/javascript" src="js/lighting.js"></script>
    <?php include "./js/shader/shader.php"; ?>
</head>
<body onload="devos3d.pageLoad();" onresize="gui.resize();">
<?php include "./incl/devos3d.php"; ?>
</body>
</html>
