import { CandidatesList } from "../data/candidates"
import { Voters } from "../data/voters"
import { SaveVotes, GetVotes } from "../services/voteServices"

export function seedVotes() {
    const votes = GetVotes() // ✅ เรียกครั้งเดียว

    Voters.forEach(voter => {

        // 🔒 กันโหวตซ้ำ
        const already = votes.some(v => v.voterId === voter.id)
        if (already) return
        
        // 🏛️ พรรค (bias)
        const r = Math.random()
        const partyId =
            r < 0.4 ? 1 :
                r < 0.7 ? 2 :
                    r < 0.9 ? 3 : 4

        // 👤 ผู้สมัคร (เฉพาะเขต)
        const candidates = CandidatesList.filter(
            c => c.district === voter.district
        )

        // มีโอกาสเลือกผู้สมัครจากพรรคเดียวกัน
        const samePartyCandidates = candidates.filter(c => c.partyId === partyId)

        const candidate =
            samePartyCandidates.length > 0
                ? samePartyCandidates[Math.floor(Math.random() * samePartyCandidates.length)]
                : candidates[Math.floor(Math.random() * candidates.length)]

        // 🗳️ ประชามติ
        const q = Math.random()
        const questionId =
            q < 0.5 ? 1 :
                q < 0.85 ? 2 : 3

        votes.push(
            { voterId: voter.id, targetId: partyId, voteType: "party" },
            { voterId: voter.id, targetId: candidate.id, voteType: "candidate" },
            { voterId: voter.id, targetId: questionId, voteType: "question" }
        )
    })

    SaveVotes(votes) // ✅ save ครั้งเดียว
}