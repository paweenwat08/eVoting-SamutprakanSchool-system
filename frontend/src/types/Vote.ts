export type Vote = {
  voterId: number
  targetId: number
  voteType: "party" | "candidate" | "question"
}