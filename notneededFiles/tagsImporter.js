function Tags() {
    this.FolderUrl = "./data/tags/";
    this.jsonData = null;
    this.tags = [];
}

Tags.prototype.importData = function (url) {
    console.log(this.FolderUrl);
    let completeURL = this.FolderUrl + url;
    console.log("Function: importData " + completeURL);
    importer.contentImporter(completeURL, 'json', this);
};

Tags.prototype.processJsonData = function (data) {
    console.log("Function: processData");
    console.log(data);
    this.jsonData = data;

    for (let i = 0; i < data.length; i++) {
        this.tags.push(data[i]);
        // TODO add content here
    }
};