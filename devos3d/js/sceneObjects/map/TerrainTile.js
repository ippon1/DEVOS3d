function TerrainTile(relativePosition, heightMap) {

    this.relativePosition = relativePosition;
    this.heightMap = heightMap;
    // this.relativeIndexPosition = -1;
    this.texture = null;
    this.mesh = null;
    this.tilePos = null;
    this.metaData = null;
    this.osmDataOnTile = null;
    this.osmDataNotAdded = false; // TODO change to true
    this.projectDataOnTile = null;
    this.projectDataNotAdded = true; // TODO change to true

}

//TODO add delete osm objects

// 7
// mapIndex: index by lines of the tills
//init: function(...args) {
TerrainTile.prototype.init = function () {
    //console.log("this.osmDataNotAdded");
    this.osmDataNotAdded = true;
    /*if (terrain.everythingLoaded) {
        return -1;
    } // */
    /*//////////////////////////////////////CHECK IF TERRAIN AND OSM DATA ARE LAYING OVER EACH OTHER/////////////////////////////////////////////////
    let coordinates = this.calcCurrentCornerCoordinatesInGPS();
    let relativePosX = Math.floor(this.relativePosition / userSettings.totalNumberOfTerrainLoadedPerAxis);
    let relativePosZ = this.relativePosition - relativePosX * userSettings.totalNumberOfTerrainLoadedPerAxis;

    let posworld1 = [devos3d.cameraPosition[0] + (relativePosX) * terrain.planeSize - terrain.planeSize,
        devos3d.cameraPosition[2] + (relativePosZ) * terrain.planeSize - terrain.planeSize];

    let posworld2 = [posworld1[0] + terrain.planeSize,
        posworld1[1] + terrain.planeSize];

    let options = {"diameter": 5};
    let rotate = {"x": 0, "y": 0, "z": 0};
    let metaData = "PUNKT METADATA";
    let position1 = {x: posworld1[0], y: 300, z: posworld1[1]};
    let material1 = new THREE.MeshBasicMaterial({color: 0xff0000});
    let position2 = {x: posworld2[0], y: 280, z: posworld2[1]};
    let material2 = new THREE.MeshBasicMaterial({color: 0x00ff00});
    sceneObjects.addPoint(position1, rotate, options, material1, metaData);
    sceneObjects.addPoint(position2, rotate, options, material2, metaData);

    ////////////////////////////////////////////////////////////////////////////////////// */

    //----------------------------------------------------------------------------------------

    //console.log("FUNCTION: init");
    let geometry = new THREE.PlaneBufferGeometry(terrain.planeSize, terrain.planeSize, devos3d.worldWidth - 1, devos3d.worldDepth - 1); // size X-axis, size Z-axis
    geometry.rotateX(-Math.PI / 2);

    this.texture = this.createTexture(geometry, this.heightMap);
    let basicMaterial = new THREE.MeshStandardMaterial({map: this.texture});
    //let basicMaterial = new THREE.MeshStandardMaterial({color: new THREE.Color( 0xD2B48C )});

    /* ////////////////////////////SHADER BUSINESS///////////////////////////////////////////
    let terrainVertexShader = document.getElementById('terrainVertex').textContent;
    let terrainFragmentShader = document.getElementById('terrainFrag').textContent;
    let uniforms = {
        Thickness: 0.03,
        LightPosition: lighting.bulbLight.position, // Light position in eye coords.
        Ka: new THREE.Vector3(0.1,0.1,0.1), // Ambient reflectivity
        Kd: new THREE.Vector3(0.5,0.5,0.5), // Diffuse reflectivity     // TODO get value from material
        Ks: new THREE.Vector3(0.1,0.1,0.1), // Specular reflectivity    // TODO get value from material
        Shininess: 0.1, // Specular shininess factor// LIGHT            // TODO get value from material
        La: new THREE.Vector3(lighting.hemLight.intensity),
        Ld: new THREE.Vector3(lighting.bulbLight.intensity), // Light source intensity
        Ls: new THREE.Vector3(0.9,0.1,0.0)
    };
    //console.log(uniforms);
    terrain.material3 = new THREE.ShaderMaterial({
        vertexShader: terrainVertexShader,
        fragmentShader: terrainFragmentShader,
        uniforms: uniforms,
        side: THREE.FrontSide // THREE.DoubleSide
    });
    //console.log(terrain.material3);
    //---------------------------------------------------------------------------------------- // */


    let mesh = new THREE.Mesh(geometry, basicMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(this.tilePos[0], this.tilePos[1], this.tilePos[2]);
    // mesh.position.set( this.tilePos[0] - terrain.planeSize / 2, this.tilePos[1], this.tilePos[2] - terrain.planeSize / 2);

    ////////////////////////////////////////// Loading new tiles /////////////////////////////////////

    //+ LOAD FURTHER DATA
    let coordinatesInGPS = this.calcCurrentCornerCoordinatesInGPS();
    // console.log(coordinatesInGPS);
    if (userSettings.showOpenStreetMaps) { // TODO delete this
        this.osmDataOnTile = new OpenStreetMapData(coordinatesInGPS.left, coordinatesInGPS.bottom, coordinatesInGPS.right, coordinatesInGPS.top, mesh.uuid);
        this.osmDataOnTile.loadOpenDataFromApi();
    }
    this.projectDataOnTile = [];

    if (userSettings.showProjectData && this.relativePosition === 8)  {
        for (let i = 0; i < 6; i++) {
            let fileName = "objectExport_16P003_SIEZENHEIMERSTRASSE_12.95081751413844_13.057968775530309_47.79134823713011_47.83167779277767-" + i + ".json";
            let currentProjectTileInfos = new ProjectTileInfos();
            currentProjectTileInfos.importData(fileName);

            this.projectDataOnTile.push(currentProjectTileInfos);
        }
    }

    // TODO implement this
    //this.projectDataNotAdded = new ProjectData();
    //this.projectDataNotAdded.loadOpenDataFromFile();


    //projectData.loadOpenDataFromFile(); // TODO move this to a nicer location
    devos3d.scene.add(mesh); // TODO create multiple meshes https://github.com/mrdoob/three.js/blob/master/examples/webgl_lod.html
    this.mesh = mesh;
    this.mesh.castShadow = true;
    //this.mesh.receiveShadow = true;
    //console.log(this.mesh);

    terrain.terrainAdded = true;

    return this.mesh.uuid;
};

TerrainTile.prototype.calcPrimaryWorldCoordinatesFromRelativePosition = function () {
    let posX = Math.floor(this.relativePosition / userSettings.totalNumberOfTerrainLoadedPerAxis);
    let posZ = this.relativePosition - posX * userSettings.totalNumberOfTerrainLoadedPerAxis;

    // TODO this line does not work / not sure if "- terrain.planeSize / 2" this is correct / should be + i think must be tested
    let centralTilePosition = [
        Math.floor(devos3d.cameraPosition[0] / terrain.planeSize) * terrain.planeSize,
        Math.floor(devos3d.cameraPosition[2] / terrain.planeSize) * terrain.planeSize];
    this.tilePos = [centralTilePosition[0] + (posX) * terrain.planeSize - terrain.planeSize / 2, 0, centralTilePosition[1] + (posZ) * terrain.planeSize - terrain.planeSize / 2];
};

TerrainTile.prototype.createTexture = function (geometry, currentDataMap) {
    let vertices = geometry.attributes.position.array;
    geometry.computeFaceNormals();
    let texture = null;
    if (userSettings.terrainIn3D) {
        for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
            vertices[j + 1] = currentDataMap[i] * terrain.heightMultiplicationFactor;

        }
        texture = new THREE.CanvasTexture(this.generateTexture3D(currentDataMap, devos3d.worldWidth, devos3d.worldDepth));
        //TODO vielleicht in vertex und Fragment shader auslagern
    } else {
        // TODO this must be revised
        console.error("ACHTUNG ACHTUNG 2D");
        texture = new THREE.DataTexture(currentDataMap, devos3d.worldWidth, devos3d.worldDepth, THREE.RGBAFormat);
    }
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true; // not sure about this
    return texture;
};

