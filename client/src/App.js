import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dictaphone from "./components/SpeechRecognition/SpeechRecognition";

function App() {
  return (
    <Router>
      <Switch>
        <Route component={Dictaphone} />
      </Switch>
    </Router>
  );
}

export default App;
