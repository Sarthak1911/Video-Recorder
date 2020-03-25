import React, { Component } from "react";
import { SingleSelect } from "./components/Select";
import { Checkbox } from "./components/Checkbox";
import "./App.css";
class App extends Component {
  constructor(props) {
    super(props);
    //array to record the stream
    this.blobs = [];
    //media recorder
    //make it global so all functions can access it
    this.mediaRecorder = null;
    //initialize the stream
    this.stream = null;

    this.state = {
      cameras: [],
      microphones: [],
      audioOn: true,
      videoOn: true,
      selectedCamera: null,
      selectedMicrophone: null,
      isTesting: false,
      isRecording: false
    };

    this.playbackVideo = React.createRef();
  }

  async componentDidMount() {
    //get all the video and audio devices
    const { cameras, microphones } = await this.getAllConnectedInputDevices();
    //select the first camera as default
    const selectedCamera = cameras[0].deviceId;
    //select the first microphone as default
    const selectedMicrophone = microphones[0].deviceId;
    this.setState({
      cameras,
      selectedCamera,
      microphones,
      selectedMicrophone
    });

    /***********NEED TO LISTEN TO CHANGES IN THE MEDIA DEVICES */
  }

  //media devices
  getAllConnectedDevices = async type => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === type);
  };

  getAllConnectedInputDevices = async () => {
    const cameras = await this.getAllConnectedDevices("videoinput");
    const microphones = await this.getAllConnectedDevices("audioinput");
    return { cameras, microphones };
  };

  getStreamReady = async () => {
    const { selectedCamera, selectedMicrophone, audioOn, videoOn } = this.state;

    const constraints = {
      video: videoOn ? { deviceId: selectedCamera } : videoOn,
      audio: audioOn
        ? { deviceId: selectedMicrophone, echoCancellation: true }
        : audioOn
    };

    return await navigator.mediaDevices.getUserMedia(constraints);
  };

  startRecording = async () => {
    try {
      //get the stream ready
      this.stream = await this.getStreamReady();
      //configure the recording
      let options = { mimeType: "video/webm; codecs=vp9" };
      this.mediaRecorder = new MediaRecorder(this.stream, options);
      this.mediaRecorder.ondataavailable = this.dataAvailable;
      //initialize the playback video
      const video = this.playbackVideo.current;
      video.srcObject = this.stream;
      //start the recording
      this.mediaRecorder.start();
    } catch (error) {
      console.error(error);
    }
  };

  stopRecording = () => {
    //stop recorder
    this.mediaRecorder.stop();
    //kill the camera and the audio
    this.stream.getTracks().forEach(track => track.stop());
    //clear the blobs
    this.blobs = [];
  };

  downloadRecording = () => {
    var blob = new Blob(this.blobs, {
      type: "video/webm"
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = "test.webm";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  dataAvailable = event => {
    console.log("data-available");
    if (event.data.size > 0) {
      this.blobs.push(event.data);
      //download once the recording is ready
      this.downloadRecording();
    }
  };

  //events
  handleOptionsSelectedCamera = event => {
    this.setState({ selectedCamera: event.target.value });
  };

  handleOptionsSelectedMicrophone = event => {
    this.setState({ selectedMicrophone: event.target.value });
  };

  handleAudioOn = () => {
    this.setState({ audioOn: !this.state.audioOn });
  };

  handleVideoOn = () => {
    this.setState({ videoOn: !this.state.videoOn });
  };

  handleTestConfiguration = async () => {
    this.setState({ isTesting: !this.state.isTesting });

    try {
      this.stream = await this.getStreamReady();
      const video = this.playbackVideo.current;
      video.srcObject = this.stream;
    } catch (error) {
      console.error("Error opening video camera.", error);
    }
  };

  handleStopTestConfiguration = async () => {
    this.setState({ isTesting: !this.state.isTesting });
    //kill the camera and the audio
    this.stream.getTracks().forEach(track => track.stop());
  };

  handleStartRecording = () => {
    this.setState({ isRecording: !this.state.isRecording });
    this.startRecording();
  };

  handleStopRecording = () => {
    this.setState({ isRecording: !this.state.isRecording });
    this.stopRecording();
  };

  render() {
    const {
      cameras,
      seletedCamera,
      microphones,
      seletedMicrophone,
      audioOn,
      videoOn,
      isRecording,
      isTesting
    } = this.state;

    return (
      <div className="wrapper">
        <div className="container p-4">
          <div className="row">
            <div className="col-12">
              <video
                autoPlay
                playsInline
                controls={false}
                width="100%"
                ref={this.playbackVideo}
                className="border rounded"
                style={{ background: "#000000" }}
              />
            </div>
            <div className="col-12">
              <div className="d-flex justify-content-between">
                <SingleSelect
                  id="camera-select"
                  label="Select camera"
                  options={cameras}
                  value={seletedCamera}
                  onOptionSelected={this.handleOptionsSelectedCamera}
                />
                <SingleSelect
                  id="microphone-select"
                  label="Select microphone"
                  options={microphones}
                  value={seletedMicrophone}
                  onOptionSelected={this.handleOptionsSelectedMicrophone}
                />
              </div>
            </div>
            <div className="col-12 d-flex">
              <Checkbox
                id="audio-checkbox"
                label="Audio"
                value={audioOn}
                onCheckboxChange={this.handleAudioOn}
              />
              <Checkbox
                id="video-checkbox"
                label="Video"
                value={videoOn}
                onCheckboxChange={this.handleVideoOn}
              />
            </div>
            <div className="col-12 d-flex justify-content-start">
              {isTesting ? (
                <button
                  className="btn btn-danger mr-4"
                  onClick={this.handleStopTestConfiguration}
                >
                  Stop Test
                </button>
              ) : (
                <button
                  className="btn btn-primary mr-4"
                  onClick={this.handleTestConfiguration}
                >
                  Start Test
                </button>
              )}

              {isRecording ? (
                <button
                  className="btn btn-danger"
                  onClick={this.handleStopRecording}
                >
                  Stop Recording
                </button>
              ) : (
                <button
                  className="btn btn-success mr-4"
                  onClick={this.handleStartRecording}
                >
                  Start Recording
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
