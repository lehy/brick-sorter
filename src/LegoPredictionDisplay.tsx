import React from 'react';
import TextField from "@material-ui/core/TextField";
import {Predictions, SinglePrediction} from "./LegoPred";

function LegoPredictionDisplay({predictions}: {predictions:Predictions}) {
  var items : React.ReactNode[] = [];
  predictions.forEach(function(pred: SinglePrediction, name : string) {
    var pred_text;
    if (pred.proba) {
      pred_text = `${pred.value} (${(pred.proba * 100).toFixed(0)})`;
    } else {
      pred_text = `${pred.value}`;
    }
    items.push(<TextField key={name} label={name} value={pred_text} />);
  });

  return <div>{items}</div>;
}

export default LegoPredictionDisplay;

