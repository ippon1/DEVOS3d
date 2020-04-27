let fixOSMObject = {
    addFixOSMObjectToScene: function (feature) {
        let coordinates = feature.geometry.coordinates;
        let props = feature.properties;
        let fixOSMObjects = [];
        for (let i = 0; i < coordinates.length; i++) { // -1 weil waende -1 von anzahl der ecken //TODO einblenden
            //for (var i = 0; i < 1; i++) {
            let currentPoint = coordinates[i];
            let worldBeginningCoordinates = sceneObjects.transformCoordinatesToMap(currentPoint[1], currentPoint[0]);

            let yBegin = terrain.getHeightOfPoint(worldBeginningCoordinates);
            //var yEnd = terrain.getHeightOfPoint(worldEndCoordinates);

            //var currentLengthOfASegment = streets.getLengthOfStreetPathPart(worldBeginningCoordinates, worldEndCoordinates);

            let options = {
                "length": 1,
                "height": 1,
                "depth": 1
            };
            let material = new THREE.MeshBasicMaterial({
                color: 0xff0000
            });
            let position = {
                "x": worldBeginningCoordinates[0],
                "y": yBegin,
                "z": worldBeginningCoordinates[1]
            };
            let rotation = {
                "x": 0,
                "y": 0,
                "z": 0
            };
            let link = '<a href="https://www.openstreetmap.org/' + feature.id + '" target="_blank">here</a>';
            let metaData = "Could not be classified: Please add the missing Informations " + link;
            fixOSMObjects.push(sceneObjects.addCube(position, rotation, options, material, metaData));
        }
        return fixOSMObjects;
    },

    // returns length of street // TODO make it possible for 2d and 3d
    // worldBeginningCoordinates: Beginning of Segment, Coordinates in Format for displaying
    // worldEndCoordinates: End of Segment, Coordinates in Format for displaying
    // coordinates must have same dimension
    getLengthOfWallPathPart: function (worldBeginningCoordinates, worldEndCoordinates) {
        console.log(worldBeginningCoordinates);
        console.log(worldEndCoordinates);
        let length = 0;
        let cl = 0; // currentLength
        for (var i = 0; i < worldBeginningCoordinates.length; i++) {
            cl = (worldEndCoordinates[i] - worldBeginningCoordinates[i]);
            length += cl * cl;
        }
        console.log("length: " + length);
        return Math.sqrt(length);
    },

    // returns angle of street compared to the axis // just in 2D
    // worldBeginningCoordinates: Beginning of Segment, Coordinates in Format for displaying
    // worldEndCoordinates: End of Segment, Coordinates in Format for displaying
    // coordinates must have same dimension
    // https://stackoverflow.com/questions/19729831/angle-between-3-points-in-3d-space#19730129
    // https://stackoverflow.com/questions/15994194/how-to-convert-x-y-coordinates-to-an-angle
    getOrientationOfWall: function (worldBeginningCoordinates, worldEndCoordinates) {
        let deltaX = worldEndCoordinates[0] - worldBeginningCoordinates[0];
        let deltaY = worldEndCoordinates[1] - worldBeginningCoordinates[1];
        let rad = Math.atan2(deltaX, deltaY); // In radians
        return rad;
    }
};