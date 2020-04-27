//TODO in object umbauen
let railway = {
    addRailwayToScene: function (feature, uuid) {
        // TODO seperate treatment for weir
        // console.log("feature");
        // console.log(feature);
        let coordinatesInGPS = feature.geometry.coordinates; //simplify(feature.geometry.coordinates, 0.0000001, false); //

        ///////////////////////koordinaten Umrechnen///////////////////////////////
        let coordinatesInWorldAsObject = [];
        let coordinatesInWorldCurrentArray = [];
        let currentHeight = 0;
        for (let i = 0; i < coordinatesInGPS.length; i++) {
            coordinatesInWorldCurrentArray = sceneObjects.transformCoordinatesToMap(coordinatesInGPS[i][1], coordinatesInGPS[i][0]);
            currentHeight = terrain.getHeightOfPoint(coordinatesInWorldCurrentArray);
            if (currentHeight > 0) {
                coordinatesInWorldAsObject.push({
                    x: coordinatesInWorldCurrentArray[0],
                    y: currentHeight+0.1,
                    z: coordinatesInWorldCurrentArray[1]
                });
            }
        }
        let coordinatesInWorldSimply = coordinatesInWorldAsObject; //simplify(coordinatesInWorldAsObject, 0.01, false); //
        let material = new THREE.MeshBasicMaterial({color: 0x4C4C4C});

        let tags = feature.properties.tags;
        let metaData = this.metaDataToString(tags);
        let offset = []; // TODO auf zwei paralelle ersetzen
        let meshes = null;
        //console.log(coordinatesInWorldSimply);
        //console.log(material);
        //console.log(metaData);
        if (coordinatesInWorldSimply.length > 1) {
            let meshType = 'railway';
            meshes = sceneObjects.generateParallelLinesFromVerticesAndAddToScene(coordinatesInWorldSimply, material, 0.1, metaData, meshType, uuid);
        }
        //console.log(mesh);
        return meshes;
    },

    // tags: tags of the building
    // TODO make this more dynamic
    // --> https://stackoverflow.com/questions/6307514/is-it-possible-to-override-javascripts-tostring-function-to-provide-meaningfu
    // --> https://stackoverflow.com/questions/9329446/for-each-over-an-array-in-javascript
    metaDataToString: function (tags) {
        let metaData = "Railway: ";
        if (tags["name"] !== null && tags["name"] !== undefined) {
            metaData += " " + tags["name"];
        }
        if (tags["usage"] !== null && tags["usage"] !== undefined) {
            metaData += " " + tags["usage"];
        }
        if (tags["electrified"] !== null && tags["electrified"] !== undefined) {
            metaData += " " + tags["electrified"];
        }
        if (tags["gauge"] !== null && tags["gauge"] !== undefined) {
            metaData += " " + tags["gauge"];
        }
        if (tags["historic"] !== null && tags["historic"] !== undefined) {
            metaData += " " + tags["historic"];
        }
        if (tags["layer"] !== null && tags["layer"] !== undefined) {
            metaData += " " + tags["layer"];
        }
        if (tags["layer"] !== null && tags["layer"] !== undefined) {
            metaData += " " + tags["layer"];
        }
        if (tags["bridge"] !== null && tags["layer"] !== undefined) {
            metaData += " " + tags["layer"];
        }
        if (tags["service"] !== null && tags["service"] !== undefined) {
            metaData += " " + tags["service"];
        }
        return metaData;
    }
};
