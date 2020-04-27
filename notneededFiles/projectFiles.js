function ProjectFiles() {
    this.jsonData = null;
    this.defaultStyles = [];
    this.layerStates = []; // array filled with booleans
    this.lists = [];
    this.group = [];
}

ProjectFiles.FolderUrl = "./data/files/";

ProjectFiles.prototype.importData = function (url) {
    console.log(ProjectFiles.FolderUrl);
    let completeURL = ProjectFiles.FolderUrl + url;
    let self = this; // TODO might be a problem
    console.log("Function: importData " + completeURL);
    importer.contentImporter(completeURL, 'json', self);
};

ProjectFiles.prototype.processJsonData = function (data) {
    //console.log("Function: processData");
    //console.log(data);
    if (data !== null) {
        this.jsonData = data;
        this.loadDefaultStyles();
        this.showBounds();
        this.loadLayerStates();
        this.loadLists();
        this.showDataSets();
        for (let i = 0; i < data.length; i++) {
            // TODO add content here
        }
    }
};
ProjectFiles.prototype.loadLists = function () {
    let lists = this.jsonData.lists;
    // console.log(lists);
    for (let i = 0; i < lists.length; i++) {
        this.lists[lists[i].key] = lists[i];
    }
};
ProjectFiles.prototype.loadLayerStates = function () {
    let layerStates = this.jsonData.layerStates;
    //console.log(layerStates);
    //for(let i = 0; i < layerStates.length; i++) {
    //    this.layerStates[layerStates[i].name] = layerStates[i];
    //}
    // console.log(layerStates);
    let self = this;
    Object.keys(layerStates).forEach(function (key) {
        self.layerStates.push(layerStates[key]);
    });
};
ProjectFiles.prototype.loadDefaultStyles = function () {
    let defaultStyles = this.jsonData.defaultStyles;
    console.log(defaultStyles);
    let self = this;
    Object.keys(defaultStyles).forEach(function (key) {
        self.defaultStyles.push(defaultStyles[key]);
    });
};

ProjectFiles.prototype.showDataSets = function () {

    let dataSets = this.jsonData.dataSets;
    let processedData = [];
    for (let i = 0; i < dataSets.length; i++) {
        let rawGroups = dataSets[i].groups.groups;
        let allGroups = [];
        Object.keys(rawGroups).forEach(function (key) {
            allGroups.push(rawGroups[key]);
        });

        let rawOpenCloseObjArray = dataSets[i].groups.openCloseObjArray;
        // console.log(allGroups);
        // console.log(rawOpenCloseObjArray);
        // console.log(allGroups);
        // console.log(rawOpenCloseObjArray);
        // console.log(allGroups);
        // console.log(rawOpenCloseObjArray);
        // console.log(allGroups);
        // console.log(rawOpenCloseObjArray);
        processedData[i] = this.showData(dataSets[i].data, allGroups, rawOpenCloseObjArray)
    }
};

ProjectFiles.prototype.showData = function (data, allGroups, rawOpenCloseObjArray) {
    let processedObjects = [];
    let finished = false;
    //console.log(data);
    for (let i = 0; i < data.length && !finished; i++) {
        // finished = true;
        //console.log(data[i]);
        //console.log(data[i]);
        if (data[i].type === "point") { // works
            //console.log("point");
            //console.log(data[i]);
            //processedObjects[i] = new Point(data[i], allGroups, rawOpenCloseObjArray);
        } else if (data[i].type === "line") { // works
            //console.log(data[i]);
            processedObjects[i] = new Line(data[i], allGroups, rawOpenCloseObjArray);
        } else if (data[i].type === "polygon") {
            //console.log(data[i]);
            //processedObjects[i] = new Polygon(data[i], allGroups, rawOpenCloseObjArray);
        } else {
            console.error("Datatype not caught");
            console.error(data[i]);
        }
        if (processedObjects[i] !== null && processedObjects[i] !== undefined) {
            processedObjects[i].displayMesh(this);
        }
    }
    return processedObjects; // TODO edit this
};


ProjectFiles.prototype.showBounds = function () {
    // console.log("Function: showBounds");

    if (this.jsonData !== null && this.jsonData.bounds !== null && this.jsonData.bounds !== undefined) {
        let boundsCoordinates = this.jsonData.bounds.split(',');
        if (
            boundsCoordinates !== null && boundsCoordinates !== undefined &&
            boundsCoordinates[0] !== null && boundsCoordinates[0] !== undefined &&
            boundsCoordinates[1] !== null && boundsCoordinates[1] !== undefined &&
            boundsCoordinates[2] !== null && boundsCoordinates[2] !== undefined &&
            boundsCoordinates[3] !== null && boundsCoordinates[3] !== undefined
        ) {
            sceneObjects.showBounds(
                boundsCoordinates[0],
                boundsCoordinates[1],
                boundsCoordinates[2],
                boundsCoordinates[3]);
        }
    }
};
