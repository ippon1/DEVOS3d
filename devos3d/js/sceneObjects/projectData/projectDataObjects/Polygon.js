function Polygon(dbObj, style, material, parent) {
    //this.type = dbObj.type;
    // this.attribute = null;
    //this.attributeSet = null;

    /* for (let i = 0; i < data.attachments.length; i++) {
        this.attachments.push(data.attachments[i]);
    } //TODO can man das vereinfachen */
    this.imageHandler = new ImageHandler();

    this.parent = parent;
    /////////////////////////given Data/////////////////////////////
    this.dbObj = dbObj;
    this.style = style;

    this.attachments = dbObj.attachments;
    this.data = dbObj.data;
    this.geoidCorrected = dbObj.geoidCorrected;
    this.height = dbObj.height;
    this.gpsCoordinates = {lon: dbObj.lon, lat: dbObj.lat};
    this.otherCoordinates = {x: dbObj.x, y: dbObj.y, z: dbObj.y}; // TODO ask how to us this correctly
    this.optionalDataArray = dbObj.optionalDataArray; // contains metadata
    this.type = dbObj.type;
    this.color = dbObj.color; // string
    this.key = dbObj.key;
    this.group = dbObj.group;
    /////////////////////////////////////////////////////////////// */
    this.material = material;

    this.mesh = null;
    //this.color = data.color;
}

Polygon.prototype.displayMesh = function () {
    console.log("displayMesh (Polygon)");

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
        let meshType = 'cable';
        this.mesh = sceneObjects.addLineToScene(coordinatesInWorldSimply, material, metaData, meshType, -1); // TODO uuid is not correct
        console.log(this.mesh);
    }
};

Polygon.prototype.metaDataToString = function () {
    let metaData = "LINE: " + this.otherCoordinates[0] + ", " + this.otherCoordinates[1];
    if (this.currentGroupInfo !== null && this.currentGroupInfo !== undefined) {
        metaData += metaData + " " + this.currentGroupInfo.Name;
    }
    return metaData;
};