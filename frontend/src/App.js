import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [questions, setQuestions] = useState([]);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchData();
      hasFetched.current = true;
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/questions?count=15"
      );
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const downloadFile = (type) => {
    window.open(`http://localhost:5000/download/${type}`);
  };

  return (
    <div className="container">
      <h1>Trivia Questions</h1>
      {questions.length === 0 ? (
        <p>Loading questions...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Question</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Correct Answer</th>
              <th>Incorrect Answers</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, index) => (
              <tr key={index}>
                <td>{q.question}</td>
                <td>{q.category}</td>
                <td>{q.difficulty}</td>
                <td>{q.correctAnswer}</td>
                <td>{q.incorrectAnswers.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="buttons">
        <button onClick={() => downloadFile("json")}>Download JSON</button>
        <button onClick={() => downloadFile("csv")}>Download CSV</button>
        <button onClick={() => console.log(questions)}>Print to Console</button>
      </div>
    </div>
  );
}

export default App;
