function LineO(data) {
    //console.log(data);
    //console.log(data.attachments);
    this.gpsCoordinates = {lon: data.lon, lat: data.lat};
    this.otherCoordinates = {x: data.x, y: data.y, z: data.z}; // TODO was sind diese Koordinaten=?
    this.height = data.height;
    this.geoidCorrected = data.geoidCorrected;
    this.key = data.key;
    this.group = data.group;
    this.type = data.type;
    this.optionalData = data.optionalDataArray; // TODO doesnt get filled
    this.mesh = null;
    // this.attribute = null;
    this.parentObject = null;
    this.attributeSet = null;

    this.attachments = [];
    for (let i = 0; i < data.attachments.length; i++) {
        this.attachments.push(data.attachments[i]);
    } //TODO can man das vereinfachen
    this.imageHandler = new ImageHandler();


    //this.currentGroupInfo = // TODO not used ???
}


Line.prototype.displayMesh = function (parentObject) {
    if (this.attachments === null || this.attachments.length < 1) {
        return;
    }

    this.parentObject = parentObject;
    //console.log(this.gpsCoordinates);
    if (this.gpsCoordinates !== null
        && this.gpsCoordinates.lon !== null && this.gpsCoordinates.lon !== undefined
        && this.gpsCoordinates.lat !== null && this.gpsCoordinates.lat !== undefined) {
        //console.log(this.gpsCoordinates[1] + ", " + this.gpsCoordinates[0]);
        //TODO: correct these two positions:
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
        if (this.attachments !== null) {
            //has image stored
            for (let i = 0; i < this.attachments.length; i++) {
                let xDistance = coordinatesInWorldAsObject[1].x - coordinatesInWorldAsObject[0].x;
                let zDistance = coordinatesInWorldAsObject[1].z - coordinatesInWorldAsObject[0].z;
                let imageWidth = Math.sqrt(xDistance * xDistance + zDistance * zDistance);
                console.log(this.attachments[i]);
                console.log(this.attachments[i].value);
                console.log(this.attachments[i].value);
                this.imageHandler.showImage(this.attachments[i].value, imageWidth, this.attachments[i].description);
            }
        }
        let coordinatesInWorldSimply = coordinatesInWorldAsObject; //simplify(coordinatesInWorldAsObject, 0.01, false); //
        //console.log(firstPos[1] + ", " + firstPos[0]);
        let options = {"diameter": 1};
        let rotate = {"x": 0, "y": 0, "z": 0};
        let material = this.createMaterial();
        //let material = new THREE.MeshBasicMaterial({color: 0x888888, wireframe: true});
        //console.log(firstPos);
        //console.log(firstPos);
        //console.log(firstPosMap);
        let metaData = this.metaDataToString(); // TODO edit here

        this.mesh = sceneObjects.addLineToScene(coordinatesInWorldSimply, material, metaData, 0); // TODO uuid is not correct
        //console.log(this.mesh);
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

    if (Point.defaultAtributes === null && this.parentObject.defaultStyles !== null) { // calls for default values only once
        let x = this.parentObject.defaultStyles;
        this.attributeSet = x.filter(obj => obj.id === 'Punkte')[0]; // TODO should be changed to english
        //console.log(attributeSet);
        if (this.attributeSet !== null && this.attributeSet !== undefined) {
            if (this.color !== null && this.color !== undefined) {
                color = this.color;
                //} else if (this.currentGroupInfo !== null && this.currentGroupInfo !== undefined &&
                //            this.currentGroupInfo.Farbe !== null && this.currentGroupInfo.Farbe !== undefined) {
                //    console.log(this.currentGroupInfo);
                //    color = sceneObjects.convertColorFromStringToThreeOject(this.currentGroupInfo.Farbe);
            } else {
                color = sceneObjects.convertColorFromStringToThreeOject(this.attributeSet.attributes.strokeColor);// TODO

            }
            strokeLinecap = this.attributeSet.attributes.strokeLinecap;
            strokeDashstyle = this.attributeSet.attributes.strokeDashstyle;
            stroke = this.attributeSet.attributes.stroke;
            pointRadius = this.attributeSet.attributes.pointRadius;
            labelSelect = this.attributeSet.attributes.labelSelect;
            fill = this.attributeSet.attributes.fill;
        } else {
            console.log(attributeSet);
        }
    }
    return new THREE.MeshBasicMaterial({color: color, wireframe: true}); //
};

Line.prototype.metaDataToString = function () {
    let metaData =
        {
            text: "LINe: " + this.otherCoordinates[0] + ", " + this.otherCoordinates[1],
            object: this.attributeSet
        };
    if (this.currentGroupInfo !== null && this.currentGroupInfo !== undefined) {
        metaData.text += metaData.text + " " + this.currentGroupInfo.Name;
    }
    return metaData;
};