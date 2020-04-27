// TODO implement here send request and fetch file
// callbackfunction:
//
// https://stackoverflow.com/questions/13286233/pass-a-javascript-function-as-parameter#13286241

let importer = {

    /**
     * TODO this is during callback not self
     * sends an xmlHTTPRequest and returns the value via the callback function
     * @param url where the content is supost to bbe
     * @param responseType: type of the fetched data
     * @param callbackFunction //TODO not sure if name is right
     */
    contentImporter: function (url, responseType, callbackfunction) {
        console.log("Function: contentImporter");
        console.log(url + ", " + responseType);
        let xhro = new XMLHttpRequest();
        xhro.responseType = responseType;
        xhro.open("GET", url);
        xhro.onreadystatechange = function () {
            if (xhro.status === 200 && xhro.readyState === 4) {
                let jsonData = xhro.response;
                console.log(jsonData);
                //processJsonData(data)
                callbackfunction(jsonData);
            }
        };
        xhro.send(null);
    }
};