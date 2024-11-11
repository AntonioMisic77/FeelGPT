import React, { useState, useRef, useEffect } from "react";
import ImageCapture from "./ImageCapture";  // Ensure ImageCapture is imported correctly
import "../styles/visageAnalyzer.css";

const VisageAnalyzer = ({
  videoRef,
  canvasRef,
  imageCaptured,
  setImageCaptured,
  mWidth,
  mHeight,
  pixelsRef,
  ppixelsRef,
  m_Tracker,
  TfaceDataArrayRef,
  tmpAnalysisDataRef,
  m_FaceAnalyserRef,
}) => {
  useEffect(() => {
    const initializeVisage = () => {
      if (window.VisageModule) {
        const licenseName = "596-415-364-170-725-752-183-283-483-532-575.vlc";
        window.VisageModule.initializeLicenseManager(licenseName);

        m_Tracker.current = new window.VisageModule.VisageTracker("Head Tracker.cfg");
        ppixelsRef.current = window.VisageModule._malloc(mWidth * mHeight * 4);
        pixelsRef.current = new Uint8ClampedArray(
          window.VisageModule.HEAPU8.buffer,
          ppixelsRef.current,
          mWidth * mHeight * 4
        );

        m_FaceAnalyserRef.current = new window.VisageModule.VisageFaceAnalyser();
        TfaceDataArrayRef.current = new window.VisageModule.FaceDataVector();
        for (let i = 0; i < 1; ++i) {
          TfaceDataArrayRef.current.push_back(new window.VisageModule.FaceData());
        }
        tmpAnalysisDataRef.current = new window.VisageModule.AnalysisDataVector();
        for (let i = 0; i < 1; ++i) {
          tmpAnalysisDataRef.current.push_back(new window.VisageModule.AnalysisData());
        }

        console.log("VisageModule and Tracker initialized");
      }
    };

    initializeVisage();
  }, []);

  return (
    <div>
      {/* Now the logic is handled by the Chat component */}
      {/* <ImageCapture
        videoRef={videoRef}
        canvasRef={canvasRef}
        imageCaptured={imageCaptured}
        setImageCaptured={setImageCaptured}
        mWidth={mWidth}
        mHeight={mHeight}
        pixelsRef={pixelsRef}
        ppixelsRef={ppixelsRef}
        m_Tracker={m_Tracker}
        TfaceDataArrayRef={TfaceDataArrayRef}
        tmpAnalysisDataRef={tmpAnalysisDataRef}
        m_FaceAnalyserRef={m_FaceAnalyserRef}
      /> */}
    </div>
  );
};

export default VisageAnalyzer;
