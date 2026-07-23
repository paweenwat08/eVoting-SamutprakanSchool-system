import type { Vote } from "../types/Vote.ts"
import { Voters } from "../data/voters.ts"

export function GetVotes(): Vote[] {
  const data = localStorage.getItem("votes")
  return data ? JSON.parse(data) : []
}

export function SaveVotes(votes: Vote[]) {
  localStorage.setItem("votes", JSON.stringify(votes))
}

export function Vote(vote: Vote) {
  const votes = GetVotes()

  const already = votes.find(
    (v) => v.voterId === vote.voterId && v.voteType === vote.voteType
  )

  if (already) {
    return { success: false, message: "คุณโหวตไปแล้ว" }
  }

  votes.push({...vote})
  SaveVotes(votes)

  return { success: true, message: "โหวตสำเร็จ" }
}

export function GetResults(voteType: string) {
  const votes = GetVotes()
  const result: Record<number, number> = {}

  votes.forEach((v) => {
    if (v.voteType === voteType) {
      result[v.targetId] =
        (result[v.targetId] || 0) + 1
    }
  })

  return result
}

export function getVoterById(id: number | null) {
  if (id === null) return undefined;

  return Voters.find(v => v.id === id)
}