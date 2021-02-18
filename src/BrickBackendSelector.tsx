import React from 'react';
import {FormControl, FormLabel, RadioGroup, Radio, FormControlLabel} from '@material-ui/core';

type OnBackendChanged = (backend : string) => void;

function BrickBackendSelector({backend, onBackendChanged} : {backend: string, onBackendChanged: OnBackendChanged}) {

  let onChange = (_ : any, backend : string) => {
    onBackendChanged(backend);
  };
  
  return (<FormControl component="fieldset">
          <FormLabel component="legend">Backend</FormLabel>
          <RadioGroup aria-label="backend" name="backend" value={backend} onChange={onChange}>
          <FormControlLabel value="webgl" control={<Radio />} label="webgl" />
          <FormControlLabel value="cpu" control={<Radio />} label="cpu" />
          <FormControlLabel value="wasm" control={<Radio />} label="Wasm" />
          </RadioGroup>
          </FormControl>);
}

export default BrickBackendSelector;
