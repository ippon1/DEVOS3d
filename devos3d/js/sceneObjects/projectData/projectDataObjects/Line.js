function Line(dbObj, style, material, parent) {
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

Line.prototype.displayMesh = function () {

    //console.log("displayMesh (Line)");


    if (false && this.attachments !== null && this.attachments !== undefined && this.attachments.length > 0) {
        console.log(this.attachments[0].value);
        console.log(this.dbObj);
        console.log(this.style);
    }
    if (false && (this.attachments === null || this.attachments.length < 1)) {
        console.log("No attachment.");
        //return;
    }

    //console.log(this.gpsCoordinates);
    // TODO handle those with no gpsCoordinates
    if (this.gpsCoordinates !== null
        && this.gpsCoordinates.lon !== null && this.gpsCoordinates.lon !== undefined
        && this.gpsCoordinates.lat !== null && this.gpsCoordinates.lat !== undefined) {
        //console.log(this.gpsCoordinates[1] + ", " + this.gpsCoordinates[0]);
        //TODO: correct these two positions:
        let coordinatesInWorldAsObject = [];
        let currentPos = [];
        let offset = 0;
        let height = 0;
        for (let i = 0; i < this.gpsCoordinates.lon.length; i++) {
            currentPos = sceneObjects.transformCoordinatesToMap(this.gpsCoordinates.lat[i], this.gpsCoordinates.lon[i]);
            offset = terrain.getHeightOfPoint(currentPos);
            height = this.height;
            //console.log(this.height);
            height = this.height;
            if (height === null || height === undefined) {
                height = this.parent.defaultHeight;
            }

            if (offset > 0) {
                coordinatesInWorldAsObject.push({
                    x: currentPos[0],
                    y: offset + height,
                    z: currentPos[1]
                });
                //sceneObjects.addPoint({ x: currentPos[0], y: offset + 0.5, z: currentPos[1] }, {"x": 0, "y": 0, "z": 0}, {"diameter": 0.1}, new THREE.MeshBasicMaterial({color: 0x0000ff}), "");
            }
        }
        if (this.attachments !== null) {
            //has image stored
            for (let i = 0; i < this.attachments.length; i++) {
                //console.log(this.attachments[i]);
                //console.log(this.attachments[i].value);
                //console.log(this.attachments[i].value);
                this.imageHandler.showImage(this.attachments[i].value, coordinatesInWorldAsObject, this.attachments[i].description);
            }
        }
        let coordinatesInWorldSimply = coordinatesInWorldAsObject; //simplify(coordinatesInWorldAsObject, 0.01, false); //
        //console.log(firstPos[1] + ", " + firstPos[0]);
        let options = {"diameter": 0.05};
        let rotate = {"x": 0, "y": 0, "z": 0};
        //let material = this.createMaterial();
        //let material = new THREE.MeshBasicMaterial({color: 0x888888, wireframe: true});
        //console.log(firstPos);
        //console.log(firstPos);
        //console.log(firstPosMap);
        let metaData = this.metaDataToString(); // TODO edit here
        let meshType = 'cable';

        this.mesh = sceneObjects.addLineToScene(coordinatesInWorldSimply, this.material, metaData, meshType, -1); // TODO uuid is not correct
        //console.log(this);
        //console.log(this.mesh);
        /*///////////////////////////////////////////TEST///////////////////////////////////////
        for (let i = 0; i < coordinatesInWorldSimply.length; i++) {
            let currentPos = coordinatesInWorldSimply[i];
            let point =
                // TODO delete this
                sceneObjects.addPoint({
                        "x": currentPos.x,
                        "y": currentPos.y,
                        "z": currentPos.z
                    },
                    {"x": 0, "y": 0, "z": 0}, {"diameter": 0.1}, new THREE.MeshBasicMaterial({color: 0xffff00}), ""); // /
            console.log("mesh");
            //console.log(point);
            //console.log(this.mesh);
        }
        /////////////////////////////////////////////////////////////////////////////////////*/


    } else {
        console.error("Coordinates not valid");
        //console.log(this.dbObj);
        //console.log(this.style);
        //console.log(this.material);
    }
};


Line.prototype.createMaterial = function () {
    let color = new THREE.Color(0, 0, 0);
    let strokeLinecap = null;
    let strokeDashstyle = null;
    let stroke = null;
    let pointRadius = null;
    let labelSelect = null;
    let fill = null;

    return new THREE.MeshBasicMaterial({color: color/*, wireframe: true*/}); //
};

Line.prototype.metaDataToString = function () {
    let metaData = this.type + ": (lat: " + this.dbObj.lat[0].toFixed(2) + ", lon: " + this.dbObj.lon[0].toFixed(2) + ")";
    for (let i = 0; i < this.optionalDataArray.length && i < 1; i++) {
        //console.log(this.optionalDataArray[i]);
        for (let j = 0; j < this.optionalDataArray[i].value.length && i < 1; j++) {
            //console.log(this.optionalDataArray[i].value[j]);
            metaData += "; " + this.optionalDataArray[i].value[j].source;
        }
    }
    return metaData;
};