import type { Voter } from "./Voter";
import type { Party } from "./Party";
import type { Candidate } from "./Candidate";

export interface VoteRecord {
  _id: string;
  voter: Voter;
  party: Party;
  candidate: Candidate;
  referendum: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetResultsResponse {
  success: boolean;
  votes: VoteRecord[];
}

// 2. ตามด้วยฟังก์ชัน Service
export async function getResults(): Promise<GetResultsResponse> {
  const response = await fetch("/api/v1/vote");
  return await response.json();
}