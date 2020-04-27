// https://de.wikipedia.org/wiki/Geographische_Koordinaten
// https://stackoverflow.com/questions/9484402/render-a-map-from-openstreetmap-data-with-an-open-source-3d-engine
// data source: www.openstreetmap.org
function OpenStreetMapData(left, bottom, right, top, uuid) {
    this.apiUrl = "https://api.openstreetmap.org/api/0.6/map?bbox=";
    this.fileUrl = "./data/osm/map.osm"; // TODO edit this
    this.left = left;
    this.bottom = bottom;
    this.right = right;
    this.top = top;

    this.uuid = uuid;

    this.fc = null; // featureCollection
    this.osmObjects = []; // TODO store it per terrain tile
    this.wayCounter = 0; // TODO change this
}

// Ybbsitz: https://www.openstreetmap.org/api/0.6/map?bbox=14.88,47.93,14.93,47.98
// Wien     https://www.openstreetmap.org/api/0.6/map?bbox=16.40,48.93,16.94,48.98 // ZU gross
// TODO maybe load a little bit more (bigger area) to so the street does not simply end
// TODO if there are more pages they are not loaded
// TODO call over renderer
OpenStreetMapData.prototype.loadOpenDataFromApi = function () {
    console.log("loadOpenDataFromApi");
    // Round to two coordinates
    console.log(this.left + ", " + this.bottom + ", " + this.right + ", " + this.top + ", " + this.uuid);
    let leftRounded = Math.round(this.left * 100) / 100;
    let bottomRounded = Math.round(this.bottom * 100) / 100;
    let rightRounded = Math.round(this.right * 100) / 100; //leftRounded+0.01; //
    let topRounded = Math.round(this.top * 100) / 100; //bottomRounded+0.01; //
    console.log(leftRounded + ", " + bottomRounded + ", " + rightRounded + ", " + topRounded);
    terrain.streetMap = new Uint8Array(terrain.planeSize * terrain.planeSize);
    //console.log(terrain.streetMap);
    //console.log("Function: loadOpenDataFromApi");
    let totalUrl = this.apiUrl + leftRounded + "," + bottomRounded + "," + rightRounded + "," + topRounded;

    sceneObjects.showBounds(leftRounded, bottomRounded, rightRounded, topRounded);

    let xhro = new XMLHttpRequest();
    xhro.open("GET", totalUrl);
    let self = this;
    xhro.onreadystatechange = function () {
        if (xhro.status === 200 && xhro.readyState === 4) {
            self.fc = osmtogeojson($.parseXML(xhro.response));
        }
    };
    xhro.send(null);
};

OpenStreetMapData.prototype.loadOpenDataFromFile = function () {
    terrain.streetMap = new Uint8Array(terrain.planeSize * terrain.planeSize);
    //console.log(terrain.streetMap);
    //console.log("Function: loadOpenDataFromFile");
    let xhro = new XMLHttpRequest();
    xhro.open("GET", this.fileUrl, true);
    xhro.onreadystatechange = function () {
        if (xhro.status === 200 && xhro.readyState === 4) {
            this.fc = osmtogeojson($.parseXML(xhro.response));
        }
    };
    xhro.send(null);
};

