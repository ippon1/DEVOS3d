function ImageHandler() {
    this.folderUrl = "./data/images/";
    this.image = null;
    this.mesh = null;
    //this.rotationY = null;

}

/**
 *
 * @param fileName
 * @param cIWAO (coordinatesInWorldAsObject) cIWAO.len === 2
 */
ImageHandler.prototype.showImage = function (fileName, cIWAO, description) {
    //console.log("showImage: " + fileName);
    let xdif = Math.abs(cIWAO[1].x - cIWAO[0].x);
    let xCenter = (cIWAO[0].x < cIWAO[1].x ? cIWAO[0].x : cIWAO[1].x) + xdif / 2;
    let zdif = Math.abs(cIWAO[1].z - cIWAO[0].z);
    let zCenter = (cIWAO[0].z < cIWAO[1].z ? cIWAO[0].z : cIWAO[1].z) + zdif / 2;

    let orientation = null;

    let width = Math.sqrt(xdif * xdif + zdif * zdif);
    let image = new Image();
    image.onload = function () {
        EXIF.getData(image, function () {
            let exifDataObj = this.exifdata;
            if (exifDataObj !== null && exifDataObj !== undefined && !isEmptyObject(exifDataObj)) {
                // console.log(exifDataObj);
                ImageHandler.addPlaneToLookAtCameraWithMetaData(exifDataObj, width, image, cIWAO, xdif, zdif, xCenter, zCenter);
            } else {
                ImageHandler.addPlane(width, image, cIWAO, xdif, zdif, xCenter, zCenter);
            }
        });
    };
    image.src = this.folderUrl + fileName;
    this.image = image;
    /*
    let positionOnMap = sceneObjects.transformCoordinatesToMap(lat, long);
    this.image = new Image();
    this.image.src = this.folderUrl + fileName;
    let texture = new THREE.Texture();
    texture.image = this.image;
    let self = this;
    this.image.onload = function () {
        console.log(self.image);
        texture.needsUpdate = true;
        let geometryWidth = 10;
        let geometryHeight = self.image.height / self.image.width * geometryWidth;
        let material = new THREE.MeshLambertMaterial({map: texture});
        let options = {width: geometryWidth, height: geometryHeight};
        let position = {x: positionOnMap[0], y: terrain.getHeightOfPoint(positionOnMap) + geometryHeight/2, z: positionOnMap[1]}; // TODO must be changed
        let metaData = "metaData Plane"; // TODO change this
        self.addPlaneToLookAtCamera(position, options, material, metaData);
    };
    // */
};
ImageHandler.addPlane = function(width, image, cIWAO, xdif, zdif, xCenter, zCenter, description) {
    let positionOnMap = [xCenter, zCenter];
    let texture = new THREE.Texture();
    texture.image = image;
    let geometryWidth = width; // TODO remove 1000
    let geometryHeight = image.height / image.width * geometryWidth;
    let material = new THREE.MeshLambertMaterial({map: texture});
    let rotateY = sceneObjects.getOrientationOfWall([cIWAO[0].x, cIWAO[0].z], [cIWAO[1].x, cIWAO[1].z]);
    let options = {
        width: geometryWidth,
        height: geometryHeight,
        rotate: new THREE.Vector3(0, rotateY + Math.PI / 2, 0)
    };
    let position = {
        x: positionOnMap[0],
        y: terrain.getHeightOfPoint(positionOnMap) + options.height / 2, //,
        z: positionOnMap[1]
    }; // TODO must be changed
    //console.log(position);
    let metaData = "Description: " + description; // TODO change this
    texture.needsUpdate = true;

    this.mesh = sceneObjects.addPlane(position, options, material, metaData);


    // TODO delete this
    //sceneObjects.addPoint({ x: this.mesh.position.x, y: this.mesh.position.y, z: this.mesh.position.z }, {x: 0, y: 0, z: 0}, {diameter: 0.1}, new THREE.MeshBasicMaterial({color: 0x0000ff}), "");


};




ImageHandler.addPlaneToLookAtCameraWithMetaData = function (exifDataObj, width, image, cIWAO, xdif, zdif, xCenter, zCenter, description) {


    // ImageHandler.prototype.addPlaneToLookAtCamera = function (exifDataObj) {
    // TODO if there are two images in one line how to handle this
    let showLogging = false;
    if (showLogging) {
        console.log("exifDataObj");
        console.log(width);
        console.log(image);
        console.log(exifDataObj);
    }
    //TODO coordinaten umrechnen
    // DD = d + (min/60) + (sec/3600)
    // GPSLatitude
    let lon = 0; //13; // TODO replace this
    let lat = 0; // 47.8;
    // TODO use exifDataObj.GPSLatitudeRef and exifDataObj.GPSLongitudeRef
    if (exifDataObj.GPSLongitude !== null && exifDataObj.GPSLongitude !== undefined) {
        lon = exifDataObj.GPSLongitude[0] + exifDataObj.GPSLongitude[1] / 60 + exifDataObj.GPSLongitude[2] / 3600;
        // console.log(lon);
    }
    if (exifDataObj.GPSLatitude !== null && exifDataObj.GPSLatitude !== undefined) {
        lat = exifDataObj.GPSLatitude[0] + exifDataObj.GPSLatitude[1] / 60 + exifDataObj.GPSLatitude[2] / 3600;
        // console.log(lat);

    }
    // Position where photo was taken
    // let positionOnMap = sceneObjects.transformCoordinatesToMap(lat, lon);
    // let h = positionOnMap + dgm.vrtJson.height;



    let positionOnMap = [xCenter, zCenter];

    // TODO nicht auf lichtquelle reagieren
    let texture = new THREE.Texture();
    texture.image = image;
    let geometryWidth = width;
    let geometryHeight = image.height / image.width * geometryWidth;
    let material = new THREE.MeshLambertMaterial({map: texture, side: THREE.DoubleSide/**/});
    let rotateY = sceneObjects.getOrientationOfWall([cIWAO[0].x, cIWAO[0].z], [cIWAO[1].x, cIWAO[1].z]);
    let options = {
        width: geometryWidth,
        height: geometryHeight,
        rotate: new THREE.Vector3(0, rotateY + Math.PI / 2, 0)
    };
    let position = {
        x: positionOnMap[0],
        y: terrain.getHeightOfPoint(positionOnMap) + geometryHeight / 2,
        z: positionOnMap[1]
    }; // TODO must be changed
    //let hn = exifDataObj.GPSAltitude.denominator;
    //let hd = exifDataObj.GPSAltitude.numerator;
    //let h = hd/hn;
    let metaData = "Description: " + description; // TODO change this

    texture.needsUpdate = true;
    //console.log(image);

    this.mesh = sceneObjects.addPlane(position, options, material, metaData)
};

