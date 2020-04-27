// https://stackoverflow.com/questions/11638883/thickness-of-lines-using-three-linebasicmaterial
let waterway = {
    addWaterwayToScene: function (feature, uuid) {
        // TODO seperate treatment for weir
        // console.log("feature");
        // console.log(feature);
        let coordinatesInGPS = feature.geometry.coordinates; //simplify(feature.geometry.coordinates, 0.0000001, false); //

        ///////////////////////koordinaten Umrechnen///////////////////////////////
        let coordinatesInWorldAsObject = [];
        let coordinatesInWorldCurrentArray = [];
        let currentHeight = 0;
        for (let i = 0, len = coordinatesInGPS.length; i < len; i++) {
            coordinatesInWorldCurrentArray = sceneObjects.transformCoordinatesToMap(coordinatesInGPS[i][1], coordinatesInGPS[i][0]);
            currentHeight = terrain.getHeightOfPoint(coordinatesInWorldCurrentArray);
            if (currentHeight > 0) {
                coordinatesInWorldAsObject.push({
                    x: coordinatesInWorldCurrentArray[0],
                    y: currentHeight + 0.1,
                    z: coordinatesInWorldCurrentArray[1]
                });
            }
        }

        let coordinatesInWorldSimply = coordinatesInWorldAsObject; //simplify(coordinatesInWorldAsObject, 0.01, false); //
        let material = null;
        let tags = feature.properties.tags;

        let metaData = "" + coordinatesInWorldCurrentArray[0] + ", " + coordinatesInWorldCurrentArray[1];//this.metaDataToString(tags);

        if (coordinatesInWorldCurrentArray[0] >= 41344 || coordinatesInWorldCurrentArray[1] >= 12672) {
            material = new THREE.MeshBasicMaterial({color: 0x0000ff});
        } else {
            material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        }
        let mesh = null;
        let meshType = 'waterway';
        if (coordinatesInWorldSimply.length > 1) {
            mesh = sceneObjects.addLineToScene(coordinatesInWorldSimply, material, metaData, meshType, uuid);
        }
        return mesh;
    },

    // tags: tags of the building
    // [DOES NOT MAKE SENSE; IF HARD CODED BETTER CONTROL] sources for making this more dynamic
    // --> https://stackoverflow.com/questions/6307514/is-it-possible-to-override-javascripts-tostring-function-to-provide-meaningfu
    // --> https://stackoverflow.com/questions/9329446/for-each-over-an-array-in-javascript
    metaDataToString: function (tags) {
        let metaData = "waterway: ";
        if (tags["name"] !== null && tags["name"] !== undefined) {
            metaData += " " + tags["name"];
        }
        if (tags["waterway"] !== null && tags["waterway"] !== undefined) {
            metaData += " " + tags["waterway"];
        }
        return metaData;
    }
};
