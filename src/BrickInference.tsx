import React from "react";
import BrickCam from "./BrickCam";
import BrickPredictionDisplay from "./BrickPredictionDisplay";
import BrickPred, { Predictions } from "./BrickPred";
import { InferenceSession } from 'onnxjs';
import BrickImage from "./BrickImage";

function BrickInferencePredBlock({image, session}:
                                {image:BrickImage|null,
                                 session:InferenceSession|null}) {
  let [prediction, setPrediction] = React.useState<Predictions>(new Map());

  return (<>
          <BrickPred image={image}
          onPrediction={setPrediction} session={session} />
          <BrickPredictionDisplay predictions={prediction} />
          </>);
}

function BrickInference({session}:{session : InferenceSession | null}) {
  let [image, setImage] = React.useState<BrickImage | null>(null);

  return (<>
          <BrickCam onImage={setImage} height={224} />
          <BrickInferencePredBlock image={image} session={session} />
          </>);
}

export default BrickInference;
