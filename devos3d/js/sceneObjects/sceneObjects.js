let sceneObjects = {

    //vrtJson: null,

    // TODO https://stackoverflow.com/questions/16360028/three-js-sphere-that-glows
    addPoint: function (position, rotate, options, material, metaData) {
        let geometrySphere = new THREE.SphereBufferGeometry(options.diameter / 2, 32, 32);
        let sphere = new THREE.Mesh(geometrySphere, material);
        sphere.userData = metaData;// + " " + position.x + ", " + position.y + ", " + position.z; // TODO edit here
        sphere.castShadow = true;
        sphere.position.set(position.x, position.y, position.z);
        devos3d.scene.add(sphere);
        devos3d.objectsInScene.push(sphere);
        //console.log(sphere);
        return sphere;
    },

    /**
     * Adds a cube mesh to scene
     * @param position: position of the mesh
     * @param rotate: rotation of the mesh
     * @param options: options currently only is used for the size of the geometry
     * @param material: Material of the mesh
     * @param metaData: string representation of the metadata // TODO could be changed to an object
     * @returns the mesh which was added to the scene
     */
    addCube: function (position, rotate, options, material, metaData) {
        let geometry = new THREE.BoxBufferGeometry(options.length, options.height, options.depth);
        let cube = new THREE.Mesh(geometry, material);
        cube.userData = metaData;
        cube.castShadow = true;
        cube.position.set(position.x, position.y, position.z);
        cube.rotation.x = rotate.x - options.length / 2;
        cube.rotation.y = rotate.y - options.height / 2;
        cube.rotation.z = rotate.z - options.depth / 2;
        devos3d.scene.add(cube);
        devos3d.objectsInScene.push(cube);
        return cube;
    },

    /**
     * Adds a plane mesh to scene
     * @param position: position of the mesh
     * @param options: options currently only is used for the size of the geometry
     * @param material: Material of the mesh
     * @param metaData: string representation of the metadata // TODO could be changed to an object
     * @returns the mesh which was added to the scene
     */
    addPlane: function (position, options, material, metaData) {
        let geometry = new THREE.PlaneBufferGeometry(options.width, options.height);
        let plane = new THREE.Mesh(geometry, material);
        //console.log(options);
        plane.rotation.y = options.rotate.y;
        plane.userData = metaData;
        plane.castShadow = true;
        plane.position.set(position.x, position.y, position.z);

        devos3d.scene.add(plane);
        devos3d.objectsInScene.push(plane);
        return plane;
    },

    dummy: function () {
        //console.log("dummy");
        let options = {"diameter": 100};
        let rotate = {"x": 0, "y": 0, "z": 0};
        let metaData = "PUNKT METADATA";
        let material7 = new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: false}); // 41472, 300, 12800
        let position7 = {
            "x": terrain.centralPosition[0],
            "y": 200,
            "z": terrain.centralPosition[2]

        };
        for (let x = 0; x < 1; x++) {
            for (let z = 0; z < 1; z++) {
                for (let i = 0; i < 50; i = i + 10) {
                    let material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});

                    let position = {
                        "x": x * terrain.planeSize + (100) * i,
                        "y": terrain.centralPosition[1],
                        "z": z * terrain.planeSize
                    };
                    //console.log(point);
                    this.addPoint(position, rotate, options, material, metaData);
                    // let position = devos3d.target = this.addPoint({ "x": x * terrain.planeSize, "y": terrain.centralPosition[1] + (100) * i, "z": z * terrain.planeSize }, {"x": 0, "y": 0, "z": 0}, options, new THREE.MeshBasicMaterial({color: 0x00ff00}), "");
                }
                for (let i = 0; i < 50; i = i + 10) {
                    let material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});

                    let position = {
                        "x": x * terrain.planeSize,
                        "y": terrain.centralPosition[1] + (100) * i,
                        "z": z * terrain.planeSize
                    };
                    //console.log(point);
                    this.addPoint(position, rotate, options, material, metaData);
                }
                for (let i = 0; i < 50; i = i + 10) {
                    let material = new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: true});
                    let position = {
                        "x": x * terrain.planeSize,
                        "y": terrain.centralPosition[1],
                        "z": z * terrain.planeSize + (100) * i
                    };

                    this.addPoint(position, rotate, options, material, metaData);
                }
                for (let i = 0; i < 50; i = i + 10) {
                    let material = new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: true});
                    let position = {
                        x: x * terrain.planeSize,
                        y: terrain.centralPosition[1],
                        z: z * terrain.planeSize + (100) * i
                    };

                    this.addPoint(position, rotate, options, material, metaData);
                }
            }
        }
    },


    // Transforms Coordinates from the WGS84 coordinate system to the EPSG:3857 coordinate system
    // latitude, longitude: coordinates from this point
    // https://www.gdal.org/gdal_vrttut.html
    // https://de.wikipedia.org/wiki/European_Petroleum_Survey_Group_Geodesy#EPSG-Codes
    transformCoordinatesToMap: function (latitude, longitude) {
        //console.log("transformCoordinatesToMap");
        let firstProjection = proj4.defs('WGS84');
        let secondProjection = proj4.defs('EPSG:3857'); // https://en.wikipedia.org/wiki/Web_Mercator
        let EPSG3857 = proj4(firstProjection, secondProjection, [longitude, latitude]);
        let correctCoordinates = dgm.convertGPSToMap(EPSG3857[0], EPSG3857[1]);

        return [correctCoordinates.x, correctCoordinates.y];
    },


    // reverse function from "transformCoordinatesToMap"
    // Transforms Coordinates from the WGS84 coordinate system to the EPSG:3857 coordinate system
    // latitude, longitude: coordinates from this point
    // https://www.gdal.org/gdal_vrttut.html
    // https://de.wikipedia.org/wiki/European_Petroleum_Survey_Group_Geodesy#EPSG-Codes
    transformCoordinatesToGPS: function (coordinatesX, coordinatesY) {
        let firstProjection = proj4.defs('EPSG:3857');
        let secondProjection = proj4.defs('WGS84'); // https://en.wikipedia.org/wiki/Web_Mercator
        let correctCoordinates = dgm.convertMapToGPS(coordinatesX, coordinatesY);
        let WGS84 = proj4(firstProjection, secondProjection, [correctCoordinates.x, correctCoordinates.y]);

        return [WGS84[1], WGS84[0]];
    },

    generateLinesFromVertices: function (positions, material, metaData, meshType, uuid) {
        //console.log("generateLinesFromVertices");
        let curves = [];
        let meshes = [];
        if (positions.length > 1) {
            for (let i = 0; i < positions.length - 1; i++) {
                if (positions[i].y > 0) {
                    curves.push(new THREE.Vector3(positions[i].x, positions[i].y, positions[i].z)); // TODO einbelenden
                    let c = [
                        new THREE.Vector3(positions[i].x, positions[i].y, positions[i].z),
                        new THREE.Vector3(positions[i + 1].x, positions[i + 1].y, positions[i + 1].z)];
                    let curve = new THREE.CatmullRomCurve3(c, false, 'catmullrom', 0.0); // ,
                    curve.tension = 0;
                    let points = curve.points;

                    let length, width;
                    if (meshType === 'cable') {
                        length = width = 0.01;
                    } else if (meshType === 'mast') {
                        length = width = 0.01;
                    } else {
                        length = 0.5;
                        width = 0.1;
                    }

                    let shape = new THREE.Shape();
                    shape.moveTo(0, 0);
                    shape.lineTo(0, width);
                    shape.lineTo(length, width);
                    shape.lineTo(length, 0);
                    shape.lineTo(0, 0);

                    let extrudeSettings = {
                        steps: 2,
                        depth: 0,
                        extrudePath: curve,
                        tension: 0.0,
                        bevelEnabled: false,
                        bevelThickness: 0,
                        bevelSize: 0,
                        bevelSegments: 0
                    };

                    let geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
                    let mesh = new THREE.Mesh(geometry, material);
                    mesh.userData = metaData;
                    meshes[i] = mesh;
                    devos3d.scene.add(mesh);
                    devos3d.objectsInScene.push(mesh); // push for intersection
                }
            }
        }
        // TODO  Meshes should be merged
        return meshes[0];
    },

    /**
     * Sources:
     * https://threejs.org/docs/#api/geometries/ExtrudeBufferGeometry
     * https://threejs.org/docs/#api/extras/curves/CatmullRomCurve3
     * @param positions: position of the vertices of the lien
     * @param material: material of the line
     * @param metaData: metadata of the object
     * @param uuid: is -1 if no uuid exists until now
     */
    addLineToScene: function (positions, material, metaData, meshType, uuid) { // TODO why uuid
        //console.log(positions);
        //console.log(uuid);
        let mesh = this.generateLinesFromVertices(positions, material, metaData, meshType, uuid);


        return mesh;
    },

    /**
     * Sources:
     * https://threejs.org/docs/#api/geometries/ExtrudeBufferGeometry
     * https://threejs.org/docs/#api/extras/curves/CatmullRomCurve3
     *
     * https://computergraphics.stackexchange.com/questions/1839/angle-between-two-points-in-cartesian-coordinate-system-c#1840
     *
     * @TODO optimize this make less loops
     * @param positions: position of the vertices of the lien
     * @param material: material of the line
     * @param offset: of the line; useful for railways
     * @param metaData: metadata of the object
     */
    generateParallelLinesFromVerticesAndAddToScene: function (positions, material, offset, metaData, uuid) {
        //console.log(uuid);
        if (positions.length <= 1) {
            return null;
        }

        let positionsGreaterZero = []; // TODO als filter implementieren
        for (let i = 0; i < positions.length; i++) {
            if (positions[i].y > 0) {
                positionsGreaterZero.push(positions[i]);
            }
        }

        if (positionsGreaterZero.length <= 1) {
            return null;
        }

        let line = [];

        // get normals
        let normalDirections1 = [];
        let normalDirections2 = [];
        // angles between the two lines
        let angles = [];
        for (let i = 0; i < positionsGreaterZero.length - 1; i++) {
            line.push(this.normalizeVector({
                x: positionsGreaterZero[i + 1].x - positionsGreaterZero[i].x,
                y: positionsGreaterZero[i + 1].y - positionsGreaterZero[i].y,
                z: positionsGreaterZero[i + 1].z - positionsGreaterZero[i].z
            }));
            normalDirections1.push({
                x: -line[i].z,//offset,
                z: line[i].x//offset
            });
            normalDirections2.push({
                x: line[i].z,//,
                z: -line[i].x//offset
            });
            let onetwo = positionsGreaterZero[i].x * positionsGreaterZero[i + 1].x + positionsGreaterZero[i].z * positionsGreaterZero[i + 1].z;
            let oneone = positionsGreaterZero[i].x * positionsGreaterZero[i].x + positionsGreaterZero[i].z * positionsGreaterZero[i].z;
            let twotwo = positionsGreaterZero[i + 1].x * positionsGreaterZero[i + 1].x + positionsGreaterZero[i + 1].z * positionsGreaterZero[i + 1].z;
            angles[i] = Math.acos((onetwo) / (Math.sqrt(oneone) * Math.sqrt(twotwo)));


        }
        // push vertices in the correct order
        let newPoints1 = []; // TODO in array zusammenfassen
        let pos00 = [positionsGreaterZero[0].x + normalDirections1[0].x * offset, positionsGreaterZero[0].z + normalDirections1[0].z * offset];
        let pos01 = [positionsGreaterZero[0].x + normalDirections2[0].x * offset, positionsGreaterZero[0].z + normalDirections2[0].z * offset];
        newPoints1.push({
            x: pos00[0],
            y: terrain.getHeightOfPoint(pos00) + 0.1,
            z: pos00[1]
        });
        let newPoints2 = [];
        newPoints2.push({
            x: pos01[0],
            y: terrain.getHeightOfPoint(pos01) + 0.1,
            z: pos01[1]
        });
        let posi00;
        let posi01;
        let posi10;
        let posi11;
        for (let i = 0; i < angles.length - 1; i++) {
            posi01 = [positionsGreaterZero[i + 1].x + normalDirections1[i + 1].x * offset, positionsGreaterZero[i + 1].z + normalDirections1[i + 1].z * offset];
            posi00 = [positionsGreaterZero[i + 1].x + normalDirections1[i].x * offset, positionsGreaterZero[i + 1].z + normalDirections1[i].z * offset];
            posi11 = [positionsGreaterZero[i + 1].x + normalDirections2[i + 1].x * offset, positionsGreaterZero[i + 1].z + normalDirections2[i + 1].z * offset];
            posi10 = [positionsGreaterZero[i + 1].x + normalDirections2[i].x * offset, positionsGreaterZero[i + 1].z + normalDirections2[i].z * offset];
            if (angles[i] < Math.PI) {
                newPoints1.push({
                    x: posi01[0],
                    y: terrain.getHeightOfPoint(posi01) + 0.1,
                    z: posi01[1]
                });

                newPoints1.push({
                    x: posi00[0],
                    y: terrain.getHeightOfPoint(posi00) + 0.1,
                    z: posi00[1]
                });

                newPoints2.push({
                    x: posi10[0],
                    y: terrain.getHeightOfPoint(posi10) + 0.1,
                    z: posi10[1]
                });

                newPoints2.push({
                    x: posi11[0],
                    y: terrain.getHeightOfPoint(posi11) + 0.1,
                    z: posi11[1]
                });

            } else {
                newPoints1.push({
                    x: posi00[0],
                    y: terrain.getHeightOfPoint(posi00) + 0.1,
                    z: posi00[1]
                });

                newPoints1.push({
                    x: posi01[0],
                    y: terrain.getHeightOfPoint(posi01) + 0.1,
                    z: posi01[1]
                });

                newPoints2.push({
                    x: posi11[0],
                    y: terrain.getHeightOfPoint(posi11) + 0.1,
                    z: posi11[1]
                });

                newPoints2.push({
                    x: posi10[0],
                    y: terrain.getHeightOfPoint(posi10) + 0.1,
                    z: posi10[1]
                });
            }
        }
        let pos0l = [positionsGreaterZero[positionsGreaterZero.length - 1].x + normalDirections1[normalDirections1.length - 1].x * offset, positionsGreaterZero[positionsGreaterZero.length - 1].z + normalDirections1[normalDirections1.length - 1].z * offset];
        let pos1l = [positionsGreaterZero[positionsGreaterZero.length - 1].x + normalDirections2[normalDirections2.length - 1].x * offset, positionsGreaterZero[positionsGreaterZero.length - 1].z + normalDirections2[normalDirections2.length - 1].z * offset];
        newPoints1.push({
            x: pos0l[0],
            y: terrain.getHeightOfPoint(pos0l) + 0.1,
            z: pos0l[1]
        });
        newPoints2.push({
            x: pos1l[0],
            y: terrain.getHeightOfPoint(pos1l) + 0.1,
            z: pos1l[1]
        });
        //console.log("!newPoints1");
        //console.log(newPoints1);
        //console.log("newPoints2");
        //console.log(newPoints2);

        let meshInScene1 = this.addLineToScene(newPoints1, material, metaData, uuid); // TODO delete this
        let meshInScene2 = this.addLineToScene(newPoints2, material, metaData, uuid); // TODO delete this

        /*///////////////////////////////////////// TODO implement Level Of Detail
        // Source: https://github.com/mrdoob/three.js/blob/master/examples/webgl_lod.html
        // Source: https://threejs.org/docs/index.html#api/en/objects/LOD
        let meshoriginal = this.generateLinesFromVertices(positions, material, offset, metaData);
        let mesh1 = this.generateLinesFromVertices(newPoints1, material, metaData);
        let mesh2 = this.generateLinesFromVertices(newPoints2, material, metaData);

        let parallelLines = new THREE.LOD();
        parallelLines.addLevel();
        // add 3 Layers:
        // 1: just one line
        parallelLines.addLevel(meshoriginal ,  );
        // 2: two parallel lines
        parallelLines.addLevel( ,  );
        // 3: two parallel lines + Querstreben
        parallelLines.addLevel( ,  );

        devos3d.scene.add(parallelLines);

        //////////////////////////////////////////////////////////////// */

        return [meshInScene1, meshInScene2];
    },

    normalizeVector: function (coords) {
        let length = Math.sqrt(coords.x * coords.x + coords.z * coords.z);
        let norm = {
            x: coords.x / length,
            z: coords.z / length
        };
        return norm;
    },

    findPositionOnTileFromWorldCoordinates: function (tileCoordinates) {
        let holeX = parseInt((parseFloat(tileCoordinates[0]) / devos3d.worldWidth) * devos3d.worldWidth);
        let holeZ = parseInt((parseFloat(tileCoordinates[1]) / devos3d.worldDepth) * devos3d.worldDepth);
        let tileX = Math.round(tileCoordinates[0]) - holeX;
        let tileZ = Math.round(tileCoordinates[1]) - holeZ;
        return [tileX, tileZ]
    },

    // returns length of street // TODO make it possible for 2d and 3d
    // worldBeginningCoordinates: Beginning of Segment, Coordinates in Format for displaying
    // worldEndCoordinates: End of Segment, Coordinates in Format for displaying
    // coordinates must have same dimension
    getLengthOfSegment: function (worldBeginningCoordinates, worldEndCoordinates) {
        //console.log(worldBeginningCoordinates);
        //console.log(worldEndCoordinates);
        let length = 0;
        let cl = 0; // currentLength
        for (let i = 0; i < worldBeginningCoordinates.length; i++) {
            cl = (worldEndCoordinates[i] - worldBeginningCoordinates[i]);
            length += cl * cl;
        }
        //console.log("length: " + length);
        return Math.sqrt(length);
    },

    // returns angle of street compared to the axis // just in 2D
    // worldBeginningCoordinates: Beginning of Segment, Coordinates in Format for displaying
    // worldEndCoordinates: End of Segment, Coordinates in Format for displaying
    // coordinates must have same dimension
    // https://stackoverflow.com/questions/19729831/angle-between-3-points-in-3d-space#19730129
    // https://stackoverflow.com/questions/15994194/how-to-convert-x-y-coordinates-to-an-angle
    getOrientationOfSegment: function (worldBeginningCoordinates, worldEndCoordinates) {
        let deltaX = worldEndCoordinates[1] - worldBeginningCoordinates[1];
        let deltaZ = worldEndCoordinates[0] - worldBeginningCoordinates[0];
        //var deltaX = worldBeginningCoordinates[1] - worldEndCoordinates[1];
        //var deltaZ = worldBeginningCoordinates[0] - worldEndCoordinates[0];
        let rad = Math.atan2(deltaZ, deltaX) * 180 / Math.PI; // In radians
        return rad;
    }, // */


    // TODO implement this: https://duckduckgo.com/?q=drawing+line+in+loop&t=ffab&ia=qa
    linedraw: function (firstPoint, secondPoint, uuid) {
        //console.log(uuid);
        let currentMesh = terrain.terrainTiles[uuid].mesh;
        let textureToDrawOn = terrain.terrainTiles[uuid].texture;
        let ax, az, bx, bz;
        if (firstPoint.x < secondPoint.x) {
            ax = firstPoint.x - currentMesh.position.x;
            az = firstPoint.z - currentMesh.position.z;
            bx = secondPoint.x - currentMesh.position.x;
            bz = secondPoint.z - currentMesh.position.z;
        } else {
            ax = secondPoint.x - currentMesh.position.x;
            az = secondPoint.z - currentMesh.position.z;
            bx = firstPoint.x - currentMesh.position.x;
            bz = firstPoint.z - currentMesh.position.z;
        }
        //TODO add for loop here
        let multiplier = (bz - az) / (bx - ax);
        let x, z;
        /*
        for (let i = ax; i < bx; i++) {
            x = i;
            z = i * multiplier;
            textureToDrawOn[x + parseInt(z) * terrain.planeSize] = 0;
            textureToDrawOn[x + parseInt(z) * terrain.planeSize + 1] = 0;
            textureToDrawOn[x + parseInt(z) * terrain.planeSize + 2] = 0;
        } //*/
        for (let i = 0; i < textureToDrawOn.length; i++) {
            textureToDrawOn[i] = 0;

        }
        //console.log(textureToDrawOn);
        //console.log(terrain.terrainTiles[uuid].texture);
        //console.log(terrain.terrainTiles[uuid].texture.image.dataset);
        //console.log(terrain.terrainTiles[uuid]);
        terrain.terrainTiles[uuid].mesh.material.map.needsUpdate = true;
        textureToDrawOn.needsUpdate = true;

    },

    // returns length of street // TODO make it possible for 2d and 3d
    // worldBeginningCoordinates: Beginning of Segment, Coordinates in Format for displaying
    // worldEndCoordinates: End of Segment, Coordinates in Format for displaying
    // coordinates must have same dimension
    getLengthOfWallPathPart: function (worldBeginningCoordinates, worldEndCoordinates) {
        //console.log(worldBeginningCoordinates);
        //console.log(worldEndCoordinates);
        let length = 0;
        let cl = 0; // currentLength
        for (let i = 0; i < worldBeginningCoordinates.length; i++) {
            cl = (worldEndCoordinates[i] - worldBeginningCoordinates[i]);
            length += cl * cl;
        }
        //console.log("length: " + length);
        return Math.sqrt(length);
    },

    // returns angle of street compared to the axis // just in 2D
    // worldBeginningCoordinates: Beginning of Segment, Coordinates in Format for displaying
    // worldEndCoordinates: End of Segment, Coordinates in Format for displaying
    // coordinates must have same dimension
    // https://stackoverflow.com/questions/19729831/angle-between-3-points-in-3d-space#19730129
    // https://stackoverflow.com/questions/15994194/how-to-convert-x-y-coordinates-to-an-angle
    getOrientationOfWall: function (worldBeginningCoordinates, worldEndCoordinates) {
        let deltaX = worldEndCoordinates[0] - worldBeginningCoordinates[0];
        let deltaY = worldEndCoordinates[1] - worldBeginningCoordinates[1];
        let rad = Math.atan2(deltaX, deltaY); // In radians
        //console.log(worldBeginningCoordinates);
        //console.log(worldEndCoordinates);
        //console.log(rad);

        return rad;
    },


    showBounds: function (leftRounded, bottomRounded, rightRounded, topRounded) {
        let firstPos = sceneObjects.transformCoordinatesToMap(bottomRounded, leftRounded);
        let options = {"diameter": 5};
        let rotate = {"x": 0, "y": 0, "z": 0};
        let metaData = "PUNKT METADATA";
        let material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
        let position = {
            "x": firstPos[0],
            "y": 125,
            "z": firstPos[1]
        };
        let point1 = sceneObjects.addPoint(position, rotate, options, material, metaData);

        let zweiPos = sceneObjects.transformCoordinatesToMap(topRounded, rightRounded);

        let material2 = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
        let position2 = {
            "x": zweiPos[0],
            "y": 150,
            "z": zweiPos[1]
        };
        let point2 = sceneObjects.addPoint(position2, rotate, options, material2, metaData);
        //console.log(point1);
        //console.log(point2);
    }
};