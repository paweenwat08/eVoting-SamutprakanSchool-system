import express from "express";

// routes import
import voterRouter from './routes/voter.route';

const app = express(); // create an express app

app.use(express.json());

// routes declaration
app.use("/api/v1/voters", voterRouter);

// example routes: http://localhost:4000/api/v1/voters/register

export default app;