let lighting = {
    dirLight: null,
    hemLight: null,
    bulbLight: null,
    bulbMat: null,
    addLighting: function () {
        if (devos3d.scene !== null) {
            if (userSettings.nightMode) {
                devos3d.scene.add(new THREE.AmbientLight(0x0101010));
            } else {
                devos3d.scene.add(new THREE.AmbientLight(0xffffff));
            }
        }
    },

    // TODO correct this function
    addDirectionalLight: function (position, floorHeight/*, direction*/) {
        console.log(position);
        let dirLight = new THREE.DirectionalLight(0xff00ff, 1000);
        dirLight.position.x = position.x;
        dirLight.position.y = position.y + 10;
        dirLight.position.z = position.z;
        let geometry = new THREE.SphereGeometry( 0.5, 32, 32 );
        let material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        let targetObject = new THREE.Mesh( geometry, material );
        //let targetObject = new THREE.Object3D();
        targetObject.position.x = position.x;
        targetObject.position.y = position.y;
        targetObject.position.z = position.z;
        // dirLight.target.position.set(27628.01, 110, 14460.76);
        devos3d.scene.add(targetObject);
        dirLight.target = targetObject;


        console.log(dirLight);
        dirLight.intensity = 0.1;
        dirLight.castShadow = false;

        console.log(dirLight);
        devos3d.scene.add(dirLight);


        let lightHelper = new THREE.DirectionalLightHelper(dirLight);
        devos3d.scene.add(lightHelper);

    },

    // TODO correct this function
    addSpotLight: function (position, floorY/*, direction*/) {
        var spotLight = new THREE.SpotLight(0xffffff, 100);
        spotLight.position.set(position.x, position.y, position.z);
        // spotLight.target.position.x = position.x;
        // spotLight.target.position.y = position.y - 10;
        // spotLight.target.position.z = position.z;
        spotLight.angle = 0.5;
        spotLight.penumbra = 1;
        spotLight.decay = 2;
        spotLight.distance = 200;
        spotLight.castShadow = false;
        spotLight.shadow.mapSize.width = 16;
        spotLight.shadow.mapSize.height = 16;
        spotLight.shadow.camera.near = 5;
        spotLight.shadow.camera.far = 50;

        var geometry = new THREE.SphereGeometry( 0.5, 32, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        //var targetObject = new THREE.Mesh( geometry, material );
        let targetObject = new THREE.Object3D();
        targetObject.position.x = position.x;
        targetObject.position.y = floorY;
        targetObject.position.z = position.z;
        devos3d.scene.add(targetObject);

        spotLight.target = targetObject;


        //devos3d.scene.add(spotLight.target);
        devos3d.scene.add(spotLight);

        // var lightHelper = new THREE.SpotLightHelper(spotLight);
        //devos3d.scene.add(lightHelper);
    }
};