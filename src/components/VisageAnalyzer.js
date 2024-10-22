import React, { useState, useRef, useEffect } from "react";
import VisageLoader from "./VisageLicenceLoad";
import ImageCapture from "./ImageCapture"; 

const VisageAnalyzer = () => {
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageCaptured, setImageCaptured] = useState(false); // State to track if the image has been captured
  const [isRecording,setRecording] = useState(false);

  // References to mutable objects
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

        // Init tracker object
        m_Tracker.current = new window.VisageModule.VisageTracker("Head Tracker.cfg");
        //tmpAnalysisDataRef.current = new window.VisageModule.AnalysisData();

        // Allocate memory for ppixels using VisageModule -> pointer
        ppixelsRef.current = window.VisageModule._malloc(mWidth * mHeight * 4);
        pixelsRef.current = new Uint8ClampedArray(
          window.VisageModule.HEAPU8.buffer,
          ppixelsRef.current,
          mWidth * mHeight * 4
        );

        // creation of objects used in ImageCapture
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

  // Start video stream from the user's camera
  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setRecording(true);
        }
      } catch (error) {
        console.error("Error accessing the camera: ", error);
      }
    };

    getCameraStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        console.log('Cleaning up streams');
      }
    };
  },[stream]);

  return (
    <div>
      {/* Video element to display the camera stream */}
      <video ref={videoRef} autoPlay style={{display : 'none'}}></video>

      {/* ImageCapture component to handle the canvas drawing and analysis */}
      { isRecording && <ImageCapture
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
      />}
    </div>
  );
};

export default VisageAnalyzer;
