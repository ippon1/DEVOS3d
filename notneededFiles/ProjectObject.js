function ProjectObject() {
    this.counter = 0;
        /*
    Farbe: "rgb(255, 103, 38)"​
    Key: 10
    Name: "Verrohrung"
    Sichtbar: "Ja"
    Typ: "LINE"
    colorFromParent: false
    isCollection: false
    nr: 5
    parentKey: "95"
    reportFromParent: false
    reportKey: null
    showLabel: false
    showLabelFromParent: false
    typeFromParent: false
    visiFromParent: false
    */
}

ProjectObject.prototype.showObjects = function (object) {
    //console.log(object);

    let parentQueue = [];
    parentQueue.push(object);
    let currentObject = object;
    //console.log(currentObject);
    while (currentObject.parentKey !== null) {
        // store all parents in an array
        /*
        if (projectData.objects !== null && projectData.objects[currentObject.parentKey] !== null) {
            parentQueue.push(projectData.objects[currentObject.parentKey]);
            currentObject = projectData.objects[currentObject.parentKey];
        } // */
    }

    // draw Mesh to screen
    // TODO Typ vielleicht auf english
    let material = new THREE.MeshBasicMaterial({color: 0xffffff});
    if (object.Farbe !== null) {
        material.color = new THREE.Color(object.Farbe);
    }
    let metaData = "";
    if (object.Name !== null) {
        metaData += object.Name;
    }
    let position = {x: 41472, y: 200, z: 12800}; // TODO edit here
    let rotate = {x: 0, y: 0, z: 0}; // TODO edit here
    let options = {diameter: 30}; // TODO edit here
    let mesh = null;
    if (object.Typ === "POINT") {
        mesh = sceneObjects.addPoint(position, rotate, options, material, metaData);
    } else if (object.Typ === "LINE") {
        // TODO how do i know which line point are part of one mesh
    }

    let style = null;
    if (false && style !== null && style.attributes !== null && style.attributes.externalGraphic !== null && style.attributes.externalGraphic !== undefined && projectObject.counter < 1) {
        // TODO remove false
        this.addGraphicToObject(style.attributes.externalGraphic);
    }
};


//TODO  vielleicht zu return texture umbauen
ProjectObject.prototype.addGraphicToObject = function (graphic) {
    // Add image as texture to geometry
    // projectObject.counter = projectObject.counter + 1;
    if (style !== null && style.attributes !== null && style.attributes.externalGraphic !== null && style.attributes.externalGraphic !== undefined && projectObject.counter < 1) {
        let image = new Image();
        image.src = graphic;
        let texture = new THREE.Texture();
        texture.image = image;
        image.onload = function () {
            texture.needsUpdate = true;
            let geometryWidth = 100;
            let geometryHeight = image.height / image.width * geometryWidth;
            let material = new THREE.MeshLambertMaterial({map: texture});
            let options = {width: geometryWidth, height: geometryHeight};
            let position = {x: 41472, y: 200, z: 12800}; // TODO must be changed
            let metaData = "metaData Plane"; // TODO change this
            let plane = sceneObjects.addPlane(position, options, material, metaData);
            plane.lookAt(devos3d.camera.position);
        }
    }
};