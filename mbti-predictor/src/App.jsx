import React, { useState } from "react";
import Header from "./Header";
import InputForm from "./inputForm";
import ResultPopup from "./ResultPopup";
import "./App.css";

function App() {
  const [prediction, setPrediction] = useState(""); // Store the prediction result

  return (<>
    <div className="background">
    </div>
    <div className="App">
      <Header />
      <InputForm setPrediction={setPrediction} />
      <ResultPopup prediction={prediction} />
    </div>
  </>
  );
}

export default App;
