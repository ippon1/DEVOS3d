function PolygonO(data) {
    this.gpsCoordinates = {lon: data.lon, lat: data.lat};
    this.otherCoordinates = {x: data.x, y: data.y, z: data.z}; // TODO was sind diese Koordinaten=?
    this.height = data.height;
    this.geoidCorrected = data.geoidCorrected;
    this.key = data.key;
    this.group = data.group;
    this.type = data.type;
    this.optionalData = data.optionalDataArray; // TODO doesnt get filled
    this.mesh = null;
    this.parentObject = null;
}

Polygon.prototype.displayMesh = function (parentObject) {
    this.parentObject = parentObject;

    if (this.gpsCoordinates !== null
        && this.gpsCoordinates.lon !== null && this.gpsCoordinates.lon !== undefined
        && this.gpsCoordinates.lat !== null && this.gpsCoordinates.lat !== undefined
        && this.gpsCoordinates.lon.length === this.gpsCoordinates.lat.length) {
        //console.log(this.gpsCoordinates[1] + ", " + this.gpsCoordinates[0]);
        // TODOO: correct these two positions:

        let coordinatesInWorldAsObject = [];
        let coordinatesInWorldCurrentArray = [];
        let currentHeight = 0;
        for (let i = 0; i < this.gpsCoordinates.lon.length; i++) {

            coordinatesInWorldCurrentArray = sceneObjects.transformCoordinatesToMap(this.gpsCoordinates.lat[i], this.gpsCoordinates.lon[i]);
            currentHeight = terrain.getHeightOfPoint(coordinatesInWorldCurrentArray);
            if (currentHeight > 0) {
                coordinatesInWorldAsObject.push({
                    x: coordinatesInWorldCurrentArray[0],
                    y: currentHeight + 0.5,
                    z: coordinatesInWorldCurrentArray[1]
                });
            }
        }
        let coordinatesInWorldSimply = coordinatesInWorldAsObject; //simplify(coordinatesInWorldAsObject, 0.01, false); //

        //console.log(firstPos[1] + ", " + firstPos[0]);
        let options = {"diameter": 1};
        let rotate = {"x": 0, "y": 0, "z": 0};
        let metaData = this.metaDataToString(); // TODO edit here
        if (this.allGroups !== null && this.allGroups !== undefined &&
            this.group !== null && this.group !== undefined) {
            this.currentGroupInfo.push(this.allGroups.filter(obj => obj.Key === this.group)[0]);
        }
        //let material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
        let material = this.createMaterial();
        this.mesh = sceneObjects.addLineToScene(coordinatesInWorldSimply, material, metaData, 0); // TODO uuid is not correct
        console.log(this.mesh);
    }
};

Polygon.prototype.createMaterial = function () {
    let color = new THREE.Color(0, 0, 0);
    let strokeLinecap = null;
    let strokeDashstyle = null;
    let stroke = null;
    let pointRadius = null;
    let labelSelect = null;
    let fill = null;

    if (Point.defaultAtributes === null && this.parentObject.defaultStyles !== null) { // calls for default values only once
        let x = this.parentObject.defaultStyles;
        //console.log(x);
        let attributeSet = x.filter(obj => obj.id === 'Polygone')[0]; // TODO should be changed to english
        //console.log(attributeSet);
        if (attributeSet !== null && attributeSet !== undefined) {
            if (this.color !== null && this.color !== undefined) {
                color = this.color;
            } else if (this.currentGroupInfo !== null && this.currentGroupInfo !== undefined &&
                this.currentGroupInfo.Farbe !== null && this.currentGroupInfo.Farbe !== undefined) {
                console.log(this.currentGroupInfo);
                color = sceneObjects.convertColorFromStringToThreeOject(this.currentGroupInfo.Farbe);
            } else {
                color = sceneObjects.convertColorFromStringToThreeOject(attributeSet.attributes.strokeColor);// TODO

            }
            strokeLinecap = attributeSet.attributes.strokeLinecap;
            strokeDashstyle = attributeSet.attributes.strokeDashstyle;
            stroke = attributeSet.attributes.stroke;
            pointRadius = attributeSet.attributes.pointRadius;
            labelSelect = attributeSet.attributes.labelSelect;
            fill = attributeSet.attributes.fill;
        } else {
            console.log(attributeSet);
        }
    }

    return new THREE.MeshBasicMaterial({color: color, wireframe: true}); //
};

Polygon.prototype.metaDataToString = function () {
    let metaData = "LINE: " + this.otherCoordinates[0] + ", " + this.otherCoordinates[1];
    if (this.currentGroupInfo !== null && this.currentGroupInfo !== undefined) {
        metaData += metaData + " " + this.currentGroupInfo.Name;
    }
    return metaData;
};