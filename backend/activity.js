const express = require("express");
const axios = require("axios");
const fs = require("fs").promises; // Use promises for async file operations
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

let storedQuestions = []; // Store fetched questions

// Fetching questions from Trivia API (BoredAPI didn't work for me)
const fetchQuestions = async (count) => {
  try {
    const response = await axios.get(
      `https://the-trivia-api.com/v2/questions?limit=${count}`
    );
    return response.data.map((q) => ({
      question: q.question.text,
      category: q.category,
      difficulty: q.difficulty,
      correctAnswer: q.correctAnswer,
      incorrectAnswers: q.incorrectAnswers,
    }));
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

// CLI functionality
const handleCLI = async () => {
  const args = process.argv.slice(2);
  const nIndex = args.indexOf("-n");
  const fIndex = args.indexOf("-f");

  if (nIndex === -1 || fIndex === -1) {
    console.log("Usage: node server.js -n <number> -f <format>");
    return;
  }

  const num = args[nIndex + 1] !== undefined ? parseInt(args[nIndex + 1]) : 5;
  const format = args[fIndex + 1] || "console";

  const data = await fetchQuestions(num);
  storedQuestions = data;

  if (format === "console") {
    console.log("\nTrivia Questions:\n");
    data.forEach((q, index) => {
      console.log(`Question ${index + 1}: ${q.question}`);
      console.log(`   Category: ${q.category}`);
      console.log(`   Difficulty: ${q.difficulty}`);
      console.log(`   Correct Answer: ${q.correctAnswer}`);
      console.log(`   Incorrect Answers: ${q.incorrectAnswers.join(", ")}`);
      console.log(
        "------------------------------------------------------------"
      );
    });
  } else if (format === "json") {
    await fs.writeFile("questions.json", JSON.stringify(data, null, 2));
    console.log("JSON file saved as 'questions.json'");
  } else if (format === "csv") {
    const csv =
      "Question,Category,Difficulty,Correct Answer,Incorrect Answers\n" +
      data
        .map(
          (q) =>
            `"${q.question}","${q.category}","${q.difficulty}","${
              q.correctAnswer
            }","${q.incorrectAnswers.join(", ")}"`
        )
        .join("\n");

    await fs.writeFile("questions.csv", csv);
    console.log("CSV file saved as 'questions.csv'");
  } else {
    console.log("Invalid format. Use -f console, -f json, or -f csv.");
  }

  process.exit(); // Exit after CLI execution, so it could be done again
};

// API route to fetch and store questions
app.get("/questions", async (req, res) => {
  const { count } = req.query;
  const num = parseInt(count) || 15;
  storedQuestions = await fetchQuestions(num); // Store questions
  res.json(storedQuestions);
});

// API to download the stored JSON file
app.get("/download/json", (req, res) => {
  if (storedQuestions.length === 0) {
    return res
      .status(400)
      .json({ error: "No questions available. Please refresh." });
  }

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", "attachment; filename=questions.json");
  res.send(JSON.stringify(storedQuestions, null, 2));
});

// API to download the stored questions as CSV
app.get("/download/csv", (req, res) => {
  if (storedQuestions.length === 0) {
    return res
      .status(400)
      .json({ error: "No questions available. Please refresh." });
  }

  const csv =
    "Question,Category,Difficulty,Correct Answer,Incorrect Answers\n" +
    storedQuestions
      .map(
        (q) =>
          `"${q.question}","${q.category}","${q.difficulty}","${
            q.correctAnswer
          }","${q.incorrectAnswers.join(", ")}"`
      )
      .join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=questions.csv");
  res.send(csv);
});

// Detect if CLI arguments exist - otherwise start backend
const args = process.argv.slice(2);
if (args.length > 0) {
  handleCLI();
} else {
  app.listen(PORT, () =>
    console.log(`Backend running on http://localhost:${PORT}`)
  );
}
