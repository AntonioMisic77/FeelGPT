import React, { useEffect, useRef } from 'react';

const ImageCapture = ({ videoRef, imageCaptured, setImageCaptured, canvasRef, mWidth, mHeight, pixelsRef, ppixelsRef, m_Tracker, TfaceDataArrayRef, tmpAnalysisDataRef, m_FaceAnalyserRef }) => {
  // Capture a single frame from the video, extract pixel data, and perform tracking
  useEffect(() => {
    if (videoRef.current && canvasRef.current && !imageCaptured) {
      // TASK: why this code goes twice? (output in console.log)
      const captureFrame = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        // Draw video frame onto canvas
        context.drawImage(videoRef.current, 0, 0, mWidth, mHeight);

        // Access pixel data from the canvas
        const imageData = context.getImageData(0, 0, mWidth, mHeight).data;

        // copy imageData into pixelsRef.current
        if (pixelsRef.current) {
          for(let i=0; i<imageData.length; i+=1)
            {
              pixelsRef.current[i] = imageData[i];
            }
        } else {
          console.error("pixelsRef.current is not initialized.");
        }

        console.log("ppixelsRef.current:", ppixelsRef.current); 

        // Perform tracking if m_Tracker is initialized
        if (m_Tracker.current) {
          console.log("set Tracker");
          const trackerReturnState = m_Tracker.current.track(
            mWidth,
            mHeight,
            ppixelsRef.current, 
            TfaceDataArrayRef.current,
            window.VisageModule.VisageTrackerImageFormat.VISAGE_FRAMEGRABBER_FMT_RGBA.value,
            window.VisageModule.VisageTrackerOrigin.VISAGE_FRAMEGRABBER_ORIGIN_TL.value
          );
          console.log('trackerReturnState:', trackerReturnState[0]);
          console.log('TfaceDataArrayRef.current.get(0): ', TfaceDataArrayRef.current.get(0))

          // Analyze the face using the face analyzer -> if tracker is 1, then it is ok -> 3 is on the first message (needs to be 1)!
          // TASK: if it is 3, take another picture?
          if (trackerReturnState[0] === window.VisageModule.VisageTrackerStatus.TRACK_STAT_OK.value) {
            const status = m_FaceAnalyserRef.current.analyseImage(
              mWidth,
              mHeight,
              ppixelsRef.current,
              TfaceDataArrayRef.current.get(0),
              window.VisageModule.VFAFlags.VFA_EMOTION.value,
              tmpAnalysisDataRef.current.get(0)
            );
            console.log("AnalyseImage status:", status);
            console.log('options: ',window.VisageModule.VFAFlags.VFA_EMOTION.value);
            console.log('tmpAnalysisDataRef.current.get(0): ', tmpAnalysisDataRef.current.get(0))

            let emotionsArray = [];
            
            console.log('tmpAnalysisDataRef.current.getEmotionsValid(): ', tmpAnalysisDataRef.current.get(0).getEmotionsValid());
            if (tmpAnalysisDataRef.current.get(0).getEmotionsValid()) {
              const emotions = tmpAnalysisDataRef.current.get(0);
              emotionsArray = Array.from(emotions.getEmotionProbabilities());
              console.log("Emotions Array: ", emotionsArray);
            }

            // console.log("Age valid: ",tmpAnalysisDataRef.current.get(0).getAgeValid());
            // console.log("Age: ",tmpAnalysisDataRef.current.get(0).getAge());
            // console.log("Gender valid: ",tmpAnalysisDataRef.current.get(0).getGenderValid());
            // console.log("Gender: ",tmpAnalysisDataRef.current.get(0).getGender());
          }
        }

        // Set imageCaptured to true to prevent capturing multiple images
        setImageCaptured(true);
      };

      // Capture the frame after a slight delay to ensure the video is ready
      setTimeout(captureFrame, 500); // Wait 500ms to capture the frame
    }
  }, [videoRef, canvasRef, imageCaptured, mWidth, mHeight, pixelsRef, ppixelsRef, m_Tracker, TfaceDataArrayRef, tmpAnalysisDataRef, m_FaceAnalyserRef]);

  return (
    <canvas
      ref={canvasRef}
      width={mWidth}
      height={mHeight}
    ></canvas>
  );
};

export default ImageCapture;
