function PointO(data, allGroups, rawOpenCloseObjArray) {

    this.gpsCoordinates = {lon: data.lon[0], lat: data.lat[0]};
    this.otherCoordinates = {x: data.x, y: data.y, z: data.y};
    this.height = data.height;
    this.geoidCorrected = data.geoidCorrected;

    this.key = data.key;
    this.group = data.group;
    this.optionalData = data.optionalDataArray;

    this.allGroups = allGroups;
    this.rawOpenCloseObjArray = rawOpenCloseObjArray;

    this.currentGroupInfo = [];
    this.type = data.type;
    this.mesh = null;
    this.color = data.color;
    this.parentObject = null;
}

Point.defaultAtributes = null;


Point.prototype.displayMesh = function (parentObject) {
    this.parentObject = parentObject;
    //console.log("Function: displayMesh");
    if (this.gpsCoordinates !== null
        && this.gpsCoordinates.lon !== null && this.gpsCoordinates.lon !== undefined
        && this.gpsCoordinates.lat !== null && this.gpsCoordinates.lat !== undefined) {
        //console.log(this.gpsCoordinates[1] + ", " + this.gpsCoordinates[0]);
        let firstPos = sceneObjects.transformCoordinatesToMap(this.gpsCoordinates.lat, this.gpsCoordinates.lon);
        //console.log(firstPos[1] + ", " + firstPos[0]);
        let options = {"diameter": 0.5}; // 0.1
        let rotate = {"x": 0, "y": 0, "z": 0};
        let metaData = this.metaDataToString(); // TODO edit here
        if (this.allGroups !== null && this.allGroups !== undefined &&
            this.group !== null && this.group !== undefined) {
            this.currentGroupInfo.push(this.allGroups.filter(obj => obj.Key === this.group)[0]);
            console.log(this.currentGroupInfo)
        }

        /*
        let currentGroups = this.currentGroupInfo[0];
        while (currentGroups !== null && currentGroups !== undefined) {
            console.log(this.allGroups);
            if (this.allGroups !== null && this.allGroups !== undefined &&
                this.group !== null && this.group !== undefined) {
                currentGroups = this.allGroups.filter(obj => obj.Key === currentGroups.Key)[0]
                this.currentGroupInfo.push(currentGroups);
                //console.log(this.currentGroupInfo)
            }
        }
        console.log(this.currentGroupInfo);
        // */

        let material = this.createMaterial();
        let position = {
            "x": firstPos[0],
            "y": terrain.getHeightOfPoint(firstPos),//this.height === null ? 125: this.height, //TODO update her
            "z": firstPos[1]
        };

        this.mesh = sceneObjects.addPoint(position, rotate, options, material, metaData); // TODO einblenden
        //console.log(this);
    }
};

Point.prototype.createMaterial = function () {
    let color = new THREE.Color(0, 0, 0);
    let strokeLinecap = null;
    let strokeDashstyle = null;
    let stroke = null;
    let pointRadius = null;
    let labelSelect = null;
    let fill = null;

    if (Point.defaultAtributes === null && this.parentObject.defaultStyles !== null) { // calls for default values only once
        let s = this.parentObject.defaultStyles;
        //console.log(x);
        let attributeSet = s.filter(obj => obj.id === 'Punkte')[0]; // TODO should be changed to english
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
            //console.log(attributeSet);
        }
    }
    return new THREE.MeshBasicMaterial({color: color, wireframe: true}); //
};

Point.prototype.metaDataToString = function () {
    let metaData =
        {
            text: "POINT: " + this.otherCoordinates[0] + ", " + this.otherCoordinates[1],
            object: this.currentGroupInfo
        };
    if (this.currentGroupInfo !== null && this.currentGroupInfo !== undefined) {
        metaData.text += metaData.text + " " + this.currentGroupInfo.Name;
    }
    return metaData;
};