import "onnxjs";
import React from 'react';
import { InferenceSession } from "onnxjs";

type OnSessionInitialized = (session:InferenceSession) => void;

// var initialized = false;

function LegoInferenceSession({backend, onSessionInitialized} : {backend?: string, onSessionInitialized: OnSessionInitialized}) {
  async function init() {
    console.log(`creating session`);
    var session;
    if (backend) {
      console.log(`- creating session with backend ${backend}`);
      session = new onnx.InferenceSession({backendHint: backend});
    } else {
      console.log(`- creating session with no backend hint`);
      session = new onnx.InferenceSession();
    };
    
    const url = "./model.onnx";
    await session.loadModel(url);

    console.log("session is initialized");
    console.log(session);
    onSessionInitialized(session);
  };

  // if (!initialized) {
  React.useEffect(() => {
    console.log("initializing session");
    init();
  }, [backend, onSessionInitialized]);
  // initialized = true;
  // } else {
  // console.log("attempt to reinitialize session!");
  // }
  return <></>;
};

export default LegoInferenceSession;
