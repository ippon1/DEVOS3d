//
let streets = {
    addWayToScene: function (feature, uuid) {
        // TODO seperate treatment for weir
        // console.log("feature");
        //console.log(feature);
        //console.log(uuid);
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
                    y: currentHeight,
                    z: coordinatesInWorldCurrentArray[1]
                });
            }
        }
        let coordinatesInWorldSimply = coordinatesInWorldAsObject; //simplify(coordinatesInWorldAsObject, 0.01, false); //
        let material = new THREE.MeshBasicMaterial({color: 0xc1c1c1});

        let tags = feature.properties.tags;
        let metaData = this.metaDataToString(tags);
        let mesh = null;
        if (coordinatesInWorldSimply.length > 1) {
            let meshType = 'street';
            mesh = sceneObjects.addLineToScene(coordinatesInWorldSimply, material, metaData, meshType, uuid);
        }
        return mesh;
    },

    // tags: tags of the building
    // TODO make this more dynamic
    // --> https://stackoverflow.com/questions/6307514/is-it-possible-to-override-javascripts-tostring-function-to-provide-meaningfu
    // --> https://stackoverflow.com/questions/9329446/for-each-over-an-array-in-javascript
    metaDataToString: function (tags) {
        let metaData = "street: ";
        if (tags["name"] !== null && tags["name"] !== undefined) {
            metaData += " " + tags["name"];
        }
        if (tags["highway"] !== null && tags["highway"] !== undefined) {
            metaData += " " + tags["highway"];
        }
        if (tags["maxspeed:type"] !== null && tags["maxspeed:type"] !== undefined) {
            metaData += " " + tags["maxspeed:type"];
        }
        if (tags["maxspeed"] !== null && tags["maxspeed"] !== undefined) {
            metaData += " " + tags["maxspeed"];
        }
        return metaData;
    }
};
