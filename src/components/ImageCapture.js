import React, { useEffect, useRef } from 'react';

const ImageCapture = ({
  videoRef,
  imageCaptured,
  setImageCaptured,
  canvasRef,
  mWidth,
  mHeight,
  pixelsRef,
  ppixelsRef,
  m_Tracker,
  TfaceDataArrayRef,
  tmpAnalysisDataRef,
  m_FaceAnalyserRef
}) => {
  useEffect(() => {
    console.log('Image capture started.');

    // Ensure video and canvas references are present and that image hasn't already been captured
    if (videoRef.current && canvasRef.current && !imageCaptured) {
      const captureFrame = () => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");

        // Check if context was successfully retrieved
        if (!context) {
          console.error("Failed to get canvas context.");
          return;
        }

        // Draw video frame onto canvas
        context.drawImage(videoRef.current, 0, 0, mWidth, mHeight);

        // Extract pixel data from the canvas
        const imageData = context.getImageData(0, 0, mWidth, mHeight).data;

        // Populate pixelsRef with imageData
        if (pixelsRef.current) {
          for (let i = 0; i < imageData.length; i++) {
            pixelsRef.current[i] = imageData[i];
          }
        } else {
          console.error("pixelsRef.current is not initialized.");
        }

        // Confirm if ppixelsRef and m_Tracker are set before tracking
        if (ppixelsRef.current && m_Tracker.current) {
          const trackerReturnState = m_Tracker.current.track(
            mWidth,
            mHeight,
            ppixelsRef.current,
            TfaceDataArrayRef.current,
            window.VisageModule.VisageTrackerImageFormat.VISAGE_FRAMEGRABBER_FMT_RGBA.value,
            window.VisageModule.VisageTrackerOrigin.VISAGE_FRAMEGRABBER_ORIGIN_TL.value
          );

          const options = 
            window.VisageModule.VFAFlags.VFA_EMOTION.value |
            window.VisageModule.VFAFlags.VFA_GENDER.value |
            window.VisageModule.VFAFlags.VFA_AGE.value;

          if (trackerReturnState[0] === window.VisageModule.VisageTrackerStatus.TRACK_STAT_OK.value) {
            const status = m_FaceAnalyserRef.current.analyseImage(
              mWidth,
              mHeight,
              ppixelsRef.current,
              TfaceDataArrayRef.current.get(0),
              options,
              tmpAnalysisDataRef.current.get(0)
            );

            if (tmpAnalysisDataRef.current.get(0).getEmotionsValid()) {
              const emotionsArray = Array.from(
                tmpAnalysisDataRef.current.get(0).getEmotionProbabilities()
              );
              console.log("ANGER:", emotionsArray[0]);
              console.log("DISGUST:", emotionsArray[1]);
              console.log("FEAR:", emotionsArray[2]);
              console.log("HAPPINESS:", emotionsArray[3]);
              console.log("SADNESS:", emotionsArray[4]);
              console.log("SURPRISE:", emotionsArray[5]);
              console.log("NEUTRAL:", emotionsArray[6]);
            }

            console.log("Age:", tmpAnalysisDataRef.current.get(0).getAge());
            console.log("Gender:", tmpAnalysisDataRef.current.get(0).getGender());
          }
        }

        // Set imageCaptured to true to prevent multiple captures
        setImageCaptured(true);
      };

      // Add delay to ensure video is ready before capturing
      setTimeout(captureFrame, 500);
    }
  }, [
    videoRef,
    canvasRef,
    imageCaptured,
    mWidth,
    mHeight,
    pixelsRef,
    ppixelsRef,
    m_Tracker,
    TfaceDataArrayRef,
    tmpAnalysisDataRef,
    m_FaceAnalyserRef
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={mWidth}
      height={mHeight}
      style={{ display: "none" }}
    />
  );
};

export default ImageCapture;
