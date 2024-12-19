import React, { useState } from "react";

function InputForm({ setPrediction }) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch prediction");
      }

      const data = await response.json();
      setPrediction(data.prediction); // Handle the prediction result
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setPrediction("Error fetching prediction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter your thoughts..."
        required
        rows="4"
        cols="50"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Predicting..." : "Predict"}
      </button>
    </form>
  );
}

export default InputForm;
