

// end player controlls
Physijs.scripts.worker = 'https://rawgithub.com/chandlerprall/Physijs/master/physijs_worker.js';
Physijs.scripts.ammo = 'http://chandlerprall.github.io/Physijs/examples/js/ammo.js';

// standard global variables
var container, scene, camera, renderer, controls;
//var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

// MAIN //
window.onload = function() {
    console.log('loaded')

    // SCENE //
    scene = new Physijs.Scene();
    scene.setGravity(new THREE.Vector3(0, -32, 0));
    scene.addEventListener(
        'update',

        function () {
            scene.simulate();
        });

    // CAMERA //
    var SCREEN_WIDTH = window.innerWidth,
        SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45,
        ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
        NEAR = 1,
        FAR = 1000;
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

    // RENDERER //
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.shadowMapEnabled = true;
    // to antialias the shadow
    renderer.shadowMapSoft = true;

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    // EVENTS //
    //THREEx.WindowResize(renderer, camera);

    // LIGHT //
    var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 500, 0);
    scene.add(hemiLight);

    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.color.setHSL(0.1, 1, 0.95);
    light.position.set(-1, 1.75, 1);
    light.position.multiplyScalar(50);
    light.castShadow = true;
    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;
    light.shadowDarkness = 0.5;
    var d = 50;
    light.shadowCameraLeft = -d;
    light.shadowCameraRight = d;
    light.shadowCameraTop = d;
    light.shadowCameraBottom = -d;
    light.shadowCameraFar = 3500;
    light.shadowBias = -0.0001;
    light.shadowDarkness = 0.35;
    scene.add(light);

    // GEOMETRY //
    var checkerboard = new THREE.ImageUtils.loadTexture('http://www.cns.nyu.edu/lcv/texture/artificial-periodic/checkerboard.o.jpg');
    checkerboard.wrapS = checkerboard.wrapT = THREE.RepeatWrapping;
    checkerboard.repeat.set(4, 4);

    var checkerboard2 = new THREE.ImageUtils.loadTexture('http://www.cns.nyu.edu/lcv/texture/artificial-periodic/checkerboard.o.jpg');

    var cubeMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({
            map: checkerboard2
        }),
        1.0, // high friction
        0.0 // low restitution
    );
    var cubeGeometry = new THREE.CubeGeometry(10, 5, 10, 1, 1, 1);
    var cube = new Physijs.BoxMesh(
        cubeGeometry,
        cubeMaterial,
        1);

    cube.position.set(-10, 1, -10);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.occ = true;
    scene.add(cube);


    var cubeMaterial2 = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({
            map: checkerboard2
        }),
        1.0, // high friction
        0.0 // low restitution
    );
    var cubeGeometry2 = new THREE.CubeGeometry(10, 5, 10, 1, 1, 1);
    var cube2 = new Physijs.BoxMesh(
        cubeGeometry2,
        cubeMaterial2,
        1);

    cube2.position.set(-10, 7, -1);
    cube2.castShadow = true;
    cube2.receiveShadow = true;
    cube2.occ = true;
    scene.add(cube2);

    var cubeMaterial3 = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({
            map: checkerboard2
        }),
        1.0, // high friction
        0.0 // low restitution
    );
    var cubeGeometry3 = new THREE.CubeGeometry(10, 5, 10, 1, 1, 1);
    var cube3 = new Physijs.BoxMesh(
        cubeGeometry3,
        cubeMaterial3,
        1);

    cube3.position.set(-10, 13, 8);
    cube3.castShadow = true;
    cube3.receiveShadow = true;
    cube3.occ = true;
    scene.add(cube3);

    var cone = new Physijs.ConeMesh(
        new THREE.CylinderGeometry(0, 5, 4, 30, 30, true),
        Physijs.createMaterial(
            new THREE.MeshLambertMaterial({
                map: checkerboard2
            }),
            1.0, // high friction
            0.0 // low restitution
        ),
        0);
    cone.position.set(0, 2, 0);
    scene.castShadow = true;
    scene.receiveShadow = true;
    cone.occ = true;
    scene.add(cone);


    // FLOOR //
    var floorMaterial = new THREE.MeshLambertMaterial({
        map: checkerboard
    });
    var floorGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
    var floor = new Physijs.PlaneMesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.castShadow = false;
    floor.receiveShadow = true;
    floor.occ = true;
    scene.add(floor);

    // SKY //
    var skyBoxGeometry = new THREE.CubeGeometry( 1000, 1000, 1000 );
    var skyBox = new THREE.Mesh(skyBoxGeometry, new THREE.MeshLambertMaterial({
        color: '#3333bb'
    }));
    scene.add(skyBox);

    // fog must be added to scene before first render
    scene.fog = new THREE.FogExp2(0x999999, 0.001);


    var bounding = new Physijs.SphereMesh(
        new THREE.SphereGeometry(0.75, 4, 4),
        Physijs.createMaterial(
            new THREE.MeshBasicMaterial({
                color: '#ff0000'
            }),
            1.0, // high friction
            0.0 // low restitution
        ),
        0.1);

    var player = new THREE.Mesh(
        new THREE.CubeGeometry(1, 6, 1, 1, 1, 1),
        new THREE.MeshLambertMaterial({
            color: '#00ff00'
        }),
        1);
    player.position.set(0, 3, 0);

    bounding.position.set(10, 0.75, -10);
    bounding.add(player);

    scene.add(bounding);
    bounding.setAngularFactor(new THREE.Vector3(0, 0, 0));
    controls = new THREE.PlayerControls(bounding, scene, player, camera, renderer.domElement);

    // animation loop / game loop
    scene.simulate();
    animate();
};

function animate() {
    requestAnimationFrame(animate);
    render();
    update();
}

function update() {
    // delta = change in time since last call (in seconds)
    var delta = clock.getDelta();
    THREE.AnimationHandler.update(delta);
    if (controls) controls.update(delta);
}

function render() {
    renderer.render(scene, camera);
}