TerrainTile.prototype.generateTexture3D = function (data, width, height) {

    let canvas, canvasScaled, context, image, imageData, vector3, sun, shade;

    vector3 = new THREE.Vector3(0, 0, 0);

    sun = new THREE.Vector3(1, 1, 1);
    sun.normalize();

    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext('2d');
    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);

    image = context.getImageData(0, 0, canvas.width, canvas.height);
    imageData = image.data;

    for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {

        vector3.x = data[j - 2] - data[j + 2];
        vector3.y = 2;
        vector3.z = data[j - width * 2] - data[j + width * 2];
        vector3.normalize();

        shade = vector3.dot(sun);

        //TODO ADDED Streets here to texture

        imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
        imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
        imageData[i + 2] = (shade * 96) * (0.5 + data[j] * 0.007);
        // TODO add randbehandlung (schwarzer streifen)
    }

    context.putImageData(image, 0, 0);

    // Scaled 4x
    canvasScaled = document.createElement('canvas');
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;

    context = canvasScaled.getContext('2d');
    context.scale(4, 4);
    context.drawImage(canvas, 0, 0);

    image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
    imageData = image.data;
    //console.log(imageData);
    for (let i = 0, l = imageData.length; i < l; i += 4) {

        let v = ~~(Math.random() * 5);

        imageData[i] += v;
        imageData[i + 1] += v;
        imageData[i + 2] += v;
    }
    context.putImageData(image, 0, 0);
    return canvasScaled;
};


