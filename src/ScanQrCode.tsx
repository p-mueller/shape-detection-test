import React from 'react';
import './ScanQrCode.css';
import {RouteComponentProps} from "react-router";

export interface ScanQrCodeProps extends RouteComponentProps {
  setQrData: (result: string) => void;
}

export class ScanQrCode extends React.Component<ScanQrCodeProps> {
  videoElement?: HTMLVideoElement;
  canvasContext?: CanvasRenderingContext2D;
  canvasElementRef: React.RefObject<HTMLCanvasElement>;
  barcodeDetector?: any;
  mediaStream?: MediaStream;
  stopped = false;

  constructor(props: any) {
    super(props);

    this.canvasElementRef = React.createRef<HTMLCanvasElement>();
    this.barcodeDetector = new ((window as any).BarcodeDetector as any)();
  }

  async componentDidMount(): Promise<void> {
    try {
      this.createCanvasContext();
      await this.initVideo();
      await this.run();
    }
    catch (e) {
      alert(e);
      this.stopped = true;
    }
  }

  componentWillUnmount(): void {
    if (this.mediaStream) {
      for (const track of this.mediaStream.getTracks()) {
        track.stop();
      }
    }

    if (this.videoElement) {
      this.videoElement.pause();
    }

    this.stopped = true;
  }

  createCanvasContext() {
    if (this.canvasElementRef.current == null) {
      throw new Error("Canvas not set")
    }

    const canvas = this.canvasElementRef.current.getContext('2d');
    if (!canvas) {
      throw new Error("Failed to create canvas context")
    }

    this.canvasContext = canvas;
  }

  async initVideo() {
    const constraints = {video: {facingMode: 'environment'}};
    this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

    this.videoElement = document.createElement('video');
    this.videoElement.srcObject = this.mediaStream;
    this.videoElement.autoplay = true;
    this.videoElement.onloadedmetadata = () => {
      if (!this.canvasElementRef.current || !this.videoElement) {
        return;
      }

      const canvasElementHeight = this.canvasElementRef.current.offsetHeight;
      const canvasElementWidth = this.canvasElementRef.current.offsetWidth;

      const aspectRation = canvasElementWidth / canvasElementHeight;

      const canvasWidth = this.videoElement.videoHeight * aspectRation;
      const canvasHeight = this.videoElement.videoHeight;

      this.canvasElementRef.current.width = canvasWidth;
      this.canvasElementRef.current.height = canvasHeight;
    };
  }

  async run() {
    requestAnimationFrame(() => this.renderVideo());

    while (!this.stopped) {
      await this.detectBarcode();
    }
  }

  async renderVideo() {
    if (!this.canvasElementRef.current || !this.videoElement || !this.canvasContext) {
      return;
    }

    const canvas = this.canvasElementRef.current;

    this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    this.canvasContext.drawImage(this.videoElement,
      (this.videoElement.videoWidth - canvas.width) / 2,
      0,
      canvas.width,
      canvas.height,
      0,
      0,
      canvas.width,
      canvas.height);

    if (!this.stopped) {
      requestAnimationFrame(() => this.renderVideo())
    }
  }

  async detectBarcode(): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 300));

    if (this.videoElement == null || this.videoElement.paused) {
      return;
    }

    try {
      const detectedBarcodes = await this.barcodeDetector.detect(this.videoElement);

      for (const detectedBarcode of detectedBarcodes) {
        console.log('Detected barcode', detectedBarcode);

        this.props.setQrData(detectedBarcode.rawValue);
        this.props.history.push({ pathname: '/result' });
      }
    } catch (e) {
      console.error('Error in detect barcode', e);
    }
  }

  render() {
    return (
      <div className="ScanQrCode">
        <div className="overlay">
          <div className="inner">
          </div>
        </div>

        <div className="info">
          <span>
            Position the QR code in the center of the screen
          </span>
        </div>

        <canvas ref={this.canvasElementRef}/>
      </div>
    );
  }
}