// shows the osm elements on screen
OpenStreetMapData.prototype.showDataOnScreen = function () {
    if (this.fc === null) {
        console.error("Featurecollection is null");
        return;
    }
    //console.log("showDataOnScreen");
    //console.log("----------------------------------------------------------------------------------------------------");
    //console.log(this.uuid);
    this.osmObjects["building"] = [];// TODO vielleicht this.osmObjects
    this.osmObjects["highway"] = [];
    this.osmObjects["waterway"] = [];
    this.osmObjects["railway"] = [];
    this.osmObjects["fixOSMObjects"] = [];

    //for (let i = 0; i < 3; i++) {
    for (let i = 0; i < this.fc.features.length; i++) {
        let currentFeature = this.fc.features[i];
        let currentType = currentFeature.properties.type;
        if (this.wayCounter <= 0) {
            if (currentType === "way") {
                // TODO implement tags; in objekt auslagern (https://www.w3schools.com/jsref/jsref_indexof_array.asp)
                let tags = currentFeature.properties.tags;
                if (tags.building !== null && tags.building !== undefined && tags.building !== "no") {
                    //this.osmObjects["building"].push(building.addBuildingToScene(currentFeature, this.uuid));
                } else if (tags.highway !== null && tags.highway !== undefined && tags.highway !== "no") {
                    //console.log("1showDataOnScreen this.uuid");
                    //console.log(this.uuid);
                    this.osmObjects["highway"].push(streets.addWayToScene(currentFeature, this.uuid));
                } else if (tags.waterway !== null && tags.waterway !== undefined && tags.waterway !== "no") {
                    //console.log("2showDataOnScreen this.uuid");
                    //console.log(this.uuid);
                    this.osmObjects["waterway"].push(waterway.addWaterwayToScene(currentFeature, this.uuid));
                } else if (tags.railway !== null && tags.railway !== undefined && tags.railway !== "no") {
                    //console.log("3showDataOnScreen this.uuid");
                    //console.log(this.uuid);
                    this.osmObjects["railway"].push(railway.addRailwayToScene(currentFeature, this.uuid)); //TODO auf zwei lines ergaenzen
                } else if (tags.natural !== null && tags.natural !== undefined && tags.natural !== "no") {
                } else if (tags.wood !== null && tags.wood !== undefined && tags.wood !== "no") {
                } else if (tags.leisure !== null && tags.leisure !== undefined && tags.leisure !== "no") {
                } else if (tags.boundary !== null && tags.boundary !== undefined && tags.boundary !== "no") {
                } else if (tags.landuse !== null && tags.landuse !== undefined && tags.landuse !== "no") {
                } else if (tags.bridge !== null && tags.bridge !== undefined && tags.bridge !== "no") {
                } else if (tags.amenity !== null && tags.amenity !== undefined && tags.amenity !== "no") {
                } else if (tags.leisure !== null && tags.leisure !== undefined && tags.leisure !== "no") {
                } else if (tags.historic !== null && tags.historic !== undefined && tags.historic !== "no") {
                } else if (tags.power !== null && tags.power !== undefined && tags.power !== "no") {
                } else if (tags.man_made !== null && tags.man_made !== undefined && tags.man_made !== "no") {
                } else if (tags.barrier !== null && tags.barrier !== undefined && tags.barrier !== "no") {
                } else if (tags.parking !== null && tags.parking !== undefined && tags.parking !== "no") {
                } else if (tags.animal !== null && tags.animal !== undefined && tags.animal !== "no") {
                } else if (tags["area:aeroway"] !== null && tags["area:aeroway"] !== undefined && tags["area:aeroway"] !== "no") { // airport //TODO not sure if this works
                } else if (tags["removed:highway"] !== null && tags["removed:highway"] !== undefined && tags["removed:highway"] !== "no") { // airport //TODO can man nach teilen des tags anpassen
                } else if (tags["removed:building"] !== null && tags["removed:building"] !== undefined && tags["removed:building"] !== "no") { // airport //TODO can man nach teilen des tags anpassen
                } else if (tags.aeroway !== null && tags.aeroway !== undefined && tags.aeroway !== "no") { // airport
                } else {
                    //this.osmObjects["fixOSMObjects"].push(fixOSMObject.addFixOSMObjectToScene(currentFeature));
                }
            }
        }
    } // */
};

/**
 * Removes all meshes from this object from screen
 */
OpenStreetMapData.prototype.removeAllObjectsFromScreen = function () {
    console.log("Removes all meshes from this object from screen");
    console.log(this.osmObjects);
    for (let objectsFromCat in this.osmObjects) { // TODO check for arrays here
        for (let val of objectsFromCat) {
            console.log(val);
            if (val instanceof Array) {
                for (let c of val) {
                    // TODO if more arrays
                    console.log(c);
                    devos3d.scene.remove(c);
                }
            } else {
                devos3d.scene.remove(val);
            }
        }
    }
};

/**
 * removes all Objects from one category
 * @param id name of the category
 */
OpenStreetMapData.prototype.removeObjectCategory = function (id) {
    for (let val of this.osmObjects[id]) {
        if (val instanceof Array) {
            for (let c of val) {
                // TODO if more arrays
                devos3d.scene.remove(c);
            }
        } else {
            devos3d.scene.remove(val);
        }
    }
};

/**
 * add all Objects from one category
 * @param id name of the category
 */
OpenStreetMapData.prototype.addObjectCathegory = function (id) {
    for (let val of openStreetMapImporter.osmObjects[id]) {
        if (val instanceof Array) {
            for (let c of val) {
                // TODO if more arrays
                devos3d.scene.add(c);
            }
        }
        devos3d.scene.add(val);
    }
};