/*/ updated texture: CURRENTLY NOT USED; NOT DELETE THIS
// heightMap: new Height map to be put on the terrain
// oldUuid: uuid of mesh which should be changed
TerrainTile.prototype.updateTexture = function (heightMap, oldUuid) { // TODO maybe replace oldUuid with relativePosition
    //TODO add osm here

    console.log("FUNCTION: updateTexture");
    console.log(oldUuid);
    console.log(terrain.currentRelativePositionUuidOfTiles);
    if (heightMap === null) {
        console.error("heightMap is null");
        return;
    }
    if (oldUuid === null) {
        console.error("uuid is null");
        return;
    }


    let relativePosition = this.mesh.position;
    let geometry = new THREE.PlaneBufferGeometry(terrain.planeSize, terrain.planeSize, devos3d.worldWidth - 1, devos3d.worldDepth - 1); // size X-axis, size Z-axis
    geometry.rotateX(-Math.PI / 2);

    // TODO 2d hier einbauen
    let texture = this.createTexture(geometry, heightMap, 0); //mapIndex

    let mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map: texture})); // TODO einblenden
    //var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
    //mesh.material.color = new THREE.Color("rgb(0, 255, 0)");

    let currentMetaData = {
        //relativeIndexPosition: terrain.userData_geometryMetas[oldUuid].relativeIndexPosition,
        relativeIndexPosition: relativePosition,
        heightMap: heightMap
    };
    this.metaData = currentMetaData;

    //terrain.currentTiles[mesh.uuid] = mesh;
    this.mesh = mesh;

    mesh.position.x = relativePosition.x;
    mesh.position.y = relativePosition.y;
    mesh.position.z = relativePosition.z;


    devos3d.scene.add(mesh);

    let addedOneTrue = false;
    /*
    for (let i = 0; i < userSettings.totalNumberOfTerrainLoadedPerAxis; i++) {
        if (!addedOneTrue && !terrain.enableLoadingNew[i]) {
            terrain.enableLoadingNew[i] = true;
        } else if (terrain.enableLoadingNew[i]) {
            terrain.addingNewTerritory = true;
        }
    } // /
}; // */

