function Sky() {
    this.sky = null;
    this.sunSphere = null;
    this.gui = null;

    // https://en.wikipedia.org/wiki/Position_of_the_Sun
    this.effectController = {
        turbidity: 10, // Truebbheit
        rayleigh: 2, //Rayleigh-Streuung  https://en.wikipedia.org/wiki/Rayleigh_scattering
        mieCoefficient: 0.005,// https://de.wikipedia.org/wiki/Mie-Streuung
        mieDirectionalG: 0.8, // https://de.wikipedia.org/wiki/Mie-Streuung
        luminance: 1, // (Leuchtdichte)[https://en.wikipedia.org/wiki/Luminance]
        inclination: 0.49, // (Bahnneigung)[https://en.wikipedia.org/wiki/Orbital_inclination]
        azimuth: 0.25, // (Azimuth)[https://en.wikipedia.org/wiki/Azimuth]
        sun: !true
    }
}

// TODO add lense flare:  https://threejs.org/examples/?q=lens#webgl_lensflares
//TODO still something does not work correctly
Sky.prototype.initSky = function () {
    // Add Sky
    this.sky = new THREE.Sky();
    this.sky.scale.setScalar(450000);
    devos3d.scene.add(this.sky);
    // Add Sun Helper
    this.sunSphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry(20000, 16, 8),
        new THREE.MeshBasicMaterial({color: 0xffffff})
    );
    this.sunSphere.position.y = -700000;
    this.sunSphere.visible = false;
    devos3d.scene.add(this.sunSphere);
    this.guiChanged();


    /*      // Enables the chang of the values from the gui
            Sky.gui = new dat.GUI();
            Sky.gui.add(Sky.effectController, "turbidity", 1.0, 20.0, 0.1).onChange(this.guiChanged);
            Sky.gui.add(Sky.effectController, "rayleigh", 0.0, 4, 0.001).onChange(this.guiChanged);
            Sky.gui.add(Sky.effectController, "mieCoefficient", 0.0, 0.1, 0.001).onChange(this.guiChanged);
            Sky.gui.add(Sky.effectController, "mieDirectionalG", 0.0, 1, 0.001).onChange(this.guiChanged);
            Sky.gui.add(Sky.effectController, "luminance", 0.0, 2).onChange(this.guiChanged);
            Sky.gui.add(Sky.effectController, "inclination", 0, 1, 0.0001).onChange(this.guiChanged);
            Sky.gui.add(Sky.effectController, "azimuth", 0, 1, 0.0001).onChange(this.guiChanged);
            Sky.gui.add(Sky.effectController, "sun").onChange(this.guiChanged);
            Sky.guiChanged(); // */

};


Sky.prototype.guiChanged = function () {

    let distance = 400000;

    let uniforms = this.sky.material.uniforms;
    uniforms.turbidity.value = this.effectController.turbidity;
    uniforms.rayleigh.value = this.effectController.rayleigh;
    uniforms.luminance.value = this.effectController.luminance;
    uniforms.mieCoefficient.value = this.effectController.mieCoefficient;
    uniforms.mieDirectionalG.value = this.effectController.mieDirectionalG;
    let theta = Math.PI * (this.effectController.inclination - 0.5);
    let phi = 2 * Math.PI * (this.effectController.azimuth - 0.5);
    this.sunSphere.position.x = distance * Math.cos(phi);
    this.sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta);
    this.sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta);
    this.sunSphere.visible = this.effectController.sun;
    uniforms.sunPosition.value.copy(this.sunSphere.position);
};

// source: https://github.com/mourner/suncalc
// d: time of the postion; datatype: Date
Sky.prototype.updateSunPosition = function (d) {
    console.log("Function: updateSunPosition");
    if (devos3d.currentUserLocation !== null && devos3d.currentUserLocation !== undefined && this.sunSphere !== null) {

        let timeAndDate = d;
        let latitude = devos3d.currentUserLocation.latitude;
        let longitude = devos3d.currentUserLocation.longitude;
        let pos = SunCalc.getPosition(/*Date*/ timeAndDate, /*Number*/ latitude, /*Number*/ longitude);
        //console.log(pos);// altitude: 0.867365918047405, azimuth: 0.5825334262096754
        // TODO implement this
        let normalizationFactorAzimuth = 4 / Math.PI / 3; // reciprocal
        //this.effectController.azimuth = pos.azimuth * normalizationFactorAzimuth; // TODO einkomm
        let normalizationFactorAltitude = 2 / Math.PI; // reciprocal
        //this.effectController.inclination = pos.altitude * normalizationFactorAltitude;// TODO einkomm
        this.guiChanged();
        // TODO change slider too if necessary
    }
};
