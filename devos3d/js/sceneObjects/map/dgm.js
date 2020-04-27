let dgm =
    {
        vrtJson: null,
        mapIsLoaded: [],

        /**
         * @TODO must be revisited if needed
         * Loads height data from local VRT file
         * @param fileArray
         */
        loadVrt: function (fileArray) {
            if (fileArray == null || fileArray.length === 0) {
                return;
            }
            let vrtFile = fileArray[0];
            let reader = new FileReader();
            reader.onloadend = function () {
                let xmlData = reader.result;
                if (xmlData != null) {
                    let parser = new DOMParser();
                    let xmlDoc = parser.parseFromString(xmlData, "text/xml");
                    dgm.vrtJson = dgm.extractVrtData(xmlDoc);
                    //console.log(dgm.vrtJson);
                }
            };
            reader.readAsText(vrtFile);
        },

        //(3)
        /**
         * extracts VRT Data from xml Document
         * @param xmlDoc: xml Document containing VRT Data
         * @returns vrt data
         */
        extractVrtData: function (xmlDoc) {
            let retObj = {};
            if (xmlDoc == null || xmlDoc.childNodes == null) {
                return null;
            }
            let VRTDataset = xmlDoc.childNodes[0].nodeName === "VRTDataset" ? xmlDoc.childNodes[0] : null;
            if (VRTDataset == null) {
                return null;
            }
            retObj.projection = VRTDataset.children[0].innerHTML;
            retObj.width = Number(VRTDataset.getAttribute("rasterXSize"));
            retObj.height = Number(VRTDataset.getAttribute("rasterYSize"));
            retObj.trafoParameters = (VRTDataset.children[1].innerHTML.split(", ")).map(function (elem) {
                return Number(elem);
            });
            retObj.noDataValue = Number(VRTDataset.children[2].getAttribute("NoDataValue"));
            retObj.data = {};
            let dataChildren = VRTDataset.children[2].children;
            for (let i = 0; i < dataChildren.length; i++) {
                let dataChild = dataChildren[i];
                if (dataChild != null) {
                    retObj.data[dataChild.children[4].getAttribute("xOff") + "_" + dataChild.children[4].getAttribute("yOff")] = {
                        "width": Number(dataChild.children[3].getAttribute("xSize")),
                        "height": Number(dataChild.children[3].getAttribute("ySize")),
                        "file": dataChild.children[0].innerHTML
                    };
                }
            }
            return retObj;
        },

        // updated texture: 4
        // 2
        /**
         * Loads height data from local VRT file (only URL of VRT file available)
         * @TODO remove/rename orientation if possible
         * @param URL: URL of VRT file
         * /// /// /// @param centralPosition: position of central tile
         * @param orientation: tells if first time loading; 0 = first loading; not 0 further loading
         * @param uuid
         */
        loadVrtFromURL: function (URL, orientation, uuid, updatedPosition) {
            //console.log("FUNCTION: loadVrtFromURL");
            //console.log("URL " + URL);
            //var t0 = performance.now();
            let txt = '';
            let xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.status === 200 && xmlhttp.readyState === 4) {
                    txt = xmlhttp.responseText;
                    let parser = new DOMParser();
                    let xmlDoc = parser.parseFromString(txt, "text/xml");
                    dgm.vrtJson = dgm.extractVrtData(xmlDoc);
                    console.log(dgm.vrtJson);
                    //sceneObjects.setProjectionIfNull(dgm.vrtJson);
                    //console.log(dgm.vrtJson);
                    //dgm.loadTile(orientation, uuid);
                    terrain.loadContent(orientation, uuid, updatedPosition);
                }
            };
            xmlhttp.open("GET", URL, true);
            xmlhttp.send();
        },

        // updated texture: 4.2
        // 4.91
        // relativePosition: -1 if first loading
        loadTile: function (centralPosition, orientation, uuid) {
            //console.log("FUNCTION: loadTile");
            if (orientation === 0) {
                dgm.initialMapCreation(centralPosition);
            } else {
                dgm.loadNewTile(centralPosition, orientation, uuid);
            }
        },

        // 4.92       (2.5)
        /**
         * loads height around current camera position
         * @TODO check if "if (userSettings.terrainIn3D)" can be moved in dgm transform
         * @param cameraPos: current camera position
         */
        initialMapCreation: function (cameraPos) {
            //console.log("FUNCTION: initialMapCreation");
            let offset = parseInt((userSettings.totalNumberOfTerrainLoadedPerAxis / 2));
            let firstMapX = parseInt(cameraPos[0] / devos3d.worldWidth - offset) * devos3d.worldWidth;
            let firstMapZ = parseInt(cameraPos[2] / devos3d.worldDepth - offset) * devos3d.worldDepth;
            //console.log(offset + "; " + firstMapX + "; " + firstMapZ);

            //let offset = (devos3d.worldWidth / 2);
            //let firstMapX = parseInt((cameraPos[0] - offset) / devos3d.worldWidth) * devos3d.worldWidth;
            //let firstMapZ = parseInt((cameraPos[2] - offset) / devos3d.worldDepth) * devos3d.worldDepth;
            //console.log(offset + "; " + firstMapX + "; " + firstMapZ);

            dgm.mapIsLoaded = new Array(userSettings.totalNumberOfTerrainLoadedPerAxis * userSettings.totalNumberOfTerrainLoadedPerAxis);

            for (let x = 0; x < userSettings.totalNumberOfTerrainLoadedPerAxis; x++) {
                for (let z = 0; z < userSettings.totalNumberOfTerrainLoadedPerAxis; z++) {
                    dgm.mapIsLoaded.push(false);
                    if (userSettings.terrainIn3D) { //
                        dgm.transform('map2coordinates', [firstMapX + devos3d.worldWidth * x, firstMapZ + devos3d.worldDepth * z], x * userSettings.totalNumberOfTerrainLoadedPerAxis + z, 0, 0);
                    } else {
                        dgm.transform('map2pixel', [firstMapX + devos3d.worldWidth * x, firstMapZ + devos3d.worldDepth * z], x * userSettings.totalNumberOfTerrainLoadedPerAxis + z, 0, 0);
                    }
                }
            }
        },

        // updated texture: 5
        // orientation: 1 - x -axis; 2 - z-axis
        /**
         * loads height data around a specified location
         * @TODO check if "if (userSettings.terrainIn3D)" can be moved in dgm transform
         * @TODO remove/rename orientation if possible
         * @param cameraPos: current Position of camera
         * @param orientation: orientation of tile
         */
        loadNewTile(cameraPos, orientation, uuid) {
            //console.log("FUNCTION: loadNewTile");
            // TODO add factor indecating the correct field
            let firstMapX = parseInt(cameraPos[0] / devos3d.worldWidth) * devos3d.worldWidth; // terrain.planeSize;//
            let firstMapZ = parseInt(cameraPos[2] / devos3d.worldDepth) * devos3d.worldDepth; // terrain.planeSize;//
            dgm.mapIsLoaded = new Array(userSettings.totalNumberOfTerrainLoadedPerAxis);
            // TODO MUST KNOW THE POSITION of one of the three
            dgm.mapIsLoaded.push(false);
            if (userSettings.terrainIn3D) { //
                dgm.transform('map2coordinates', [firstMapX, firstMapZ], 0, orientation, uuid);
                // TODO load osm here
            } else {
                dgm.transform('map2pixel', [firstMapX, firstMapZ], 0, orientation, uuid);
            }
            //                 transform: function (type, currentTerrainPos, relativePosition) {
        },


        // updated texture: 6
        // 4.93        (4)
        /**
         * Loads height data for tile based on the coordinates
         * @TODO remove/rename orientation if possible
         * @TODO test for max Values before using the data stored in currentTerrainPos
         * @param type: type of Map to be drawn
         * @param currentTerrainPos: the current tile index
         * @param relativePosition: tile position relative to the camera
         * @param orientation 0 - prime loading; 1 - x -axis; 2 - z-axis (is not used)
         */
        transform: function (type, currentTerrainPos, relativePosition, orientation, oldUuid) {
            //console.log(type + ", " + currentTerrainPos + ", " + relativePosition);
            if (currentTerrainPos[0] < 0 || currentTerrainPos[1] < 0) {
                console.error("Corrdinates are not vaild");
                return;
            }

            terrain.currentTerrainPart = currentTerrainPos;

            let currentPos = currentTerrainPos[0] + "_" + currentTerrainPos[1]; // todo use this line
            let firstName = dgm.vrtJson.data[currentPos].file;

            let url = "data/dgm.tif/" + firstName;
            let xhro = new XMLHttpRequest();
            xhro.responseType = "arraybuffer";
            xhro.open("GET", url);
            xhro.onreadystatechange = function () {
                if (xhro.status === 200 && xhro.readyState === 4) {
                    let data = xhro.response;
                    if (orientation === 0) {
                        if (type === "map2coordinates") {
                            terrain.createMesh(relativePosition, dgm.createHeightMap(data));
                        } else if (type === "map2pixel") {
                            // terrain.createMesh(relativePosition, dgm.createRGBMap(data));
                        }
                    } else {
                        if (type === "map2coordinates") {
                            terrain.updateTexture(dgm.createHeightMap(data), oldUuid);
                        } else if (type === "map2pixel") {
                            // TODO wieder einblenden terrain.updateTexture(dgm.createRGBMap(data), oldUuid);
                        }
                    }
                    dgm.mapIsLoaded[relativePosition] = true;
                    let startAnimation = true; // TODO synchronize here
                    for (let i = 0; i < userSettings.totalNumberOfTerrainLoadedPerAxis * userSettings.totalNumberOfTerrainLoadedPerAxis; i++) {
                        startAnimation = startAnimation && dgm.mapIsLoaded[i];
                    }
                    if (startAnimation) {
                        terrain.everythingLoaded = true;
                        devos3d.animate();
                    }
                }
            };
            xhro.send(null);
        },


        /**
         * Create Heightmap from data
         * @param data: data from current file
         * @returns heightmap in 1D array
         */
        createHeightMap: function (data) {
            if (data) {
                let parser = new GeotiffParser();
                parser.parseHeader(data);

                let xmin = 0;
                let ymin = 0;
                let xmax = parser.imageWidth;
                let ymax = parser.imageLength;
                let vmin = 0;
                let vmax = 1000;
                let currentHeightMap = [];
                for (let y = ymin; y < ymax; y++) {
                    if (currentHeightMap === null) {
                        currentHeightMap[y] = []
                    }
                    for (let x = xmin; x < xmax; x++) {
                        let pixSample = parser.getPixelValueOnDemand(x, y);
                        if (pixSample !== 'undefined') { //TODO is 'undefined' a string
                            if (vmin != 'undefined' && vmax != 'undefined') {
                                currentHeightMap[y * xmax + x] = parser.getMinMaxPixelValue(pixSample, vmin, vmax)[0];
                            } else {
                                currentHeightMap[y * xmax + x] = parser.getRGBAPixelValue(pixSample)[0];
                            }
                        } else {
                            currentHeightMap[y * xmax + x] = 0;//[255,0,0,1]; // not sure about this
                        }
                    }
                }
                return currentHeightMap;
            }
        },

        /**
         * Creates RGB Map from heightData
         * @TODO revisit here: not sure if still works; not sure if still needed
         * @param data: height Data
         * @returns 2D representation from height data
         */
        createRGBMap: function (data) {
            let currentRgbMap = null;
            if (data) {
                let parser = new GeotiffParser();
                parser.parseHeader(data);
                currentRgbMap = parser.toRGB(0, 0, parser.imageWidth, parser.imageLength, 0, 1000); // TODO auf 9 erweitern
            }
            return currentRgbMap
        },

        /**
         * Converts GPS coordinates to the current world format
         * @param mapX: GPS x coordinates
         * @param mapY: GPS y coordinates
         * @returns {{x: coordinate in current world format, y: coordinate in current world format}}
         * http://www.iti.fh-flensburg.de/lang/algorithmen/fft/polyausw.htm
         */
        convertGPSToMap: function (mapX, mapY) {
            //console.log(mapX + ", " + mapY);
            let mapVector = [[mapX], [mapY], [1]];
            let a = dgm.vrtJson.trafoParameters[0];
            let b = dgm.vrtJson.trafoParameters[1];
            let c = dgm.vrtJson.trafoParameters[2];
            let d = dgm.vrtJson.trafoParameters[3];
            let e = dgm.vrtJson.trafoParameters[4];
            let f = dgm.vrtJson.trafoParameters[5];
            let matrix = math.matrix([[b, c, a], [e, f, d], [0, 0, 1]]);
            let inv = math.inv(matrix);
            let pixelVector = math.multiply(inv, mapVector);
            return {"x": pixelVector.get([0, 0]), "y": pixelVector.get([1, 0])};
        },

        /**
         * Converts current world format to the GPS coordinates
         * @param mapX: GPS x coordinates
         * @param mapY: GPS y coordinates
         * @returns {{x: coordinate in current world format, y: coordinate in current world format}}
         * http://www.iti.fh-flensburg.de/lang/algorithmen/fft/polyausw.htm
         */
        convertMapToGPS: function (mapX, mapY) {
            let mapVector = [[mapX], [mapY], [1]];
            let a = dgm.vrtJson.trafoParameters[0];
            let b = dgm.vrtJson.trafoParameters[1];
            let c = dgm.vrtJson.trafoParameters[2];
            let d = dgm.vrtJson.trafoParameters[3];
            let e = dgm.vrtJson.trafoParameters[4];
            let f = dgm.vrtJson.trafoParameters[5];
            let matrix = math.matrix([[b, c, a], [e, f, d], [0, 0, 1]]);
            let pixelVector = math.multiply(matrix, mapVector);
            return {"x": pixelVector.get([0, 0]), "y": pixelVector.get([1, 0])};
        }
    };
