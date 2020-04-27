function ProjectObjects(dataset) {
    this.originalDataset = dataset;
    // TODO dataset should be checked here as well
    // TODO replace this.key by this.dataset.key
    this.dataSetId = dataset.dataSetId;
    this.dbObj = dataset.dbObj;
    this.key = dataset.key;
    this.objType = dataset.objType;
    this.style = dataset.style;
    this.subLayers = dataset.subLayers;
    this.userName = dataset.userName; // creator?
    this.sceneObject = null;

    this.defaultHeight = 1;
}

ProjectObjects.prototype.displayMesh = function () {
    // console.log("displayMesh");
    // console.log(this);

    let self = this;
    if (this.dbObj.height !== null && this.dbObj.height !== undefined) {
        //console.log(this.dbObj.height);
    } else {
        //console.error(this.dbObj.height);
    }
    if (this.dbObj === null || this.dbObj === undefined || this.dbObj.type === null || this.dbObj.type === undefined) {
        //console.error("something is null");
    } else if (this.dbObj.type === "point") {
        //console.log(this.dbObj);
        //console.log(this.style);
        this.sceneObject = new Point(this.dbObj, this.style, this.createMaterial(), self);
    } else if (this.dbObj.type === "line") {
        //console.log(this.dbObj.type);
        this.sceneObject = new Line(this.dbObj, this.style, this.createMaterial(), self);
        //console.log(this.sceneObject);
    } else if (this.dbObj.type === "polygon") {
        //console.log(this.dbObj.type);
        this.sceneObject = new Line(this.dbObj, this.style, this.createMaterial(), self);
    } else {
        //console.log(this.dbObj.type);
    }
    if (this.sceneObject !== null) {
        this.sceneObject.displayMesh();
    }
};

ProjectObjects.prototype.createMaterial = function () {
    // console.log("createMaterial");
    let material = new THREE.MeshBasicMaterial(); // TODO kann es up
    if (this.style !== null) {
        //console.log(this.style);


        if (this.style.strokeColor !== null && this.style.strokeColor !== undefined) {
            //material.color = this.convertColorFromStringToThreeObject();
            material.color = new THREE.Color(this.style.strokeColor);
            //material.color = new THREE.Color(255, 0, 0);
            //console.log(material.color);

        }
        if ((material.color === null || material.color === undefined)
            && this.style.fillColor !== null
            && this.style.fillColor !== undefined) {
            material.color = new THREE.Color(this.style.fillColor);
            //material.color = this.convertColorFromStringToThreeObject(this.style.fillColor);
        }
        if (this.style.fillOpacity !== null && this.style.fillOpacity !== undefined && this.style.fillOpacity < 1) {
            let o = this.style.fillOpacity > 0 ? this.style.fillOpacity : 0;
            material.opacity = o;
            material.transparent = true;
            // TODO check correct loading order so it possible to ses shapes behind them
        }
        // stroke style// TODO implement this.style.stoke
        // TODO https://jsfiddle.net/ebeit303/grr308Lx/115/
        // https://threejs.org/docs/#api/en/geometries/EdgesGeometry

        material.needsUpdate = true;
    }
    return material;

};

// this Method is not needed
ProjectObjects.prototype.convertColorFromStringToThreeObject = function (colorName) {
    // console.log("colorName: " + colorName);
    let res = colorName.substring(4, colorName.length - 1);
    let color = res.split(',');
    let colorVector;

    if (color !== null && color !== undefined && color.length > 2 && isInt(color[0]) && isInt(color[1]) && isInt(color[2])) {
        // console.log(color);
        // console.log(parseInt(color[0]) + ", " + parseInt(color[1]) + ", " + parseInt(color[2]));
        // color in RGB format
        colorVector = new THREE.Color(parseInt(color[0]), parseInt(color[1]), parseInt(color[2]));
    } else {
        // color in hex format
        colorVector = new THREE.Color(colorName);
    }

    if (true || colorVector === null || colorVector === undefined) {
        colorVector = new THREE.Color(0, 0, 0);//TODO might be better if it returns null in this case.
    }
    //console.log(colorVector);
    return colorVector;
};

