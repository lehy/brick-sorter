import "onnxjs";
import { InferenceSession } from "onnxjs";
import React from "react";
import categories from "./categories.json";
import LegoImage from "./LegoImage";

export interface SinglePrediction {
  value: string;
  proba: number | null;
};

// export interface Predictions {
//   part: SinglePrediction;
//   color: SinglePrediction;
//   category: SinglePrediction;
//   size: SinglePrediction;
// };
export type Predictions = Map<string, SinglePrediction>;

export type OnPrediction = (predictions : Predictions) => void;

var dt_filtered = 50;
var dt_alpha = 0.9;
var num_step = 0;

function LegoPred({ image, session, onPrediction }:
                  { image: LegoImage | null,
                    session: InferenceSession | null, onPrediction: OnPrediction }) {

  function computeSinglePrediction({ output, category }:
                                   { output: number[]; category: string[]; }) : SinglePrediction {
    // console.log(`${cat}: ${output} ${category}`)
    var z = 0.;
    var best_i = 0;
    var best_logp = -1e12;
    for (let i = 0; i < output.length; ++i) {
      let logp = output[i];
      if (logp >= best_logp) {
        best_i = i;
        best_logp = logp;
      }
      z += Math.exp(logp);
    }
    let best_p : number = Math.exp(best_logp) / z;
    let best_cat = category[best_i];
    // let p_percent = (best_p * 100).toFixed(0);
    // console.log(`${cat}: ${best_cat} (${best_p})`);
    // return `${best_cat} (${p_percent}%)`;
    return {value: best_cat, proba: best_p};
  };

  function reportNetworkOutputs(outputs: any, dt: number) {
    // console.log(outputs);
    // var outputs_merged = [];
    let preds : Predictions = new Map<string, SinglePrediction>();
    for (let o of outputs) {
      let cat_name = o[0];
      let cats = categories[cat_name as keyof typeof categories]; // arf
      let logits = o[1].data;
      let pred = computeSinglePrediction({output: logits, category: cats});
      preds.set(cat_name, pred);
    }
    preds.set("dt", {value:`${dt.toFixed(0)} ms`, proba: null});
    onPrediction(preds);
  };
  
  async function processImage(image : LegoImage) {
    if (! session) {
      console.log("LegoPred: no session");
      return;
    }
    let t0 = performance.now();
    const tensor = new onnx.Tensor(image.rgb_chw, 'float32', [1, 3, image.height, image.width]);
    // if (num_step < 5) {
    //   console.log(tensor);
    // }
    var outputs;
    try {
      outputs = await session.run([tensor]);
      // console.log(output);
    } catch (e) {
      console.log("error running session:");
      console.log(e);
      if (!e.message.includes("session not initialized")) {
        throw e;
      }
    }
    let t1 = performance.now();
    let dt = t1 - t0;
    dt_filtered = dt_alpha * dt_filtered + (1 - dt_alpha) * dt;
    // let dtfs = dt_filtered.toFixed(0);
    // if ((num_step % 10 * 60) === 0) {
    //   console.log(`inference: ${dtfs} ms`);
    // }
    num_step += 1;

    reportNetworkOutputs(outputs, dt_filtered);
  }

  React.useEffect(() => {
    // console.log("computing pred")
    if (image && session) {
      processImage(image);
    } else {
      console.log("no image or no session: no pred");
    }
  }, [image, session]);

  return <></>;
}

export default LegoPred;
