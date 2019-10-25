import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Nav from "./components/Nav";
import Weather from "./components/Weather";

function App() {
  return (
    <div className="App">
      <Nav />
      <Weather />
    </div>
  );
}

export default App;
