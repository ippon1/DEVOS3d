function ProjectData() {
    this.folderUrl = "./data/projectData/"; // TODO edit this
    this.style = null;
    this.objects = null;
}

ProjectData.prototype.loadOpenDataFromFile = function () {
    this.loadStyle("styles.json");
    this.loadObjects("objTypes.json");
};

ProjectData.prototype.loadObjects = function (fileName) { // TODO die requests in ein file zusammenfuegen
    let completeUrl = this.folderUrl + fileName;
    let xhro = new XMLHttpRequest();
    xhro.responseType = 'json';

    xhro.open("GET", completeUrl, true);
    let self = this;
    xhro.onreadystatechange = function () {
        if (xhro.status === 200 && xhro.readyState === 4) {
            let data = xhro.response;
            let objects = [];
            for (let i = 0; i < data.length; i++) {
                objects[data[i].Key] = data[i];
            }
            self.objects = objects;
        }
    };
    xhro.send(null);
};

// https://stackoverflow.com/questions/583562/json-character-encoding-is-utf-8-well-supported-by-browsers-or-should-i-use-nu
ProjectData.prototype.loadStyle = function (fileName) {
    let completeUrl = this.folderUrl + fileName;
    let xhro = new XMLHttpRequest();
    xhro.responseType = 'json';
    xhro.overrideMimeType("application/json");

    xhro.open("GET", completeUrl, true);
    let self = this;
    xhro.onreadystatechange = function () {
        if (xhro.status === 200 && xhro.readyState === 4) {
            let data = xhro.response;
            let style = [];
            for (let i = 0; i < data.length; i++) {
                style[data[i].Key] = data[i];
            }
            self.style = style;
        }
    };
    xhro.send(null);
};


ProjectData.prototype.showDataOnScreen = function () {
    if (this.style !== null && this.style !== undefined
        && this.objects !== null && this.objects !== undefined) {
        console.log(this.objects);
        //for (var object in projectData.objects)
        for (let i = 11; i < 12; i++) { // data.length; i++) { // TODO auf alle ergaenzen
            this.showObjects(this.objects[i]);
        }
    }
};