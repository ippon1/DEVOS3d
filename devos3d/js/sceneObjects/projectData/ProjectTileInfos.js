function ProjectTileInfos() {
    this.jsonData = null;
    this.bounds = null;
    this.data = null;
    this.projectObjects = [];
}

/**
 * URL of the folder where the json is stored
 * @type {string}
 */
ProjectTileInfos.defaultFolderUrl = "./data/projectData/";

ProjectTileInfos.prototype.importData = function (fileName) {
    //console.log(ProjectFiles.FolderUrl);
    let completeURL = ProjectTileInfos.defaultFolderUrl + fileName;
    //let self = this; // TODO might be a problem
    // console.log("Function: importData " + completeURL);
    this.contentImporter(completeURL, 'json', ProjectTileInfos.prototype.processJsonData);
};

ProjectTileInfos.prototype.contentImporter = function (url, responseType) {
    //console.log("Function: contentImporter");
    //console.log(url + ", " + responseType);
    let xhro = new XMLHttpRequest();
    xhro.responseType = responseType;
    xhro.open("GET", url);
    let self = this;
    xhro.onreadystatechange = function () {
        if (xhro.status === 200 && xhro.readyState === 4) {
            let jsonData = xhro.response;
            //console.log(jsonData);
            self.processJsonData(jsonData);
        }
    };
    xhro.send(null);
};

ProjectTileInfos.prototype.processJsonData = function (jsonData) {
    //console.log("Function: processData");
    //console.log(jsonData);
    if (jsonData !== null) {
        this.jsonData = jsonData;
        this.data = this.jsonData.data;
        this.bounds = this.jsonData.bounds;
        for (let i in this.data) {
            if (this.data[i].key !== null && this.data[i].key !== undefined /* && this.data[i].dbObj.type === "point" */) {
                //console.log(i);
                //console.log(this.data[i]);
                let currentObject = new ProjectObjects(this.data[i]);
                currentObject.displayMesh();
                //console.log(currentObject);
                this.projectObjects.push(currentObject); // TODO is i key??
            }
        }
    }
};