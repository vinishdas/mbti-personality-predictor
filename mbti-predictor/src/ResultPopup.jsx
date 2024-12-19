function ResultPopup({ prediction }) {
    if (!prediction) return null;
  
    return (
      <div className="popup">
        <p>Your MBTI Personality Type: <strong>{prediction}</strong></p>
      </div>
    );
  }
  
  export default ResultPopup;
  