import React from "react";
import LegoCam from "./LegoCam";
import LegoPredictionDisplay from "./LegoPredictionDisplay";
import LegoPred, { Predictions } from "./LegoPred";
import { InferenceSession } from 'onnxjs';
import LegoImage from "./LegoImage";

function LegoInferencePredBlock({image, session}:
                                {image:LegoImage|null,
                                 session:InferenceSession|null}) {
  let [prediction, setPrediction] = React.useState<Predictions>(new Map());

  return (<>
          <LegoPred image={image}
          onPrediction={setPrediction} session={session} />
          <LegoPredictionDisplay predictions={prediction} />
          </>);
}

function LegoInference({session}:{session : InferenceSession | null}) {
  let [image, setImage] = React.useState<LegoImage | null>(null);

  return (<>
          <LegoCam onImage={setImage} height={224} />
          <LegoInferencePredBlock image={image} session={session} />
          </>);
}

export default LegoInference;
