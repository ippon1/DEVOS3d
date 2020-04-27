// http://localhost:8888/devos3d/devos3d/webgl_geometry_terrain_raycast.php
let devos3d =
    {
        container: null,
        stats: null,

        camera: null, // TODO camera auslagern in eigenes File

        heightOverTerrain: 70,

        viewport: {"width": null, "height": null},
        controls: null,
        scene: null,

        renderer: null,
        labelRenderer: null,

        objectsInScene: [],

        //TODO vielleicht renamen: groesse derkacheln;
        worldWidth: 256,
        worldDepth: 256,

        worldHalfWidth: null,
        worldHalfDepth: null,

        clock: new THREE.Clock(),

        //cameraPosition: [41472, 300, 12800],
        cameraPosition: [0, 300, 0],
        currentUserLocation: null,
        userPositionObject: null,

        coordinatesYbbsitz: [14.88, 47.93, 14.93, 47.98], //
        coordinatesWienDec: [16.366667, 48.2], // Wien: 48°12′N 16°22′E
        coordinatesExampleRegion: [13.0006, 47.8072],

        displayFromRendererTimes: 0,
        terrainloadcycle: 0,
        counterTurnCamera: 0,
        sky: null,
        date: null, // stored as number convert with: new Date(Date.now()), Data.parse(new Date(date)) === date


        /* controls: {
            moveForward: false,
            moveBackward: false,
            moveLeft: false,
            moveRight: false
        }, / */

        target: null,


        pageLoad: function () {
            devos3d.stats = new Stats();

            // TODO load vrt file first
            devos3d.updateCurrentGPSLocation();
            if (!Detector.webgl) {
                Detector.adetWebGLMessage();
                document.getElementById('container').innerHTML = "";
            }

            devos3d.worldHalfWidth = devos3d.worldWidth / 2;
            devos3d.worldHalfDepth = devos3d.worldDepth / 2;
            devos3d.container = document.getElementById('container');

            devos3d.renderer = new THREE.WebGLRenderer({antialias: true, logarithmicDepthBuffer: true});
            devos3d.renderer.shadowMap.enabled = false;
            devos3d.renderer.physicallyCorrectLights = true;
            devos3d.renderer.gammaInput = true;
            devos3d.renderer.gammaOutput = true;
            devos3d.renderer.toneMapping = THREE.ReinhardToneMapping;
            devos3d.renderer.setPixelRatio(window.devicePixelRatio);
            devos3d.renderer.setSize(window.innerWidth, window.innerHeight);

            /*/ Label Renderer

            devos3d.labelRenderer = new THREE.CSS2DRenderer();
            devos3d.labelRenderer.setSize(window.innerWidth, window.innerHeight);
            devos3d.labelRenderer.domElement.style.position = 'absolute';
            devos3d.labelRenderer.domElement.style.top = 0;
            document.body.appendChild(devos3d.labelRenderer.domElement);

            /////////////////// */


            // TODO https://blender.stackexchange.com/questions/8437/ideal-camera-settings-to-approximate-human-eye#8439
            // https://stackoverflow.com/questions/8506087/what-is-the-correct-field-of-view-angle-for-human-eye
            let NEAR = 1e-6, FAR = 1e27; // TODO Far can be smaller
            let SCREEN_WIDTH = window.innerWidth;
            let SCREEN_HEIGHT = window.innerHeight;
            let fov = 50;
            devos3d.camera = new THREE.PerspectiveCamera(fov, SCREEN_WIDTH / SCREEN_HEIGHT, NEAR, FAR);
            +console.log(window.innerWidth + ", " + window.innerHeight);
            console.log(window.innerWidth + ", " + window.innerHeight);
            devos3d.camera.rotateOnAxis(new THREE.Vector3(0, -1, 0), devos3d.degInRad(180)); // TODO einblenden fuer debugging

            //devos3d.camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 100000);

            /* Transformmatrix nicht implementiert
            if (devos3d.currentUserLocation !== null) {
                console.log("pageLoad");
                console.log(devos3d.currentUserLocation.latitude + ", " + devos3d.currentUserLocation.longitude);
                //let position = sceneObjects.transformCoordinatesToMap(devos3d.currentUserLocation.latitude, devos3d.currentUserLocation.longitude);
            } // */


            devos3d.scene = new THREE.Scene();


            devos3d.container.innerHTML = "";

            devos3d.container.appendChild(devos3d.renderer.domElement);
            devos3d.renderer.domElement.id = "threejsCanvas";

            devos3d.container.appendChild(devos3d.stats.dom);
            if (userSettings.allowUserToChangeSettings) {
                gui.settings();
            }

            window.addEventListener('onMouseMove', gui.onWindowResize, false); // TODO edit here


            window.addEventListener('resize', gui.onWindowResize, false); // TODO edit here

            document.addEventListener('mousedown', gui.onDocumentMouseDown, false);
            devos3d.date = Date.now();
            devos3d.sky = new Sky();
            devos3d.sky.initSky();
            let x = new Date(devos3d.date);
            console.log("Current Date: ");

            console.log("Current Date: " + x);
            console.log("Current Date: ");

            x.setHours(18, 0, 0, 0);
            console.log("Current Date: ");

            console.log("Current Date: " + x);
            console.log("Current Date: ");

            // devos3d.sky.updateSunPosition(x); // TODO maybe update regularly

            devos3d.userPositionObject = new UserPosition();
            lighting.addLighting();


            let showTarget = false;

            if (showTarget) {
                console.log(devos3d.target);
                let options = {"diameter": 100};
                devos3d.target = sceneObjects.addPoint(
                    {"x": 0, "y": 0, "z": 0},
                    {"x": 0, "y": 0, "z": 0},
                    options,
                    new THREE.MeshBasicMaterial({color: 0x00ff00}),
                    "");
                console.log(devos3d.target);
            }

        },

        degInRad: function (deg) {
            return deg * Math.PI / 180;
        },

        animate: function () {
            //console.log("Function: animate");
            // console.log(devos3d.controls);
            requestAnimationFrame(devos3d.animate);
            devos3d.render();
            //console.log(devos3d.camera.position);
            if (devos3d.controls !== null) devos3d.controls.update();
            //console.log(devos3d.camera.position);
            if (devos3d.stats !== null) devos3d.stats.update();
        },

        cameraWasSet: false,
        render: function () {
            //console.log(devos3d.scene);

            //console.log(devos3d.camera.position);
            //console.log(devos3d.camera.position);
            //console.log(devos3d.camera.position);


            // console.log(devos3d.camera.position);
            // console.log(devos3d.camera.rotation);
            // if (devos3d.controls !== null) console.log(devos3d.controls.target);

            if (devos3d !== null && devos3d !== null && devos3d.target !== null && devos3d.target !== undefined && devos3d.controls !== null && devos3d.controls !== undefined) {
                //console.log(devos3d.controls.target);
                //console.log(devos3d.camera.position);
                //

                let showPosition = true;
                if (showPosition) {
                    let options = {"diameter": 0.1};
                    sceneObjects.addPoint(
                        {
                            "x": devos3d.camera.position.x,
                            "y": devos3d.camera.position.y + 1,
                            "z": devos3d.camera.position.z + 1
                        },
                        {"x": 0, "y": 0, "z": 0},
                        options,
                        new THREE.MeshBasicMaterial({color: 0x00ff00}),
                        "");

                    sceneObjects.addPoint(
                        {
                            "x": devos3d.controls.target.x,
                            "y": devos3d.controls.target.y,
                            "z": devos3d.controls.target.z - 1
                        },
                        {"x": 0, "y": 0, "z": 0},
                        options,
                        new THREE.MeshBasicMaterial({color: 0xff0000}),
                        "");
                }

                devos3d.target.position = new THREE.Vector3(
                    devos3d.controls.target.x,
                    devos3d.controls.target.y,
                    devos3d.controls.target.z - 0.01);
            } else {
                // console.log(devos3d);
                //console.log(devos3d.target);
            }

            if (!devos3d.cameraWasSet && devos3d.camera !== null &&
                terrain.currentCentralTileMesh !== null && terrain.currentCentralTileMesh !== undefined &&
                terrain.currentCentralTileMesh.position !== null && terrain.currentCentralTileMesh.position !== undefined
                && devos3d.controls === null) { // TODO devos3d.controls === null ???????

                devos3d.cameraWasSet = !devos3d.cameraWasSet;
                let currentHeight = terrain.getHeightOfPoint([terrain.currentCentralTileMesh.position.x, terrain.currentCentralTileMesh.position.z]);
                devos3d.camera.position.x = terrain.currentCentralTileMesh.position.x; // TODO why is this value 10 to high
                devos3d.camera.position.y = currentHeight !== null ? currentHeight : null;
                devos3d.camera.position.z = terrain.currentCentralTileMesh.position.z; // TODO maybe chang to the current position
                /*
                                if (false && MobileDevice()) {
                                    if (false && devos3d.useCameraSensorsForOrientation) {
                                        devos3d.controls = new THREE.DeviceOrientationControls(devos3d.camera, true);
                                    } else {
                                        devos3d.controls = new THREE.MapControls(devos3d.camera, devos3d.renderer.domElement);
                                    }
                                } else if (false) {
                                    devos3d.controls = new THREE.OrbitControls(devos3d.camera, devos3d.renderer.domElement);
                                    devos3d.controls.target.set(0, 50, 0); // TODO updates
                                } else if (false) {
                                    devos3d.controls = new THREE.TrackballControls(devos3d.camera);
                                    devos3d.controls.rotateSpeed = 1.0;
                                    devos3d.controls.zoomSpeed = 1.2;
                                    devos3d.controls.panSpeed = 0.8;
                                    devos3d.controls.noZoom = false;
                                    devos3d.controls.noPan = false;
                                    devos3d.controls.staticMoving = true;
                                    devos3d.controls.dynamicDampingFactor = 0.3;
                                    devos3d.controls.keys = [65, 83, 68];
                                    devos3d.controls.addEventListener('change', devos3d.render);
                                } else if (false) {
                                    devos3d.controls = new THREE.FirstPersonControls(devos3d.camera, devos3d.renderer.domElement);
                                } else // */
                if (true) { // TODO check how it works with tablet
                    devos3d.controls = new THREE.MapControls(devos3d.camera, devos3d.renderer.domElement);

                    devos3d.controls.minDistance = 1;
                    devos3d.controls.maxDistance = 80; // 30


                    devos3d.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
                    if (!userSettings.overViewView) {
                        devos3d.controls.enableZoom = true;
                    }
                    devos3d.controls.dampingFactor = 0.25;
                    devos3d.controls.screenSpacePanning = false;
                    devos3d.controls.maxPolarAngle = Math.PI / 2; //;//
                    //devos3d.controls.mouseButtons = {ORBIT: THREE.MOUSE.RIGHT, PAN: THREE.MOUSE.LEFT}; // TODO does this work?
                    console.log(devos3d.controls.target);
                    devos3d.controls.target = new THREE.Vector3(
                        devos3d.camera.position.x,
                        devos3d.camera.position.y,
                        devos3d.camera.position.z - 0.01); // */
                    console.log(devos3d.controls.target);
                    console.log(devos3d.camera.position);

                }
            } else {
                //console.log(devos3d.camera.position);
                //console.log(terrain.currentRelativePositionUuidOfTiles.length);
            }
            devos3d.camera.updateProjectionMatrix();

            devos3d.counterTurnCamera += 1;

            for (let i = 0, l = terrain.imagesToLookAtCamera.length; i < l; i++) {
                terrain.imagesToLookAtCamera[i].lookAt(devos3d.camera.position);
            }

            // TODO update GPS position if wanted
            if (userSettings.updateSky) { // TODO remove this
                devos3d.date = devos3d.date + 60000;
                //devos3d.sky.updateSunPosition(devos3d.date); // TODO einblenden
            }

            if (userSettings.showOpenStreetMaps) {

                for (let i = 0; i < terrain.currentRelativePositionUuidOfTiles.length; i++) {
                    //console.log(terrain.terrainTiles);
                    let currentTile = terrain.terrainTiles[terrain.currentRelativePositionUuidOfTiles[i]];
                    //console.log(currentTile);
                    if (currentTile.osmDataNotAdded
                        && currentTile.osmDataOnTile !== null && currentTile.osmDataOnTile !== undefined
                        && currentTile.osmDataOnTile.fc !== null && currentTile.osmDataOnTile.fc !== undefined) {
                        //console.log(currentTile.osmDataOnTile);
                        // TODO make asynchronous
                        // https://stackoverflow.com/questions/9121902/call-an-asynchronous-javascript-function-synchronously#9121936
                        currentTile.osmDataOnTile.showDataOnScreen();
                        //console.log(currentTile.mesh.uuid);
                        //console.log(currentTile.osmDataNotAdded);
                        currentTile.osmDataNotAdded = false;
                        //console.log(currentTile.osmDataNotAdded);
                    }
                    if (currentTile.projectDataNotAdded
                        && currentTile.projectDataOnTile !== null
                        && currentTile.projectDataOnTile !== undefined
                        && currentTile.projectDataOnTile.style !== null
                        && currentTile.projectDataOnTile.style !== undefined
                        && currentTile.projectDataOnTile.objects !== null
                        && currentTile.projectDataOnTile.objects !== undefined) {
                        // TODO make asynchronous
                        // https://stackoverflow.com/questions/9121902/call-an-asynchronous-javascript-function-synchronously#9121936
                        currentTile.projectDataOnTile.showDataOnScreen();
                        currentTile.projectDataNotAdded = false;
                    }
                }
            }

            let currentX = 0;
            let currentZ = 0;

            if (!userSettings.overViewView) {
                if (devos3d.displayFromRendererTimes < 0) {
                    console.log(devos3d.camera.position.y);
                    console.log("devos3d.camera.position.y");
                    console.log(terrain.heightMap);
                    console.log(terrain.terrainAdded);
                    console.log("terrain.currentCentralTileMesh.uuid");
                    console.log(terrain.currentCentralTileMesh.uuid);
                    console.log(terrain.planeSize / 2);
                }
                devos3d.terrainloadcycle = devos3d.terrainloadcycle + 1;

                if (terrain.currentCentralTileMesh !== null &&
                    terrain.currentCentralTileMesh.material !== undefined &&
                    terrain.terrainAdded !== null &&
                    terrain.terrainAdded !== undefined &&
                    terrain.terrainTiles !== null && terrain.terrainTiles !== undefined &&
                    terrain.terrainTiles[terrain.currentCentralTileMesh.uuid] !== null &&
                    terrain.terrainTiles[terrain.currentCentralTileMesh.uuid] !== undefined) {
                    currentX = Math.round(devos3d.camera.position.x - parseFloat(terrain.centralPosition[0])); // TODO check if -1 is correct //  - parseFloat(terrain.planeSize / 2.0)
                    currentZ = Math.round(devos3d.camera.position.z - parseFloat(terrain.centralPosition[2])); // not sure if everything is correct //  - parseFloat(terrain.planeSize / 2.0)
                    if (false) {
                        console.log("-------------------");
                        console.log("update the tiles");
                        console.log(terrain.planeSize);
                        console.log(currentX);
                        console.log(currentZ);
                        console.log(terrain.centralPosition);
                        console.log(devos3d.camera.position);
                        console.log("-------------------");
                    }
                    if (terrain.terrainAdded) {

                        ////////////////////////////////////////// Loading new tiles /////////////////////////////////////
                        if (true || devos3d.displayFromRendererTimes < 100000) { // TODO change this to !userSettings.overViewView and check if it still works
                            console.log(terrain.addingNewTerritory);
                            console.log(terrain.allLoaded);
                            if (terrain.addingNewTerritory) {
                                console.log(userSettings.loadFurtherTiles && (currentX < 0 || currentX >= terrain.planeSize || currentZ < 0 || currentZ >= terrain.planeSize));
                                console.log((currentX < 0 || currentX >= terrain.planeSize || currentZ < 0 || currentZ >= terrain.planeSize));
                                console.log(devos3d.camera.position.x + "-" + parseFloat(terrain.centralPosition[0]));
                                console.log(currentX);
                                if (userSettings.loadFurtherTiles && (currentX < 0 || currentX >= terrain.planeSize || currentZ < 0 || currentZ >= terrain.planeSize)) {
                                    if (false) {
                                        console.log("-------------------");
                                        console.log("update the tiles");
                                        console.log(terrain.planeSize);
                                        console.log(currentX);
                                        console.log(currentZ);
                                        console.log(terrain.centralPosition);
                                        console.log(devos3d.camera.position);
                                        console.log("-------------------");
                                    }
                                    if (currentX < 0 && currentX >= -terrain.planeSize) {
                                        //if (currentX < -terrain.planeSize / 2) {
                                        terrain.addingNewTerritory = false;
                                        console.log("Direction-x");
                                        terrain.terrainReCentralization("Direction-x");
                                    } else if (currentX >= terrain.planeSize && currentX <= terrain.planeSize * 2) {
                                        // } else if (currentX > terrain.planeSize / 2) {
                                        terrain.addingNewTerritory = false;
                                        console.log("Direction+x");
                                        terrain.terrainReCentralization("Direction+x");
                                    } else if (currentZ < 0 && currentZ >= -terrain.planeSize) {
                                        //} else if (currentZ < -terrain.planeSize / 2) {
                                        terrain.addingNewTerritory = false;
                                        console.log("Direction-z");
                                        terrain.terrainReCentralization("Direction-z");
                                    } else if (currentZ >= terrain.planeSize && currentZ <= terrain.planeSize * 2) {
                                        //} else if (currentZ > terrain.planeSize / 2) {
                                        terrain.addingNewTerritory = false;
                                        console.log("Direction+z");
                                        terrain.terrainReCentralization("Direction+z");
                                    } else {
                                        //console.log("everthings good");
                                    }
                                }
                            }
                        }

                        ///////////////////////////////////////////////////////////////////////////////////////////////

                        if (devos3d.displayFromRendererTimes < 0) {
                            devos3d.displayFromRendererTimes = devos3d.displayFromRendererTimes + 1;
                        }

                        //TODO change if possition is not the central one; TODO correct offset
                        currentX = currentX > 0 ? currentX : 0;
                        currentX = currentX < devos3d.worldWidth - 1 ? currentX : devos3d.worldWidth - 1;
                        currentZ = currentZ > 0 ? currentZ : 0;
                        currentZ = currentZ < devos3d.worldDepth - 1 ? currentZ : devos3d.worldDepth - 1;

                        if (terrain.currentCentralTileMesh !== null) {
                            if (!userSettings.overViewView) {
                                if (userSettings.terrainIn3D) {
                                    devos3d.camera.position.y = terrain.getHeightOfPointXX(terrain.currentCentralTileMesh.uuid, currentX + devos3d.worldDepth * currentZ) + 0.1;
                                } else {
                                    devos3d.camera.position.y = 170;
                                }
                                devos3d.controls.target.y = devos3d.camera.position.y;
                            }
                        }
                    } else {
                        console.log("fuckfuck");
                    }
                }
            }
            devos3d.displayFromRendererTimes++;
            devos3d.renderer.render(devos3d.scene, devos3d.camera);
            // devos3d.labelRenderer.render(devos3d.scene, devos3d.camera);
            //console.log(devos3d.objectsInScene[0]);
            //document.getElementById('bottom').innerHTML = "MetaData Of Object: " + devos3d.camera.position.x + "; " + devos3d.camera.position.y + "; " + devos3d.camera.position.z;
        },

        updateCurrentGPSLocation: function () {
            console.log("GEO: updateCurrentGPSLocation");
            // source: https://stackoverflow.com/questions/2577305/get-gps-location-from-the-web-browser#2581053
            if (userSettings.useRealGPS) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(devos3d.showGeoPosition, devos3d.showGeolocationError);
                } else {
                    console.error("Geolocation is not supported by this browser.");
                    devos3d.setToDefaultPosition();
                    terrain.loadTerrain();
                }
            } else {
                devos3d.setToDefaultPosition();
                terrain.loadTerrain();
            }
        },

        setToDefaultPosition: function () {
            console.log("GEO: setToDefaultPosition");
            devos3d.currentUserLocation = {
                longitude: devos3d.coordinatesExampleRegion[0],
                latitude: devos3d.coordinatesExampleRegion[1]//,
                // accuricy???
            };
        },

        // TODO auf if else umbauen
        showGeolocationError: function (error) {
            console.log("GEO: showGeolocationError");
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    console.error("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    console.error("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    console.error("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    console.error("An unknown error occurred.");
                    break;
            }
            devos3d.setToDefaultPosition();
            terrain.loadTerrain();
        },

        showGeoPosition: function (position) {
            //console.log("GEO: showGeoPosition");
            //console.log(position.coords.latitude + ", " + position.coords.longitude);
            devos3d.currentUserLocation = position.coords;
            terrain.loadTerrain();
            //let x = GEBI(bottom, false);
        },

        updateC: function () {
            console.log("update Controlls");
            // delta = change in time since last call (in seconds)
            let delta = devos3d.clock.getDelta();
            //console.log(delta);
            //console.log(this.camera);
            //THREE.AnimationHandler.update(delta);
        }
    };