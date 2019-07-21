import React from 'react';
import './Start.css';
import {Link} from "react-router-dom";
import {Button} from '@material-ui/core'
import {Typography} from '@material-ui/core'

export const Start: React.FunctionComponent = (props) => {
  const isSupported = !!(window as any).BarcodeDetector;

  const notSupportedText = <p className="error">
    Your browser does not support Shape Detection API. If you are using chrome on android enable
    Experimental Web Platform features.
  </p>;

  return (
    <div className="Start">
      <Typography variant="h3" component="h2">
        Shape Detection API test
      </Typography>

      {!isSupported && notSupportedText}

      <Link to="/qr-code">
        <Button variant="contained" type="button" color="primary">
          Scan QR-Code
        </Button>
      </Link>
    </div>
  )
};
