import React, { Component } from "react";
import API from "../../utils/API";
import AudioAnalyser from "react-audio-analyser";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import "./Dictaphone.css";

//-----------------------------------------------------SPEECH RECOGNITION-----------------------------
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new window.SpeechRecognition();

recognition.continous = true;
recognition.maxAlternatives = 10;
recognition.interimResults = true;
recognition.lang = "en-US";
let finalTranscript = "";
let interimTranscript = "";
//-----------------------------------------------------SPEECH RECOGNITION-----------------------------

//-----------------------------------------------------RANDOM WORD GENERATOR--------------------------
let randomWordArr = ["Incredible"];
//-----------------------------------------------------RANDOM WORD GENERATOR--------------------------

//------------------------COMPONENT-----------------------------
class Dictaphone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Setting state for each individual sentence before submit
      sentence: "",

      //-----------------------------------------------------SPEECH RECOGNITION-----------------------------
      listening: false,
      //-----------------------------------------------------SPEECH RECOGNITION-----------------------------

      //-------------------------------------------------------AUDIOANALYSER--------------------------------
      status: "",
      //-------------------------------------------------------AUDIOANALYSER--------------------------------
    };

    //-----------------------------------------------------SPEECH RECOGNITION-----------------------------
    this.toggleListen = this.toggleListen.bind(this);
    this.handleListen = this.handleListen.bind(this);
    this.resetTranscripts = this.resetTranscripts.bind(this);
    this.submitTranscripts = this.submitTranscripts.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    //-----------------------------------------------------SPEECH RECOGNITION-----------------------------

    //-----------------------------------------------------RANDOM WORD GENERATOR--------------------------
    this.randomWordGenerator = this.randomWordGenerator.bind(this);
    //-----------------------------------------------------RANDOM WORD GENERATOR--------------------------
  }
  componentDidMount() {
    // console.log();
  }
  componentDidUpdate() {
    // console.log();
  }

  //-----------------------------------------------------SPEECH RECOGNITION-----------------------------
  // Toggle listening commands when the Start/Stop button is pressed
  toggleListen = () => {
    this.setState(
      {
        // SPEECH RECOGNITION
        listening: !this.state.listening,
      },
      // SPEECH RECOGNITION
      this.handleListen
    );
  };

  handleListen = () => {
    if (this.state.listening) {
      this.controlAudio("recording");

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

      // this.controlAudio("paused");

      recognition.stop();
      recognition.onend = () => {
        this.controlAudio("inactive");
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
      // everything like one big long sentence inst||ead of ||individual strings
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

  // Reset the interim and final transcript to not display anymore
  resetTranscripts() {
    document.getElementById("interimTranscript").innerHTML = interimTranscript =
      "";
    document.getElementById("finalTranscript").innerHTML = finalTranscript = "";
    // console.log("All Records Cleared");
  }

  // Handles updating component state when the user speaks into the input field
  handleInputChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

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
  //-----------------------------------------------------SPEECH RECOGNITION-----------------------------

  //-------------------------------------------------------AUDIOANALYSER--------------------------------
  controlAudio(status) {
    this.setState({
      status,
    });
  }

  changeScheme(e) {
    this.setState({
      audioType: e.target.value,
    });
  }
  //-------------------------------------------------------AUDIOANALYSER--------------------------------

  //-----------------------------------------------------RANDOM WORD GENERATOR--------------------------
  randomWordGenerator(event) {
    event.preventDefault();
    var randomWord = Math.floor(Math.random() * randomWordArr.length);
    var word = randomWordArr[randomWord];
    // console.log(word);
    document.getElementById("randomWordPlacement").innerHTML = word;
  }
  //-----------------------------------------------------RANDOM WORD GENERATOR--------------------------

  render() {
    //-------------------------------------------------------AUDIOANALYSER--------------------------------
    const { status, audioSrc, audioType } = this.state;
    const audioProps = {
      audioType,
      // audioOptions: {sampleRate: 30000}, // 设置输出音频采样率
      status,
      audioSrc,
      timeslice: 1000, // timeslice（https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start#Parameters）
      startCallback: (e) => {
        console.log("succ start", e);
      },
      pauseCallback: (e) => {
        console.log("succ pause", e);
      },
      stopCallback: (e) => {
        this.setState({
          audioSrc: window.URL.createObjectURL(e),
        });
        console.log("succ stop", e);
      },
      onRecordCallback: (e) => {
        console.log("recording", e);
      },
      errorCallback: (err) => {
        console.log("error", err);
      },
      //-------------------------------------------------------AUDIOANALYSER--------------------------------
    };

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
          </Container>

          <Row id="oscilloscopeRow">
            <AudioAnalyser className="oscilloscope" {...audioProps} />
          </Row>

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
