import React from 'react';
import {BrowserRouter, Route} from "react-router-dom";
import {Start} from "./Start";
import {ScanQrCode} from "./ScanQrCode";
import {Result} from "./Result";

import './App.css'

export default class App extends React.Component {
  constructor(props: any) {
    super(props);
  }

  state = {
    qrData: ''
  };

  setQrData(result: string): void {
    this.setState({
      qrData: result
    });
  };

  render() {
    return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <div className="App-container">
          <Route exact path="/" component={Start}/>

          <Route path="/qr-code"
                 render={props => <ScanQrCode {...props} setQrData={((data: any) => this.setQrData(data))}/>}/>

          <Route path="/result" render={props => <Result {...props} qrData={this.state.qrData}/>}/>
        </div>
      </BrowserRouter>
    )
  }

}

