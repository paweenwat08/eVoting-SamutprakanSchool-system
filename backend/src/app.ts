import express from "express";

// routes import
import voterRouter from './routes/voter.route';
import partyRouter from './routes/party.route';
import candidateRouter from './routes/candidate.route';
import voteRouter from './routes/vote.route'

const app = express(); // create an express app

app.use(express.json());

// routes declaration
app.use("/api/v1/voters", voterRouter);
app.use("/api/v1/parties", partyRouter);
app.use("/api/v1/candidates", candidateRouter);
app.use("/api/v1/vote", voteRouter)

// example routes: http://localhost:4000/api/v1/voters/register

export default app;