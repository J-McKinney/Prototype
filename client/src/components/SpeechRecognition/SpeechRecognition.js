import React, { Component } from "react";
// import { ReactMic } from "react-mic";
import API from "../../utils/API";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import "./Dictaphone.css";

//----------------------------RECORDERJS---------------------------------

//----------------------------RECORDERJS---------------------------------
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
//------------------------SPEECH RECOGNITION-----------------------------
//------------------------RANDOM WORD GENERATOR--------------------------
let randomWordArr = ["Incredible"];
//------------------------RANDOM WORD GENERATOR--------------------------

//------------------------COMPONENT-----------------------------
class Dictaphone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Setting state for each individual sentence before submit
      sentence: "",
      //------------------------SPEECH RECOGNITION-----------------------------
      listening: false,
      //------------------------SPEECH RECOGNITION-----------------------------

      //----------------------------REACT-MIC---------------------------------
      // Setting state for the REACT-MIC
      // downloadLinkURL: null,
      // isRecording: false,
      //----------------------------REACT-MIC---------------------------------
    };

    //------------------------SPEECH RECOGNITION-----------------------------
    this.toggleListen = this.toggleListen.bind(this);
    this.handleListen = this.handleListen.bind(this);
    this.resetTranscripts = this.resetTranscripts.bind(this);
    this.submitTranscripts = this.submitTranscripts.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    //------------------------SPEECH RECOGNITION-----------------------------

    //------------------------RANDOM WORD GENERATOR--------------------------
    this.randomWordGenerator = this.randomWordGenerator.bind(this);
    //------------------------RANDOM WORD GENERATOR--------------------------
  }
  componentDidMount() {
    // console.log("");
    // console.log("Listening is set to " + this.state.listening);
    // console.log("isRecording is set to " + this.state.isRecording);
  }
  componentDidUpdate() {
    // console.log("");
    // console.log("Listening is set to " + this.state.listening);
    // console.log("isRecording is set to " + this.state.isRecording);
  }

  //------------------------SPEECH RECOGNITION-----------------------------
  // Toggle listening commands when the Start/Stop button is pressed
  toggleListen = () => {
    this.setState(
      {
        // SPEECH RECOGNITION
        listening: !this.state.listening,

        //----------------------------REACT-MIC---------------------------------
        // isRecording: !this.state.isRecording,
        //----------------------------REACT-MIC---------------------------------
      },
      // SPEECH RECOGNITION
      this.handleListen
    );
  };
  //------------------------SPEECH RECOGNITION-----------------------------

  //------------------------SPEECH RECOGNITION-----------------------------
  handleListen = () => {
    if (this.state.listening) {
      recognition.start();

      // this is what causes that weird jingle noise when deployed on the phone
      recognition.onend = () => {
        // this only lets you record your voice once and if you stop talking
        // it will not write anything else after it
        // recognition.onstart = () => {

        // console.log("...continue listening...");
        recognition.start();
      };
    } else {
      // } if (!this.state.listening) {
      recognition.stop();
      recognition.onend = () => {
        // console.log("Stopped listening per click");
      };
    }

    // SPEECH RECOGNITION
    // Interim and final transcript are diplayed on the screen
    finalTranscript = "";
    recognition.onresult = (event) => {
      interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + " ";
        else interimTranscript += transcript;
        // console.log(finalTranscript);
      }
      document.getElementById(
        "interimTranscript"
      ).innerHTML = interimTranscript;
      document.getElementById("finalTranscript").innerHTML = finalTranscript;

      //-------------------------COMMANDS------------------------------------
      // SPEECH RECOGNITION
      // If the user says and the SpeechRec recognizes, "stop listening", the program turns off the recorder
      // and stops listening if no space between the double quotes in this block then, the program reads
      // everything like one big long sentence instead of individual strings
      const transcriptArr = finalTranscript.split("  ");
      const stopCmd = transcriptArr.slice(-3, -1);
      // console.log("stopCmd", stopCmd);
      if (stopCmd[0] === "stop" && stopCmd[1] === "listening") {
        recognition.stop();
        recognition.onend = () => {
          const finalText = transcriptArr.slice(0, -3).join(" ");
          document.getElementById("finalTranscript").innerHTML = finalText;
        };
      }
      this.setState({ sentence: transcriptArr[0] });
      // console.log(transcriptArr[0]);
    };
    recognition.onerror = (event) => {
      console.log("Error occurred in recognition: " + event.error);
    };
  };
  //------------------------SPEECH RECOGNITION-----------------------------

  //------------------------SPEECH RECOGNITION-----------------------------
  // Reset the interim and final transcript to not display anymore
  resetTranscripts() {
    document.getElementById("interimTranscript").innerHTML = interimTranscript =
      "";
    document.getElementById("finalTranscript").innerHTML = finalTranscript = "";
    // console.log("All Records Cleared");
  }
  //------------------------SPEECH RECOGNITION-----------------------------

  //------------------------SPEECH RECOGNITION-----------------------------
  // Handles updating component state when the user speaks into the input field
  handleInputChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };
  //------------------------SPEECH RECOGNITION-----------------------------

  //------------------------SPEECH RECOGNITION-----------------------------
  // Sumbit your finalTranscript to the database
  submitTranscripts() {
    if (this.state.sentence) {
      API.saveSentence({
        sentence: this.state.sentence,
      }).catch((err) => console.log(err));
    }
    // console.log("Transcript Submitted");
    // console.log(this.state.sentence);
  }
  //------------------------SPEECH RECOGNITION-----------------------------

  //----------------------------REACT-MIC---------------------------------
  // stopRecording = () => {
  //   this.setState({ isRecording: false });
  // };
  //----------------------------REACT-MIC---------------------------------

  //----------------------------REACT-MIC---------------------------------
  // onSave = (blobObject) => {
  //   this.setState({
  //     downloadLinkURL: blobObject.blobURL,
  //   });
  // };
  //----------------------------REACT-MIC---------------------------------

  //----------------------------REACT-MIC---------------------------------
  // onStop = (blobObject) => {
  //   this.setState({ blobURL: blobObject.blobURL });
  // };
  //----------------------------REACT-MIC---------------------------------

  //----------------------------REACT-MIC---------------------------------
  // onBlock() {
  //   console.log("onBlock");
  // }
  //----------------------------REACT-MIC---------------------------------

  //------------------------RANDOM WORD GENERATOR--------------------------
  randomWordGenerator(event) {
    event.preventDefault();
    var randomWord = Math.floor(Math.random() * randomWordArr.length);
    var word = randomWordArr[randomWord];
    // console.log(word);
    document.getElementById("randomWordPlacement").innerHTML = word;
  }
  //------------------------RANDOM WORD GENERATOR--------------------------

  // randomColorGenerator() {
  //   var randomColor = Math.floor(Math.random() * randomColorArr.length);
  //   var color = randomColorArr[randomColor];
  //   console.log(color);
  // }

  //----------------------------RECORDERJS---------------------------------
  
  //----------------------------RECORDERJS---------------------------------

  render() {
    //----------------------------REACT-MIC---------------------------------
    // const { blobURL, isRecording } = this.state;
    //----------------------------REACT-MIC---------------------------------

    return (
      <>
        <div id="wrapper">
          <Container id="randomWordContainer">
            <Row id="randomWordRow">
              <Col id="randomWordCol">
                <div id="randomWordPlacement">
                  <br />
                </div>
              </Col>
            </Row>
          </Container>
          <Container>
            <Row id="randomWordButtonRow">
              {/* changed onClick laptop/desktop to onTouchStart mobile */}
              <Button id="randomWordButton" onClick={this.randomWordGenerator}>
                <div id="newWordText">Click For New Word</div>
              </Button>
            </Row>

            {/*//----------------------------REACT-MIC---------------------------------
              <Row id="oscilloscopeRow">
              <Col>
                <ReactMic
                  className="oscilloscope"
                  record={isRecording}
                  backgroundColor="#525252"
                  visualSetting="frequencyBars"
                  audioBitsPerSecond={128000}
                  onStop={this.onStop}
                  onSave={this.onSave}
                  onBlock={this.onBlock}
                  strokeColor="#4bf7f7"
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
            //----------------------------REACT-MIC---------------------------------*/}
          </Container>
          <Container id="finalTranscriptContainer">
            <div id="interimTranscript"></div>
            <div
              id="finalTranscript"
              value={this.state.sentence}
              onChange={this.handleInputChange}
            >
              <br />
            </div>
          </Container>
          <Container id="buttonContainer">
            <Row id="buttonRow">
              <Col>
                <Button id="recordButton" onClick={this.toggleListen}>
                  <i id="favIcon" className="far fa-stop-circle"></i>
                </Button>
              </Col>
              <Col>
                <Button id="resetButton" onClick={this.resetTranscripts}>
                  <i id="favIcon" className="fas fa-undo"></i>
                </Button>
              </Col>
              <Col>
                <Button id="submitButton" onClick={this.submitTranscripts}>
                  <i id="favIcon" className="far fa-thumbs-up"></i>
                </Button>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default Dictaphone;
