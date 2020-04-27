function Catalog() {
    this.FolderUrl = "./data/catalogs/";
    this.jsonData = null;
}

Catalog.prototype.importData = function (url) {
    console.log(this.FolderUrl);
    let completeURL = this.FolderUrl + url;
    console.log("Function: importData " + completeURL);
    importer.contentImporter(completeURL, 'json', this);
};

Catalog.prototype.processJsonData = function (data) {
    console.log("Function: processData");
    console.log(data);
    this.jsonData = data;
    for (let i = 0; i < data.length; i++) {
        // TODO add content here
    }
};