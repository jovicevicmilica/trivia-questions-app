# Trivia Questions App

This is a full-stack application that fetches trivia questions from an external API, stores them, and allows users to view and download the questions in JSON or CSV format, or on console. The backend is built with Node.js, while the frontend is a React application.

## Prerequisites

Before running the application, ensure you have the following installed on your machine:

- Node.js (v16 or higher)
- npm (comes with Node.js)
- Git

## How to run the application:

1. Clone the repository:

```
git clone https://github.com/jovicevicmilica/trivia-questions-app
cd trivia-questions-app
```

2. Install dependencies:

```
cd backend
npm install
cd ..\frontend
npm install
```

3. Run the backend server:

```
cd ..\backend
npm start
```

4. Start the frontend server (In a separate terminal):

```
cd trivia-questions-app\frontend
cd frontend
npm start
```

5. Try the frontend application with buttons.

6. To run via command line, close the active terminal for backend, and:

```
cd trivia-questions-app\backend
node activity.js -n <number> -f <format>
```

7. Example:

```
node activity.js -n 10 -f json
```
