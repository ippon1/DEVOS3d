function UserPosition() {
    this.mesh = null;
}

// https://github.com/codecruzer/webgl-shader-loader-js
// https://stackoverflow.com/questions/15099868/problems-loading-shaders-from-external-file-in-threejs
UserPosition.prototype.load = function () {
    console.log("load current location");
    let vertexShader = document.getElementById('userLocationVertex').textContent;
    let fragmentShader = document.getElementById('userLocationFrag').textContent;

    let uniforms = {
        time: {value: 1.0}
    };

    let material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms,
        side: THREE.BackSide
    });
    console.log("userMat");
    console.log(material);
    console.log(devos3d.currentUserLocation);
    console.log(dgm.vrtJson);

    if (devos3d.currentUserLocation !== null) {
        if (dgm.vrtJson !== null && dgm.vrtJson !== undefined) {
            //console.log("position einzeichnen");
            let position = sceneObjects.transformCoordinatesToMap(devos3d.currentUserLocation.latitude, devos3d.currentUserLocation.longitude);
            let options = {"diameter": 0.1};
            let style = {"color": new THREE.Color(0xff0000), "strokeOpacity": 1, 'shininess': 10000};
            let materialSphere = new THREE.MeshBasicMaterial({
                color: style.color
            });
            materialSphere.color = style.color;
            console.log("position");
            console.log(position);
            let currentPosition = {
                x: position[0],
                y: terrain.getHeightOfPoint(position),
                z: position[1]
            };
            console.log("currentPosition.y");
            console.log(currentPosition.y);
            console.log("currentPosition.y");

            console.log("userLocationMaterial");
            console.log(material);
            let rotation = {"x": 0, "y": 0, "z": 0};
            let metaData = "Current User Location";
            this.mesh = sceneObjects.addPoint(currentPosition, rotation, options, material, metaData);
            this.mesh.receiveShadow = true;
            this.mesh.castShadow = true;
            //console.log(this.mesh);
        }
    }
};

// old name: updateTheCurrentGPSLocationPosition
UserPosition.prototype.updatePosition = function () {
    if (devos3d.currentUserLocation !== null) { // TODO why first part
        if (sceneObjects.vrtJson !== null && sceneObjects.vrtJson !== undefined) {

            let position = sceneObjects.transformCoordinatesToMap(devos3d.currentUserLocation.latitude, devos3d.currentUserLocation.longitude);
            let currentPosition = {
                "x": position[0],
                "y": terrain.getHeightOfPoint(position),
                "z": position[1]
            };
            console.log("currentPosition.y");
            console.log(currentPosition.y);
            this.mesh.position = currentPosition;
        }
    }
};

/**
 * Displays mesh on the screen representing the current location
 * @param showPosition if true it is dsiplayed if false it is not displayed
 */
UserPosition.prototype.showUserPosition = function (showPosition) {
    if (showPosition) {
        if (!devos3d.scene.contains(this.mesh)) {
            devos3d.scene.add(this.mesh);
        }
    } else {
        devos3d.scene.remove(this.mesh);
    }
};