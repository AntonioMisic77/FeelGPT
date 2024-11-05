import { useEffect } from "react";

const VisageLoader = () => {
  useEffect(() => {
    // Check if the VisageModule has already been initialized globally
    if (!window.visageSDKLoaded) {
      console.log("Visage SDK script is not loaded, loading it now.");

      const licenseName = "596-415-364-170-725-752-183-283-483-532-575.vlc";
      const licenseURL = "/lib/596-415-364-170-725-752-183-283-483-532-575.vlc";

      const locateFile = (dataFileName) => {
        return "/lib/" + dataFileName;
      };

      window.VisageModule = {
        locateFile: locateFile,
        preRun: [
          function () {
            window.VisageModule.FS_createPreloadedFile(
              "/",
              "Facial Features Tracker.cfg",
              "/lib/Facial Features Tracker.cfg",
              true,
              false
            );
            window.VisageModule.FS_createPreloadedFile(
              "/",
              "Facial Features Tracker - With Ears.cfg",
              "/lib/Facial Features Tracker - With Ears.cfg",
              true,
              false
            );
            window.VisageModule.FS_createPreloadedFile(
              "/",
              "Head Tracker.cfg",
              "/lib/Head Tracker.cfg",
              true,
              false
            );
            window.VisageModule.FS_createPreloadedFile(
              "/",
              "Face Detector.cfg",
              "/lib/Face Detector.cfg",
              true,
              false
            );
            window.VisageModule.FS_createPreloadedFile(
              "/",
              "NeuralNet.cfg",
              "/lib/NeuralNet.cfg",
              true,
              false
            );
            window.VisageModule.FS_createPreloadedFile(
              "/",
              licenseName,
              licenseURL,
              true,
              false,
              function () {
                console.log("License file successfully loaded.");
              },
              function () {
                alert("Loading License Failed!");
              }
            );
          },
        ],
        //onRuntimeInitialized: onModuleInitialized // Add callback if needed
      };

      const script = document.createElement("script");
      script.id = "visageSDKScript";
      script.src = "/lib/visageSDK.js";
      script.async = true;
      document.body.appendChild(script);

      const analysisScript = document.createElement("script");
      analysisScript.id = "visageAnalysisDataScript";
      analysisScript.src = "/lib/VisageAnalysisData.js";
      analysisScript.async = true;
      document.body.appendChild(analysisScript);

      // Mark the SDK as loaded globally to prevent reloading
      window.visageSDKLoaded = true;
    } else {
      console.log("Visage SDK script has already been loaded.");
    }

    return () => {};
  }, []);

  return null;
};

export default VisageLoader;
