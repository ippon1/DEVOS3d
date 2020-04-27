let terrain = {

    ////////////////////////////////////////

    //Todo Maps in eine Variable zusammenfassen
    rgbMap: [], // rgb values
    terrainAdded: false,
    planeSize: 256,
    heightMultiplicationFactor: 1,//0.3,

    ////////////////////////////////////////// Loading new tiles /////////////////////////////////////
    currentCentralTileMesh: null, // Contains mesh, which is currently the tile on which the camera is positioned (preferable the central tile) // TODO store only uuid here // TODO maybe could be replaced by 4th of array
    centralPosition: null,// just stores x and z value //[41472, 12800], // TODO remove/change this (is used for checking for loading new file)
    streetMap: null,
    terrainTiles: [], // stores terrainTiles on position of uuid  // TODO was renamed from userData_geometryMetas// stores metaData on position of uuid
    currentRelativePositionUuidOfTiles: [], // Contains the list of uuids of the plane meshes in the correct order
    everythingLoaded: false, // TODO should be removed if possible
    addingNewTerritory: true,
    imagesToLookAtCamera: [],
    //enableLoadingNew: [],

    //////////////////////////////////////////////////////////////////////////////////////////////////

    mapURL: "./dgm.tif.vrt", // TODO move file

    //material2: null,
    //material3: null,

    // 1
    loadTerrain: function () {
        //console.log("loadTerrain");
        //console.log(devos3d.camera);
        //terrain.centralPosition = [devos3d.camera.position.x, devos3d.camera.position.y, devos3d.camera.position.z];
        // TODO change to -1
        dgm.loadVrtFromURL(terrain.mapURL, 0, -1); // TODO THIS LINE
    },

    // updated texture: 4.1
    // 4.9
    loadContent: function (orientation, uuid, updatedPosition) {
        //console.log("loadContent");
        //console.log(userSettings.showDummyData);
        //console.log(userSettings.showUserPosition);
        //console.log(devos3d.currentUserLocation);
        let randomPositionOnCentralTile = sceneObjects.transformCoordinatesToMap(devos3d.currentUserLocation.latitude, devos3d.currentUserLocation.longitude);
        if (terrain.centralPosition === null) {
            terrain.centralPosition = [parseInt(randomPositionOnCentralTile[0] / terrain.planeSize) * terrain.planeSize, 0, parseInt(randomPositionOnCentralTile[1] / terrain.planeSize) * terrain.planeSize];

        }
        /*
        console.log(randomPositionOnCentralTile);
        console.log(devos3d.cameraPosition);
        console.log(terrain.centralPosition);
        // */

        devos3d.cameraPosition = [randomPositionOnCentralTile[0], devos3d.cameraPosition[1], randomPositionOnCentralTile[1]];

        //console.log(devos3d.cameraPosition);
        //console.log("loadContent");
        if (orientation === 0) {
            dgm.loadTile(devos3d.cameraPosition, orientation, uuid);
        } else {
            dgm.loadTile(updatedPosition, orientation, uuid);
        }
        // TODO load
    },

    // 5
    //createMesh:function(...args) {
    createMesh: function (relativePosition, heightMap) {
        //console.log("___________________________________________________________________________________");
        let terrainTile = new TerrainTile(relativePosition, heightMap);
        //console.log(terrainTile);
        terrainTile.calcPrimaryWorldCoordinatesFromRelativePosition();
        terrain.showMeshInWorld(terrainTile, relativePosition);
    },

    // updated texture: 7
    // 6
    showMeshInWorld: function (terrainTile, relativePosition) {
        //console.log(terrainTile);
        //console.log(relativePosition);
        //console.log(terrain.currentRelativePositionUuidOfTiles);
        //console.log(relativePosition);
        let uuid = terrainTile.init();
        //console.log(uuid);
        terrain.terrainTiles[uuid] = terrainTile;
        terrain.currentRelativePositionUuidOfTiles[relativePosition] = uuid;
        //console.log(terrainTile.relativePosition);

        if ((userSettings.totalNumberOfTerrainLoadedPerAxis * userSettings.totalNumberOfTerrainLoadedPerAxis - 1) / 2 === terrainTile.relativePosition) {
            //console.log(terrainTile.relativePosition);

            //console.log(terrainTile);
            //console.log(terrainTile.mesh);

            terrain.currentCentralTileMesh = terrainTile.mesh;
            //console.log(terrain.currentCentralTileMesh);
            //[DEPRECATED] devos3d.camera.position.x = terrain.currentCentralTileMesh.position.x;
            //[DEPRECATED] devos3d.camera.position.y = 300;
            //[DEPRECATED] devos3d.camera.position.z = terrain.currentCentralTileMesh.position.z;
            if (terrain.currentCentralTileMesh.position.x !== terrain.centralPosition[0] || terrain.currentCentralTileMesh.position.z !== terrain.centralPosition[2]) {
                console.error("SOMETHING WENT WRONG"); // TODO check how to fix this
                console.error(terrain.currentCentralTileMesh.position);
                console.error(terrain.centralPosition);
                terrain.centralPosition = [terrain.currentCentralTileMesh.position.x, terrain.currentCentralTileMesh.position.y, terrain.currentCentralTileMesh.position.z];
            }
            console.log(terrain.centralPosition);

            if (userSettings.showUserPosition && userSettings.showUserPosition) {
                devos3d.userPositionObject = new UserPosition();
                //console.log(devos3d.userPositionObject);
                devos3d.userPositionObject.load(); // TODO in den render cycle hinzufügen
                //console.log(devos3d.userPositionObject);

            }
            if (userSettings.showDummyData) {
                sceneObjects.dummy();// TODO in den render cycle hinzufügen
            }
            if (userSettings.showProjectData) { // TODO in den render cycle hinzufügen
                // TODO implement here
            }
            //sceneObjects.addPoint({  x: terrain.centralPosition[0], y: terrain.getHeightOfPoint([terrain.centralPosition[0], terrain.centralPosition[2]]), z: terrain.centralPosition[2]}, {"x": 0, "y": 0, "z": 0}, {"diameter": 5}, new THREE.MeshBasicMaterial({color: 0x0000ff}), "");
        }
        console.log("_______________________________________END____________________________________________");
    },

    allLoaded: null,
    // updated texture: 1
    // Changes the current tile as the central one.
    // type: tells in which direction new tiles should be added
    terrainReCentralization: function (type) {
        console.log("---------------Beginning---------------------------------");

        terrain.allLoaded = [];
        // TODO indices variables machen ();
        if (type === "Direction-x") {
            terrain.currentCentralTileMesh = terrain.terrainTiles[terrain.currentRelativePositionUuidOfTiles[1]].mesh;
            document.getElementById('bottom').innerHTML = "UUID of Current Tile" + terrain.currentCentralTileMesh.uuid;
            let randomPositionOnCentralTile = [
                terrain.currentCentralTileMesh.position.x,
                terrain.currentCentralTileMesh.position.y,
                terrain.currentCentralTileMesh.position.z];// TODO remove if possible
            terrain.centralPosition = [
                parseInt(randomPositionOnCentralTile[0] / terrain.planeSize) * terrain.planeSize,
                terrain.currentCentralTileMesh.position.y,
                parseInt(randomPositionOnCentralTile[2] / terrain.planeSize) * terrain.planeSize];
            // terrain.currentTiles[terrain.currentRelativePositionUuidOfTiles[1]].material.color.setHex(0x00ff00);
            // terrain.changePosOfTheTiles(type); // TODO do not know what the problem is
            terrain.currentRelativePositionUuidOfTiles = [
                terrain.currentRelativePositionUuidOfTiles[6], terrain.currentRelativePositionUuidOfTiles[7], terrain.currentRelativePositionUuidOfTiles[8],
                terrain.currentRelativePositionUuidOfTiles[0], terrain.currentRelativePositionUuidOfTiles[1], terrain.currentRelativePositionUuidOfTiles[2],
                terrain.currentRelativePositionUuidOfTiles[3], terrain.currentRelativePositionUuidOfTiles[4], terrain.currentRelativePositionUuidOfTiles[5]];
            terrain.updateMetaDataPos();
            for (let i = 0; i < 3; i++) {
                // TODO load empty plane here and reposition all and the texture is loaded later
                //console.log(terrain.currentRelativePositionUuidOfTiles[i]);
                //console.log([-terrain.planeSize * 3, 0, 0]);
                terrain.changeTileInScene(terrain.currentRelativePositionUuidOfTiles[i], [-terrain.planeSize * 3, 0, 0]);
            }
        } else if (type === "Direction+x") {
            terrain.currentCentralTileMesh = terrain.terrainTiles[terrain.currentRelativePositionUuidOfTiles[7]].mesh;
            let randomPositionOnCentralTile = [
                terrain.currentCentralTileMesh.position.x,
                terrain.currentCentralTileMesh.position.y,
                terrain.currentCentralTileMesh.position.z];// TODO remove if possible
            terrain.centralPosition = [
                parseInt(randomPositionOnCentralTile[0] / terrain.planeSize) * terrain.planeSize,
                terrain.currentCentralTileMesh.position.y,
                parseInt(randomPositionOnCentralTile[2] / terrain.planeSize) * terrain.planeSize];
            terrain.currentRelativePositionUuidOfTiles = [
                terrain.currentRelativePositionUuidOfTiles[3], terrain.currentRelativePositionUuidOfTiles[4], terrain.currentRelativePositionUuidOfTiles[5],
                terrain.currentRelativePositionUuidOfTiles[6], terrain.currentRelativePositionUuidOfTiles[7], terrain.currentRelativePositionUuidOfTiles[8],
                terrain.currentRelativePositionUuidOfTiles[0], terrain.currentRelativePositionUuidOfTiles[1], terrain.currentRelativePositionUuidOfTiles[2]];
            terrain.updateMetaDataPos();
            for (let i = 6; i < 9; i++) {
                // TODO load empty plane here and reposition all and the texture is loaded later
                //console.log(terrain.currentRelativePositionUuidOfTiles[i]);
                terrain.changeTileInScene(terrain.currentRelativePositionUuidOfTiles[i], [terrain.planeSize * 3, 0, 0]);
            }
        } else if (type === "Direction-z") {
            terrain.currentCentralTileMesh = terrain.terrainTiles[terrain.currentRelativePositionUuidOfTiles[3]].mesh;
            let randomPositionOnCentralTile = [
                terrain.currentCentralTileMesh.position.x,
                terrain.currentCentralTileMesh.position.y,
                terrain.currentCentralTileMesh.position.z];// TODO remove if possible
            terrain.centralPosition = [
                parseInt(randomPositionOnCentralTile[0] / terrain.planeSize) * terrain.planeSize,
                terrain.currentCentralTileMesh.position.y,
                parseInt(randomPositionOnCentralTile[2] / terrain.planeSize) * terrain.planeSize];
            sceneObjects.addPoint({
                    "x": terrain.centralPosition[0],
                    "y": terrain.getHeightOfPoint([terrain.centralPosition[0], terrain.centralPosition[2]]),
                    "z": terrain.centralPosition[2]
                },
                {"x": 0, "y": 0, "z": 0}, {"diameter": 5}, new THREE.MeshBasicMaterial({color: 0x0000ff}), "");


            terrain.currentRelativePositionUuidOfTiles = [
                terrain.currentRelativePositionUuidOfTiles[2], terrain.currentRelativePositionUuidOfTiles[0], terrain.currentRelativePositionUuidOfTiles[1],
                terrain.currentRelativePositionUuidOfTiles[5], terrain.currentRelativePositionUuidOfTiles[3], terrain.currentRelativePositionUuidOfTiles[4],
                terrain.currentRelativePositionUuidOfTiles[8], terrain.currentRelativePositionUuidOfTiles[6], terrain.currentRelativePositionUuidOfTiles[7]];
            terrain.updateMetaDataPos();
            for (let i = 0; i < 7; i = i + 3) {
                // TODO load empty plane here and reposition all and the texture is loaded later
                //console.log(terrain.currentRelativePositionUuidOfTiles[i]);
                terrain.changeTileInScene(terrain.currentRelativePositionUuidOfTiles[i], [0, 0, -terrain.planeSize * 3]);
            } //*
        } else if (type === "Direction+z") {
            terrain.currentCentralTileMesh = terrain.terrainTiles[terrain.currentRelativePositionUuidOfTiles[5]].mesh;
            let randomPositionOnCentralTile = [
                terrain.currentCentralTileMesh.position.x,
                terrain.currentCentralTileMesh.position.y,
                terrain.currentCentralTileMesh.position.z];// TODO remove if possible
            terrain.centralPosition = [
                parseInt(randomPositionOnCentralTile[0] / terrain.planeSize) * terrain.planeSize,
                terrain.currentCentralTileMesh.position.y,
                parseInt(randomPositionOnCentralTile[2] / terrain.planeSize) * terrain.planeSize];

            terrain.currentRelativePositionUuidOfTiles = [
                terrain.currentRelativePositionUuidOfTiles[1], terrain.currentRelativePositionUuidOfTiles[2], terrain.currentRelativePositionUuidOfTiles[0],
                terrain.currentRelativePositionUuidOfTiles[4], terrain.currentRelativePositionUuidOfTiles[5], terrain.currentRelativePositionUuidOfTiles[3],
                terrain.currentRelativePositionUuidOfTiles[7], terrain.currentRelativePositionUuidOfTiles[8], terrain.currentRelativePositionUuidOfTiles[6]];
            terrain.updateMetaDataPos();
            for (let i = 2; i < 9; i = i + 3) {
                // TODO load empty plane here and reposition all and the texture is loaded later
                //console.log(terrain.currentRelativePositionUuidOfTiles[i]);
                terrain.changeTileInScene(terrain.currentRelativePositionUuidOfTiles[i], [0, 0, terrain.planeSize * 3]);
            }
        }
    },

    changePosOfTheTiles: function (type) {
        /*terrain.currentRelativePositionUuidOfTiles = [
            terrain.currentRelativePositionUuidOfTiles[6], terrain.currentRelativePositionUuidOfTiles[7], terrain.currentRelativePositionUuidOfTiles[8],
            terrain.currentRelativePositionUuidOfTiles[0], terrain.currentRelativePositionUuidOfTiles[1], terrain.currentRelativePositionUuidOfTiles[2],
            terrain.currentRelativePositionUuidOfTiles[3], terrain.currentRelativePositionUuidOfTiles[4], terrain.currentRelativePositionUuidOfTiles[5]]; */
        let newOrderedUUIDs = null;
        if (type === "Direction-x") {
            newOrderedUUIDs = terrain.currentRelativePositionUuidOfTiles.slice(userSettings.totalNumberOfTerrainLoadedPerAxis, userSettings.totalNumberOfTerrainLoadedPerAxis * userSettings.totalNumberOfTerrainLoadedPerAxis);
            for (let i = 0; i < userSettings.totalNumberOfTerrainLoadedPerAxis; i++) {
                newOrderedUUIDs.push(terrain.currentRelativePositionUuidOfTiles[i]);
            }
        }
    },

    // Source: https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another#5306832
    array_move: function (arr, old_index, new_index) {
        while (old_index < 0) {
            old_index += arr.length;
        }
        while (new_index < 0) {
            new_index += arr.length;
        }
        if (new_index >= arr.length) {
            let k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr; // for testing purposes
    },

    /**
     * updates corrects the relativePosition information in terrain.terrainTiles objects
     */
    updateMetaDataPos: function () {
        //console.log(terrain.terrainTiles);
        for (let i = 0; i < 9; i++) {
            //console.log(terrain.terrainTiles[terrain.currentRelativePositionUuidOfTiles[i]].relativePosition);
            terrain.terrainTiles[terrain.currentRelativePositionUuidOfTiles[i]].relativePosition = i;
        }
    },

    // updated texture: 2
    // newPosition: value by which the tile has to move
    changeTileInScene: function (uuid, newPositionChange) {
        //console.log("changeTileInScene");
        //console.log(uuid);
        devos3d.scene.remove(terrain.terrainTiles[uuid].mesh);
        let tileToBeChanged = terrain.terrainTiles[uuid].mesh;
        //console.log(tileToBeChanged);
        if (tileToBeChanged !== null) { // TODO delete this line
            //var updatedPosition = [tileToBeChanged.position.x + newPositionChange[0] +   parseInt(terrain.planeSize / 2), tileToBeChanged.position.y + newPositionChange[1], tileToBeChanged.position.z + newPositionChange[2] +  parseInt(terrain.planeSize / 2)];
            let updatedPosition = [tileToBeChanged.position.x + newPositionChange[0], tileToBeChanged.position.y + newPositionChange[1], tileToBeChanged.position.z + newPositionChange[2]];

            if (updatedPosition[0] >= 0 && updatedPosition[1] >= 0 && updatedPosition[2] >= 0) {
                tileToBeChanged.position.set(updatedPosition[0], updatedPosition[1], updatedPosition[2]);
                terrain.terrainTiles[uuid].tilePos = updatedPosition;
                //console.log(" " + tileToBeChanged.position.x + "; " + tileToBeChanged.position.y + "; " + tileToBeChanged.position.z + "; ");

                terrain.sendUpdateTextureRequest(uuid, updatedPosition);
                //terrain.addingNewTerritory = terrain.sendUpdateTextureRequest(uuid, updatedPosition);
                //console.log(terrain.addingNewTerritory);
            }
        }
    },

    terrain: 0,

    // updated texture: 3
    sendUpdateTextureRequest: function (uuid, updatedPosition) {
        console.log("sendUpdateTextureRequest");
        if (updatedPosition[0] >= 0 && updatedPosition[1] >= 0 && updatedPosition[2] >= 0) {
            /* console.log(updatedPosition);  // */

            dgm.loadVrtFromURL(terrain.mapURL, 1, uuid, updatedPosition); // TODO could be 2 too // and the other way around

            terrain.counter = terrain.counter++;
        }
    },


    // updated texture: 6
    // heightMap: new Height map to be put on the terrain
    // oldUuid: uuid of mesh which should be changed
    updateTexture: function (heightMap, oldUuid) { // TODO maybe replace oldUuid with relativePosition // TODO must be renamed
        //  console.log("updateTexture");
        if (terrain.terrainTiles[oldUuid] === null && terrain.terrainTiles[oldUuid] === undefined) {
            console.error("terrain.currentTiles[uuid] is null");
        } else {
            // TODO delete the old tile
            // TODO just create the new Tile
            /*/let worldPosition = terrain.terrainTiles[oldUuid].mesh.position;
            console.log(terrain.terrainTiles);
            console.log(terrain.terrainTiles.length);
            for (let a in terrain.terrainTiles) {
                console.log(terrain.terrainTiles[a]);
                console.log(a + " " + terrain.terrainTiles[a].relativePosition);
            } //*/
            //console.log(oldUuid);
            //console.log(terrain.terrainTiles);
            //console.log(terrain.terrainTiles[oldUuid]); // */
            let newRelativePosition = terrain.terrainTiles[oldUuid].relativePosition;
            let terrainTile = new TerrainTile(newRelativePosition, heightMap);
            terrainTile.tilePos = terrain.terrainTiles[oldUuid].tilePos;
            terrain.showMeshInWorld(terrainTile, newRelativePosition);
            terrain.terrainTiles[oldUuid].removeContentFromObject();
            terrain.terrainTiles[oldUuid] = null; //delete old data
            terrain.allLoaded.push(true);
            terrain.addingNewTerritory = (terrain.allLoaded.length === userSettings.totalNumberOfTerrainLoadedPerAxis);
        }
    },


    // returns: Returns the index of the tile te position is on
    // positionObject: array [x,z] containing the position of the
    // TODO make more general not just for 3x3
    // TODO x und z berechnung auf eine Zeile zusammenfassen
    getRelativePositionOfTileFromPosition: function (positionObject) {
        let firstMapX = positionObject[0] - (terrain.currentCentralTileMesh.position.x); //  + terrain.planeSize / 2
        let firstMapZ = positionObject[1] - (terrain.currentCentralTileMesh.position.z);

        let x = 0;
        let z = 0;
        let relativeIndex = 0;

        if (firstMapX < -terrain.planeSize * 3 / 2) { // >= ??
            console.error("x-Position value too small: " + firstMapX);
            relativeIndex = -1;
            x = -1;
            return [-1, -1];
        } else if ((firstMapX < -terrain.planeSize / 2)) { // >= ??
            relativeIndex += 0;
            x = firstMapX + terrain.planeSize * 3 / 2;
        } else if (firstMapX < terrain.planeSize / 2) {
            relativeIndex += (userSettings.totalNumberOfTerrainLoadedPerAxis);
            x = firstMapX + terrain.planeSize / 2;
        } else if (firstMapX < terrain.planeSize * 3 / 2) {
            relativeIndex += (2 * userSettings.totalNumberOfTerrainLoadedPerAxis);
            x = firstMapX - terrain.planeSize / 2;
        } else {
            console.error(" x-Position value too big: " + firstMapX);
            //console.error(positionObject[0]);
            //console.error(terrain.currentCentralTileMesh.position);
            relativeIndex = -1;
            x = -1;
            return [-1, -1];
        }
        if (relativeIndex >= 0) {
            if (firstMapZ < -terrain.planeSize * 3 / 2) { // >= ??
                console.error("Position not valid: 2 (" + positionObject[0] + ", " + positionObject[1] + ")");
                relativeIndex = -1;
                z = -1;
                return [-1, -1];
            } else if (firstMapZ < -terrain.planeSize / 2) { // >= ??
                relativeIndex += 0;
                z = firstMapZ + terrain.planeSize * 3 / 2;
            } else if (firstMapZ < terrain.planeSize / 2) {
                relativeIndex += 1;
                z = firstMapZ + terrain.planeSize / 2;
            } else if (firstMapZ < terrain.planeSize * 3 / 2) {
                relativeIndex += 2;
                z = firstMapZ - terrain.planeSize / 2;
            } else {
                console.error("Position not valid: 3");
                relativeIndex = -1;
                z = -1;
                return [-1, -1];
            }
        } else {
            z = -1;
            return [-1, -1];
        }
        //console.log(parseInt(x) + ", " +  parseInt(z));
        //console.log(relativeIndex);
        return [parseInt(x) + terrain.planeSize * parseInt(z), relativeIndex];
    },

    // positionOfObject: coordinates which are displayed
    // TODO something still does not work correctly
    getHeightOfPoint: function (positionOfObject) {
        let correctPos = terrain.getRelativePositionOfTileFromPosition(positionOfObject);
        let positionOnTile = correctPos[0];
        let uuid = terrain.currentRelativePositionUuidOfTiles[correctPos[1]];

        if (uuid === null || uuid === undefined || correctPos[0] < 0 || correctPos[1] < 0) {
            //console.error("UUID does not exist. Returns with height 0.");
            return null;
        } else {
            return terrain.getHeightOfPointXX(uuid, positionOnTile);
        }
    },

    getHeightOfPointXX: function (uuidOfTile, positionOnTile) { // TODO rename this
        //terrain.currentTiles[uuidOfTile].material = terrain.material3;
        //console.log(positionOnTile);
        //return terrain.heightMultiplicationFactor * terrain.userData_geometryMetas[uuidOfTile].heightMap[positionOnTile];
        if (false && terrain.terrainTiles[uuidOfTile].heightMap[positionOnTile] === 103) {
            console.log("uuidOfTile");
            console.log(uuidOfTile);
            console.log(positionOnTile);
            console.log(terrain.currentRelativePositionUuidOfTiles);
        }
        return terrain.heightMultiplicationFactor * terrain.terrainTiles[uuidOfTile].heightMap[positionOnTile];
    }
};


