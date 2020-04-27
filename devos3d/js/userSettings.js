// user settings; can be toggled by the user
let userSettings = {
    allowUserToChangeSettings: false,
    loadFurtherTiles: true,// only works in combination with userSettings.overViewView is false
    overViewView: true, // hole map vs street view view

    showOpenStreetMaps: false,
    showProjectData: true,

    useRealGPS: false,
    showUserPosition: true, // only works in combination with userSettings.useRealGPS is true

    showLighting: true,

    nightMode: false,

    showDummyData: true, // used for orientation for the axis (for debugging purposes)

    // NOT IMPLEMENTED // SHOULD NOT BE CHANGED
    useCameraSensorsForOrientation: false,
    terrainIn3D: true, // 2d not implemented
    totalNumberOfTerrainLoadedPerAxis: 3, // Currently only works with 3

    updateSky: false,

    tags: { // stores the tags and it synonyms under which shapes on the map are drawn
        building: ["building"],
        highway: ["highway"],
        railway: ["railway"],
        waterway: ["waterway"],
        fixOSMObjects: ["fixOSMObjects"]
    }
};