import React from 'react';
// import logo from './logo.svg';
import './App.css';
// import Webcam from "react-webcam";
import "onnxjs";
import Paper from "@material-ui/core/Paper";
import CssBaseline from '@material-ui/core/CssBaseline';
import LegoInferenceSession from "./LegoInferenceSession";
import LegoInference from "./LegoInference";
import LegoBackendSelector from "./LegoBackendSelector";
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { InferenceSession } from 'onnxjs';

const usePaperStyles = makeStyles((theme: Theme) =>
                             createStyles({
                               root: {
                                 display: 'flex',
                                 flexWrap: 'wrap',
                                 '& > *': {
                                   margin: theme.spacing(1),
                                   padding: theme.spacing(1),
                                   width: theme.spacing(48),
                                   // height: theme.spacing(48)
                                 },
                               },
                             }),
                            );

function App() {
  let [session, setSession] = React.useState<InferenceSession | null>(null);
  // let backend = undefined; //"webgl";
  let [backend, setBackend] = React.useState("webgl");
  
  const classes = usePaperStyles();

  return (
      <div className="App">
      <CssBaseline />
      <LegoInferenceSession backend={backend} onSessionInitialized={setSession} />
      
      <div className={classes.root}>
      <Paper>
      <LegoInference session={session} />
      
      <LegoBackendSelector backend={backend} onBackendChanged={setBackend} />
      </Paper>
      </div>
      
      </div>
  );
}

export default App;
