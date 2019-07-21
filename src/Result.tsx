import React from 'react';
import './Result.css';
import {Link, RouteComponentProps} from "react-router-dom";
import {Button, Typography} from '@material-ui/core'

export interface ResultProps extends RouteComponentProps {
  qrData: string;
}

export const Result: React.FunctionComponent<ResultProps> = (props) => {
  if (!props.qrData) {
    props.history.push({
      pathname: '/',
    });
  }

  function openUrl() {
    window.open(props.qrData, '_blank', 'noopener')
  }

  const isUrl = /^https?:\/\//.test(props.qrData);
  const buttonOpenUrl = <Button onClick={openUrl}>Open URL</Button>;

  return (
    <div className="Result">
      <Typography color="textSecondary" gutterBottom>
        QR code data
      </Typography>
      <Typography variant="h5" component="h2">
        {props.qrData}
      </Typography>

      <Link to="/qr-code" className="scan-again-link">
        <Button variant="contained" color="primary">Scan again</Button>
      </Link>

      {isUrl && buttonOpenUrl}
    </div>
  )
};

