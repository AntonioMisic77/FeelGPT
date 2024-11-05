import React, { useState, useRef, useEffect } from "react";
import VisageLoader from "./VisageLicenceLoad";
import ImageCapture from "./ImageCapture"; 
import "../styles/visageAnalyzer.css";

const VisageAnalyzer = ({ videoRef }) => {
  const [stream, setStream] = useState(null);
  const canvasRef = useRef(null);
  const [imageCaptured, setImageCaptured] = useState(false); 
  const [isRecording, setRecording] = useState(false);
  const [isRecordingVideo, setRecordingVideo] = useState(false);

  const ppixelsRef = useRef(null);
  const pixelsRef = useRef(null);
  const m_Tracker = useRef(null);
  const TfaceDataArrayRef = useRef(null);
  const tmpAnalysisDataRef = useRef(null);
  const m_FaceAnalyserRef = useRef(null);

  const mWidth = 640;
  const mHeight = 480;

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
      {/* Video element to display the camera stream */}

      {/* ImageCapture component to handle the canvas drawing and analysis */}
      <ImageCapture
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
      />
    </div>
  );
};

export default VisageAnalyzer;
