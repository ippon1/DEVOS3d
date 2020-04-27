let gui = {
    resize: function (event) {
        console.log("resize");
        this.refreshViewport();
        devos3d.renderer.setViewport(0, 0, devos3d.viewport.width, devos3d.viewport.height);
        devos3d.camera.aspect = devos3d.viewport.width / devos3d.viewport.height;
        devos3d.camera.updateProjectionMatrix();
    },

    refreshViewport: function () {
        console.log("refreshViewport");
        let div = GEBI("threeDiv");
        let width = getSize(div).width;
        let height = getSize(div).height;
        let container = devos3d.container; // todo edit here
        let canvas = container.firstElementChild; // todo edit here
        SA(canvas, "width", width);
        SA(canvas, "height", height);
        terrain.viewport = {"width": width, "height": height};
    },

    onWindowResize: function (dir) {
        console.log("direction: " + dir);
        devos3d.camera.aspect = window.innerWidth / window.innerHeight;
        devos3d.camera.updateProjectionMatrix();
        devos3d.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    fullScreen: function (event) {
        console.log("fullScreen");
        let state = GA(event.currentTarget, "state") === "true";
        SA(event.currentTarget, "state", !state);
        toggleFullscreenMode(!state);
    },
    mobileControl: function () {
        //TODO edit here
    },

    settings: function () {
        let params = {
            overViewView: userSettings.overViewView,
            terrainIn3D: userSettings.terrainIn3D,
            useCameraSensorsForOrientation: userSettings.useCameraSensorsForOrientation,
            totalNumberOfTerrainLoadedPerAxis: userSettings.totalNumberOfTerrainLoadedPerAxis,

            showOpenStreetMaps: userSettings.showOpenStreetMaps,
            showProjectData: userSettings.showProjectData,
            showDummyData: userSettings.showDummyData,

            currentTime: 0,
            buildingsAsOneCube: true,
            building: true,
            highway: true,
            railway: true,
            waterway: true
        };
        // https://workshop.chromeexperiments.com/examples/gui/#3--Folders
        let gui = new dat.GUI();
        gui.add(params, 'overViewView').onChange(function (value) {
            userSettings.overViewView = value;
        });
        gui.add(params, 'terrainIn3D').onChange(function (value) {
            userSettings.terrainIn3D = value;
        });
        gui.add(params, 'useCameraSensorsForOrientation').onChange(function (value) {
            userSettings.useCameraSensorsForOrientation = value;
        });
        gui.add(params, 'totalNumberOfTerrainLoadedPerAxis', 0, 9).min(1).step(2);
        if (false) {
            gui.add(params, 'showOpenStreetMaps').onChange(function (value) {
                userSettings.showOpenStreetMaps = value; // TODO implement this
            });
            gui.add(params, 'showProjectData').onChange(function (value) {
                userSettings.showProjectData = value; // TODO implement this
            });
            gui.add(params, 'showDummyData').onChange(function (value) {
                userSettings.showDummyData = value; // TODO implement this
            });
        }
        gui.add(params, 'buildingsAsOneCube'); // TODO implement this
        gui.add(params, 'currentTime', 0, 23).step(1).onChange(function (value) {
            let d = new Date(devos3d.date);
            console.log("Current Date: ");

            console.log("Current Date: " + d);
            console.log("Current Date: ");
            d.setHours(value, 0, 0, 0);
            devos3d.date = Date.parse(d);
            console.log("Current Date: ");

            console.log("Current Date: " + d);
            console.log("Current Date: ");
            Sky.updateSunPosition((d));
        }); // works
        if (userSettings.showOpenStreetMaps) {
            gui.add(params, 'building').onChange(function (value) { // works
                if (value) {
                    // building = ["building"];
                    openStreetMapImporter.addObjectCathegory('building');
                } else {
                    // building = [];
                    openStreetMapImporter.removeObjectCathegory('building');
                }
            });
            gui.add(params, 'highway').onChange(function (value) { // works
                if (value) {
                    // building = ["highway"];
                    openStreetMapImporter.addObjectCathegory('highway');
                } else {
                    // building = [];
                    openStreetMapImporter.removeObjectCathegory('highway');
                }
            });
            gui.add(params, 'railway').onChange(function (value) { // works
                if (value) {
                    // building = ["railway"];
                    openStreetMapImporter.addObjectCathegory('railway');
                } else {
                    // building = [];
                    openStreetMapImporter.removeObjectCathegory('railway');
                }
            });
            gui.add(params, 'waterway').onChange(function (value) { // works
                if (value) {
                    // building = ["waterway"];
                    openStreetMapImporter.addObjectCathegory('waterway');
                } else {
                    // building = [];
                    openStreetMapImporter.removeObjectCathegory('waterway');
                }
            });
        }
        gui.open();
    },

    _raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),

    colorUpdated: false,
    oldColor: null,
    oMObject: null,
    // source: DragControls.js
    // source: https://stackoverflow.com/questions/34831626/three-js-raycaster-is-offset-when-scollt-the-page
    // mouse listener
    onDocumentMouseDown: function (event) {
        console.log("onDocumentMouseDown");

        event.preventDefault();

        let rect = devos3d.renderer.domElement.getBoundingClientRect();

        gui.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        gui.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        gui._raycaster.setFromCamera(gui.mouse, devos3d.camera);

        //console.log("devos3d.objectsInScene");
        //console.log(devos3d.objectsInScene);

        let intersects = gui._raycaster.intersectObjects(devos3d.objectsInScene);

        if (intersects.length > 0) {
            let selected = intersects[0].object;
            console.log("intersect");
            //console.log(selected);
            document.getElementById('bottom').innerHTML = "MetaData Of Object: " + selected.userData;
            gui.emphasizeMesh(selected);
            console.log(selected);
        } else {
            console.log("no intersection");
            gui.resetEmphasizeMesh();
        }
    },

    emphasizeMesh: function(selected){
        gui.resetEmphasizeMesh();
        if (gui.oMObject === null || gui.oMObject.uuid !== selected.material.uuid) {
            // TODO make something that is usefull
            // console.log(selected.material.color);
            gui.oldColor = new THREE.Color(selected.material.color.r, selected.material.color.g, selected.material.color.b);
            gui.oMObject = selected.material;

            selected.material.color.offsetHSL(.0, 0.0, -0.4);
            gui.colorUpdated = true;
        }
    },

    resetEmphasizeMesh: function () {
        if (gui.colorUpdated && gui.oldColor !== null && gui.oMObject !== null) {
            gui.colorUpdated = false;
            console.log(gui.oMObject);
            console.log(gui.oldColor);
            gui.oMObject.color = gui.oldColor;
            console.log(gui.oldColor);
            console.log(gui.oMObject);
            gui.oMObject = null;
        }
    },

    onMouseMove: function (e) {
        if (!document.pointerLockElement) return;

        let moveX = e.originalEvent.movementX ||
            e.originalEvent.mozMovementX ||
            e.originalEvent.webkitMovementX ||
            0,
            moveY = e.originalEvent.movementY ||
                e.originalEvent.mozMovementY ||
                e.originalEvent.webkitMovementY ||
                0;

        //Update the mouse movement for coming frames
        this.mouseMovementX = moveX;
        this.mouseMovementY = moveY;
    },
};