TerrainTile.prototype.calcCurrentCornerCoordinatesInGPS = function () {
    // TODO shouldnt x and z be swapped
    let relativePosZ = Math.floor(this.relativePosition / userSettings.totalNumberOfTerrainLoadedPerAxis);
    let relativePosX = this.relativePosition - relativePosZ * userSettings.totalNumberOfTerrainLoadedPerAxis;
    //console.log(relativePosX + ", " + relativePosZ);
    /*
    console.log("-----------------------------------------------------------------------------")
    // latitude: 47.95, longitude: 14.883333, accuracy: 100
    // 41472, 0, 12800

    let testGPS = [47.95, 14.88];
    console.log(testGPS);

    let world = sceneObjects.transformCoordinatesToMap(testGPS[0], testGPS[1]);
    //world = {x: 41472, y: 12800 }
    console.log(world);

    let testWorld = [41715, 12882];

    let gps = sceneObjects.transformCoordinatesToGPS(testWorld[0], testWorld[1]);
    console.log(gps);


    console.log("-----------------------------------------------------------------------------")
    // */

    //let x = parseInt(devos3d.cameraPosition[0] / terrain.planeSize) * terrain.planeSize;
    //let z = parseInt(devos3d.cameraPosition[2] / terrain.planeSize) * terrain.planeSize;
    //console.log(terrain.centralPosition);
    let x = parseInt(terrain.centralPosition[0] / terrain.planeSize) * terrain.planeSize;
    let z = parseInt(terrain.centralPosition[2] / terrain.planeSize) * terrain.planeSize;

    //let positionInWorldCoordinates1 = [devos3d.cameraPosition[0] + (relativePosX) * terrain.planeSize - terrain.planeSize,
    //   devos3d.cameraPosition[2] + (relativePosZ) * terrain.planeSize - terrain.planeSize];
    let positionInWorldCoordinates1 = [x + relativePosX * terrain.planeSize - terrain.planeSize, z + relativePosZ * terrain.planeSize - terrain.planeSize];

    let positionInWorldCoordinates2 = [positionInWorldCoordinates1[0] + terrain.planeSize,
        positionInWorldCoordinates1[1] + terrain.planeSize];
    //console.log(positionInWorldCoordinates1);
    //console.log(positionInWorldCoordinates2);

    let positionInGPSCoordinates1 = sceneObjects.transformCoordinatesToGPS(positionInWorldCoordinates1[0], positionInWorldCoordinates1[1]);
    let positionInGPSCoordinates2 = sceneObjects.transformCoordinatesToGPS(positionInWorldCoordinates2[0], positionInWorldCoordinates2[1]);
    //console.log(positionInGPSCoordinates1);
    //console.log(positionInGPSCoordinates2);
    let gpsCoordinates = {};
    //console.log(gpsCoordinates);
    if (positionInGPSCoordinates1[0] < positionInGPSCoordinates2[0]) {
        gpsCoordinates.bottom = positionInGPSCoordinates1[0];
        gpsCoordinates.top = positionInGPSCoordinates2[0];
    } else {
        gpsCoordinates.bottom = positionInGPSCoordinates2[0];
        gpsCoordinates.top = positionInGPSCoordinates1[0];
    }
    //console.log(gpsCoordinates);
    if (positionInGPSCoordinates1[1] < positionInGPSCoordinates2[1]) {
        gpsCoordinates.left = positionInGPSCoordinates1[1];
        gpsCoordinates.right = positionInGPSCoordinates2[1];
    } else {
        gpsCoordinates.left = positionInGPSCoordinates2[1];
        gpsCoordinates.right = positionInGPSCoordinates1[1];
    }
    //console.log(gpsCoordinates);
    return gpsCoordinates;
};

TerrainTile.prototype.removeContentFromObject = function () {
    devos3d.scene.remove(this.mesh);
    if (this.osmDataOnTile !== null) {
        this.osmDataOnTile.removeAllObjectsFromScreen();
    }
    // TODO remove projectDataOnTile from object
};

//TODO overwrite toString function
