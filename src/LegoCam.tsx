import React from 'react';
import Webcam from "react-webcam";
import LegoImage from "./LegoImage";

type OnImage = (image: LegoImage) => void;

function LegoCam({ onImage, height }: { onImage: OnImage; height: number; }) {
  const webcamRef = React.useRef<Webcam>(null);
  
  const handleRawData = () => {
    // console.log("data is available!");
    if (!webcamRef.current) {
      console.log("no webcam ref yet");
      return;
    }
    const webcam: Webcam = webcamRef.current;
    const canvas = webcam.getCanvas(); // { width: width, height: height });
    if (!canvas) {
      console.log("no canvas");
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log("no canvas context");
      return;
    }
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // data is a single dimensional array of RGBA values, given by
    // rows (C-style).
    // Convert to a channels x width x height single-dim array.
    const rgb_array = Array(data.width * data.height * 3).fill(0);
    const plane = data.width * data.height;
    for (var i = 0; i < data.height; ++i) {
      for (var j = 0; j < data.width; ++j) {
        for (var chan = 0; chan < 3; ++chan) {
          rgb_array[plane * chan + data.width * i + j] = data.data[4 * (data.width * i + j) + chan] / 255.;
        }
      }
    }
    // console.log("handleRawData: calling onImage()");
    let image = {rgb_chw: rgb_array, width: data.width, height: data.height};
    onImage(image);
  };
  
  function handleData() {
    // console.log("handleData(): calling handleRawData()");
    try {
      handleRawData();
      // console.log("handleRawData finished, scheduling one for later")
      setTimeout(() => handleData(), 200);
    } catch (e) {
      console.log("handleDrawData raised an exception, not scheduling anymore");
    }
  };

  function startHandleData() {
    // console.log("------------- start handleData()");
    handleData();
  }
  
  // React.useCallback(handleData, [onImage, webcamRef, handleData, handleRawData]);
  React.useEffect(startHandleData, []);

  let videoConstraints = {
    facingMode: "environment"
  };
  
  return <Webcam audio={false} ref={webcamRef} videoConstraints={videoConstraints}
  //onUserMedia={handleData}
  height={height} / >;
}

export default LegoCam;
