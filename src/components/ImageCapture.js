import React, { useEffect, useRef } from 'react';

const ImageCapture = ({ videoRef, imageCaptured, setImageCaptured, canvasRef, mWidth, mHeight, pixelsRef, ppixelsRef, m_Tracker, TfaceDataArrayRef, tmpAnalysisDataRef, m_FaceAnalyserRef }) => {
  // Capture a single frame from the video, extract pixel data, and perform tracking
  useEffect(() => {
    if (videoRef.current && canvasRef.current && !imageCaptured) {
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
          //console.log('trackerReturnState:', trackerReturnState[0]);
          //console.log('TfaceDataArrayRef.current.get(0): ', TfaceDataArrayRef.current.get(0))

          // Analyze the face using the face analyzer -> if tracker is 1, then it is ok, if 3 face is not found!
          var options = 0;
          options |= window.VisageModule.VFAFlags.VFA_EMOTION.value;
          options |= window.VisageModule.VFAFlags.VFA_GENDER.value;
          options |= window.VisageModule.VFAFlags.VFA_AGE.value;

          if (trackerReturnState[0] === window.VisageModule.VisageTrackerStatus.TRACK_STAT_OK.value) {
            const status = m_FaceAnalyserRef.current.analyseImage(
              mWidth,
              mHeight,
              ppixelsRef.current,
              TfaceDataArrayRef.current.get(0),
              options,   //window.VisageModule.VFAFlags.VFA_EMOTION.value,   -> only for emotions
              tmpAnalysisDataRef.current.get(0)
            );
            //console.log("AnalyseImage status:", status);
            //console.log('options: ',window.VisageModule.VFAFlags.VFA_EMOTION.value);
            //console.log('tmpAnalysisDataRef.current.get(0): ', tmpAnalysisDataRef.current.get(0))

            let emotionsArray = [];
            
            //console.log('tmpAnalysisDataRef.current.getEmotionsValid(): ', tmpAnalysisDataRef.current.get(0).getEmotionsValid());
            if (tmpAnalysisDataRef.current.get(0).getEmotionsValid()) {
              const emotions = tmpAnalysisDataRef.current.get(0);
              emotionsArray = Array.from(emotions.getEmotionProbabilities());
              console.log("Emotions Array: ", emotionsArray);
            }

            //console.log("Age valid: ",tmpAnalysisDataRef.current.get(0).getAgeValid());
            console.log("Age: ",tmpAnalysisDataRef.current.get(0).getAge());
            //console.log("Gender valid: ",tmpAnalysisDataRef.current.get(0).getGenderValid());
            console.log("Gender: ",tmpAnalysisDataRef.current.get(0).getGender());
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
      style={{ display: "none" }}  
    ></canvas>
  );
};

export default ImageCapture;
