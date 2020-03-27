import React, { Component } from "react";
import { ReactMic } from "react-mic";
import API from "../../utils/API";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import Row from "react-bootstrap/Row";
import "./Dictaphone.css";

//------------------------SPEECH RECOGNITION-----------------------------

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new window.SpeechRecognition();

recognition.continous = true;
recognition.maxAlternatives = 10;
recognition.interimResults = true;
recognition.lang = "en-US";
let finalTranscript = "";
let interimTranscript = "";

//------------------------COMPONENT-----------------------------
class Dictaphone extends Component {
  constructor(props) {
    super(props);
    // Setting state for the SpeechRec, all speeches and each individual sentence before submit
    this.state = {
      listening: false,
      sentence: "",
      downloadLinkURL: null,
      isRecording: false,
      recordingStarted: false,
      recordingStopped: false
    };

    this.toggleListen = this.toggleListen.bind(this);
    this.handleListen = this.handleListen.bind(this);
    this.resetTranscripts = this.resetTranscripts.bind(this);
    this.submitTranscripts = this.submitTranscripts.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  // Toggle listening commands when the Start/Stop button is pressed
  toggleListen() {
    this.setState(
      {
        listening: !this.state.listening,
        isRecording: !this.state.isRecording,
        recordingStarted: !this.state.recordingStarted,
        recordingStopped: !this.state.recordingStopped
      },
      this.handleListen
    );
  }

  handleListen() {
    if (this.state.listening) {
      recognition.start();
      recognition.onend = () => {
        recognition.start();
      };
    } else {
      recognition.stop();
      recognition.onend = () => {};
    }

    recognition.onstart = () => {
      // console.log("Listening!");
    };

    // Interim and final transcript are diplayed on the screen
    finalTranscript = "";
    recognition.onresult = event => {
      interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + " ";
        else interimTranscript += transcript;
      }
      document.getElementById(
        "interimTranscript"
      ).innerHTML = interimTranscript;
      document.getElementById("finalTranscript").innerHTML = finalTranscript;

      //-------------------------COMMANDS------------------------------------
      // If the user says and the SpeechRec recognizes, "stop listening", the program turns off the recorder
      // and stops listening
      const transcriptArr = finalTranscript.split("  ");
      const stopCmd = transcriptArr.slice(-3, -1);
      if (stopCmd[0] === "stop" && stopCmd[1] === "listening") {
        recognition.stop();
        recognition.onend = () => {
          const finalText = transcriptArr.slice(0, -3).join(" ");
          document.getElementById("finalTranscript").innerHTML = finalText;
        };
      }
      this.setState({ sentence: transcriptArr[0] });
    };

    //-----------------------------------------------------------------------

    recognition.onerror = event => {
      // console.log("Error occurred in recognition: " + event.error);
    };
  }

  // Reset the interim and final transcript to not display anymore
  resetTranscripts() {
    document.getElementById("interimTranscript").innerHTML = interimTranscript =
      "";
    document.getElementById("finalTranscript").innerHTML = finalTranscript = "";
  }

  // Handles updating component state when the user types into the input field
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  // Sumbit your finalTranscript to the database
  submitTranscripts(event) {
    event.preventDefault();
    if (this.state.sentence) {
      API.saveSentence({
        sentence: this.state.sentence
      }).catch(err => console.log(err));
    }
  }

  stopRecording = () => {
    this.setState({ isRecording: false });
  };

  onSave = blobObject => {
    this.setState({
      downloadLinkURL: blobObject.blobURL
    });
  };

  onStop = blobObject => {
    this.setState({ blobURL: blobObject.blobURL });
  };

  onBlock() {
    alert("ya blocked me!");
  }

  render() {
    const { blobURL, isRecording } = this.state;

    return (
      <div id="wrapper">
        <hr />
        <Container id="buttonContainer">
          <Row id="buttonRow">
            <Col>
              <Button id="recordButton">
                <h1>
                  <i class="far fa-stop-circle" onClick={this.toggleListen}></i>
                </h1>
              </Button>
            </Col>
            <Col>
              <Button id="resetButton">
                <h1>
                  <i class="fas fa-undo" onClick={this.resetTranscripts}></i>
                </h1>
              </Button>
            </Col>
            <Col>
              <Button id="submitButton">
                <h1>
                  <i
                    class="far fa-thumbs-up"
                    onClick={this.submitTranscripts}
                  ></i>
                </h1>
              </Button>
            </Col>
          </Row>
        </Container>
        <hr />
        <Jumbotron>
          <Row>
            <Col>
              <ReactMic
                className="oscilloscope"
                record={isRecording}
                backgroundColor="#333333"
                visualSetting="sinewave"
                audioBitsPerSecond={128000}
                onStop={this.onStop}
                onSave={this.onSave}
                onBlock={this.onBlock}
                strokeColor="#0096ef"
              />
              <div id="audio-playback-controls">
                <audio
                  ref="audioSource"
                  controls="controls"
                  src={blobURL}
                  controlsList="nodownload"
                />
              </div>
            </Col>
          </Row>
        </Jumbotron>
        <hr />
        <br />
        <Jumbotron id="transcriptJumbotron">
          <Container id="transcriptContainer">
            <div id="interimTranscript" />
          </Container>
        </Jumbotron>
        <Jumbotron id="finalTranscriptJumbotron">
          <Container id="finalTranscriptContainer">
            <div
              id="finalTranscript"
              value={this.state.sentence}
              onChange={this.handleInputChange}
            />
          </Container>
        </Jumbotron>
      </div>
    );
  }
}

export default Dictaphone;
