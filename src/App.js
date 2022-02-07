import React, { Component } from "react";
import Stopwatch from "./Components/Stopwatch";
import s from "./App.module.css";

class App extends Component {
  state = {};
  render() {
    return (
      <>
        <header className={s.header}>Timer</header>
        <Stopwatch />
      </>
    );
  }
}

export default App;
