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
  m_FaceAnalyserRef,
  setEmotionValues, //For displaying emotions in switches and sending to backend
}) => {
  useEffect(() => {
    //console.log('Image capture started.');

    if (videoRef.current && canvasRef.current) {
      const captureFrame = () => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d", { willReadFrequently: true });


        if (!context) {
          //console.error("Failed to get canvas context.");
          return;
        }

        context.drawImage(videoRef.current, 0, 0, mWidth, mHeight);
        const imageData = context.getImageData(0, 0, mWidth, mHeight).data;

        if (pixelsRef.current) {
          for (let i = 0; i < imageData.length; i++) {
            pixelsRef.current[i] = imageData[i];
          }
        } /* else {
          console.error("pixelsRef.current is not initialized.");
        } */

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
              const age = tmpAnalysisDataRef.current.get(0).getAge();
              const gender = tmpAnalysisDataRef.current.get(0).getGender();

              // Passing data to the CHAT -> all detected
              const newEmotionValues = {
                anger: emotionsArray[0],
                disgust: emotionsArray[1],
                fear: emotionsArray[2],
                happiness: emotionsArray[3],
                sadness: emotionsArray[4],
                surprise: emotionsArray[5],
                neutral: emotionsArray[6],
                age: age,
                gender: gender
              };


              //console.log('new emotions: ', newEmotionValues);
              setEmotionValues(newEmotionValues); 
              
              
            }
          }
        }

        setImageCaptured(true);
      };

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
    m_FaceAnalyserRef,
    setEmotionValues 
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
