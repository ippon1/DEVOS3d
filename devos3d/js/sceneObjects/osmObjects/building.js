let building = {

    // House is drawn as cube only
    //
    addBuildingToScene: function (feature) {
        //console.log("feature");
        //console.log(feature);
        let coordinates = feature.geometry.coordinates;
        let tags = feature.properties.tags;
        let buildings = [];
        for (let i = 0; i < coordinates.length; i++) {
            let currentPoint = coordinates[i];
            for (let j = 0; j < currentPoint.length - 1; j++) { // -1 weil waende -1 von anzahl der ecken//TODO einblenden
                // TODO create wall
                let worldBeginningCoordinates = sceneObjects.transformCoordinatesToMap(currentPoint[j][1], currentPoint[j][0]);
                //let worldEndCoordinates = sceneObjects.transformCoordinates(currentPoint[j + 1][1], currentPoint[j + 1][0]); // TODO wird doppelt so of berechnet wie notwendig

                // TODO orient wall correctly
                let yBegin = terrain.getHeightOfPoint(worldBeginningCoordinates);
                //let yEnd = terrain.getHeightOfPoint(worldEndCoordinates);

                //let currentLengthOfASegment = sceneObjects.getLengthOfSegment(worldBeginningCoordinates, worldEndCoordinates);
                let options = {
                    //    "length": currentLengthOfASegment,
                    "length": 1,
                    "height": 1,
                    "depth": 1
                };
                let material = new THREE.MeshBasicMaterial({
                    color: new THREE.Color(0x555555)
                });
                let position = {
                    "x": worldBeginningCoordinates[0],
                    "y": yBegin,
                    "z": worldBeginningCoordinates[1]
                };
                let rotation = {
                    "x": 0,
                    //"y": sceneObjects.getOrientationOfSegment(worldBeginningCoordinates, worldEndCoordinates),
                    "y": 0,
                    "z": 0
                };
                let metaData = this.metaDataToString(tags);
                if (yBegin > 0) {
                    buildings.push(sceneObjects.addCube(position, rotation, options, material, metaData));
                }
            }
        }
        return buildings;
    },

    // tags: tags of the building
    metaDataToString: function (tags) {
        var metaData = "";
        if (tags["name"] !== null && tags["name"] !== undefined) {
            metaData += " " + tags["name"];
        }
        if (tags["addr:street"] !== null && tags["addr:street"] !== undefined) {
            metaData += " " + tags["addr:street"];
        }
        if (tags["addr:housenumber"] !== null && tags["addr:housenumber"] !== undefined) {
            metaData += " " + tags["addr:housenumber"];
        }
        if (tags["addr:city"] !== null && tags["addr:city"] !== undefined) {
            metaData += " " + tags["addr:city"];
        }
        if (tags["addr:country"] !== null && tags["addr:country"] !== undefined) {
            metaData += " " + tags["addr:country"];
        }
        if (tags["addr:postcode"] !== null && tags["addr:postcode"] !== undefined) {
            metaData += " " + tags["addr:postcode"];
        }
        if (tags["website"] !== null && tags["website"] !== undefined) {
            metaData += " " + tags["website"];
        }
        if (metaData === "") {
            metaData = "NO META DATA"
        }
        return metaData;
    }
};
