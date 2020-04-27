function Point(dbObj, style, material, parent) {
    /////////////////////////given Data/////////////////////////////
    this.dbObj = dbObj;
    this.style = style;

    this.attachments = dbObj.attachments;
    this.data = dbObj.data;
    this.geoidCorrected = dbObj.geoidCorrected;
    this.height = dbObj.height;
    this.gpsCoordinates = {lon: dbObj.lon[0], lat: dbObj.lat[0]};
    this.otherCoordinates = {x: dbObj.x, y: dbObj.y, z: dbObj.y}; // TODO ask how to us this correctly
    this.optionalDataArray = dbObj.optionalDataArray; // contains metadata
    this.type = dbObj.type;
    this.color = dbObj.color; // string
    this.key = dbObj.key;
    this.group = dbObj.group;
    /////////////////////////////////////////////////////////////// */
    this.material = material;
    this.parent = parent;

    this.mesh = null;
    this.mastenMesh = null;
    //this.color = data.color;
}

Point.defaultAtributes = null;


Point.prototype.displayMesh = function () {
    //console.log("Function: displayMesh");
    //console.log(this);
    //console.log(this.dbObj);
    /*if (this.dbObj.optionalDataArray !== null && this.dbObj.optionalDataArray !== undefined) {
        for (let i = 0; i < this.dbObj.optionalDataArray.length; i++) {
            for (let j = 0; j < this.dbObj.optionalDataArray[i].value.length; j++) {
                console.log(this.dbObj.optionalDataArray[i].value[j].source);
            }
        }
    } // */
    //console.log(this.style);
    let offset = 0;
    let height = 0;
    if (this.gpsCoordinates !== null
        && this.gpsCoordinates.lon !== null && this.gpsCoordinates.lon !== undefined
        && this.gpsCoordinates.lat !== null && this.gpsCoordinates.lat !== undefined) {
        let firstPos = sceneObjects.transformCoordinatesToMap(this.gpsCoordinates.lat, this.gpsCoordinates.lon);
        //console.log(firstPos);
        //console.log(firstPos);
        height = this.height;
        if (height === null || height === undefined) {
            height = this.parent.defaultHeight;
        }
        offset = terrain.getHeightOfPoint(firstPos);
        let position = {
            x: firstPos[0],
            y: height + offset,//this.height === null ? 125: this.height, //TODO update her
            z: firstPos[1]
        };
        //console.log(position);
        //console.log(position);


        let options = {diameter: 0.1}; // 0.1
        let rotate = {x: 0, y: 0, z: 0};
        let metaData = this.metaDataToString(); // TODO edit here

        let self = this;
        if (this.style.display) {
            this.mesh = sceneObjects.addPoint(position, rotate, options, this.material, metaData);
            // add mast
            let showMast = this.isMast();
            if (showMast) {
                let coordinatesInWorldSimply = [{
                    x: this.mesh.position.x,
                    y: this.mesh.position.y,
                    z: this.mesh.position.z
                }, {x: this.mesh.position.x, y: offset, z: this.mesh.position.z}];
                let meshType = 'mast';
                this.mastenMesh = sceneObjects.addLineToScene(coordinatesInWorldSimply, this.material, metaData, meshType, -1); // TODO uuid is not correct
            }

            // add lighting
            // console.log(this.dbObj);
            // console.log(this.style);
            // console.log(this.style);
            let showLight = this.isLight();
            if (showLight && userSettings.showLighting && Point.addLight && userSettings.nightMode) {
                // Point.addLight = false;
                // TODO implement here
                //lighting.addSpotLight(this.mesh.position, offset/*, new THREE.Vector(0, 0, 0)*/);
                lighting.addSpotLight(this.mesh.position, offset/*, new THREE.Vector(0, 0, 0)*/);
            }
        }
    }
};

Point.addLight = true;

Point.prototype.metaDataToString = function () {
    let metaData = this.type + ": (lat: " + this.dbObj.lat[0].toFixed(2) + ", lon: " + this.dbObj.lon[0].toFixed(2) + ")";
    for (let i = 0; i < this.optionalDataArray.length /*&& i < 1*/; i++) {
        //console.log(this.optionalDataArray[i]);
        //console.log(this.optionalDataArray[i].value[0]);
        metaData += "; (" + this.optionalDataArray[i].name + ": ";
        // console.log(this.material);
        metaData += "Color: " + this.material.color.r + " " + this.material.color.g + " " + this.material.color.b;
        for (let j = 0; j < this.optionalDataArray[i].value.length; j++) {
            if (j < 0) {
                metaData += ", "
            }
            metaData += this.optionalDataArray[i].value[j].value;
        }
        metaData += ")";
    }
    return metaData;
};

Point.prototype.isMast = function () {
    let isMast = false;
    for (let i = 0; i < this.optionalDataArray.length && !isMast; i++) {
        isMast = isMast || this.optionalDataArray[i].name === "Mastnummer";
    }
    return isMast;
};

Point.LightColor = new THREE.Color("rgb(255,199,92)");
Point.prototype.isLight = function () {
    // console.log(this.material.color);
    // console.log(new THREE.Color(255/255, 199/255, 92/255));
    // console.log(new THREE.Color("rgb(255,199,92)"));
    // TODO make this better
    return Point.LightColor.r.toFixed(2) === this.material.color.r.toFixed(2)
        && Point.LightColor.g.toFixed(2) === this.material.color.g.toFixed(2)
        && Point.LightColor.b.toFixed(2) === this.material.color.b.toFixed(2);
};


// TODO implement this
Point.prototype.addLabel = function () {
    //let pointLabel = new THREE.CSS2DObject( earthDiv );
    //earthLabel.position.set( 0, EARTH_RADIUS, 0 );
    //earth.add( earthLabel );
};
