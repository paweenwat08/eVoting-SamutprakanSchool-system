import { GetResults } from "../services/voteServices.ts"
import ResultCandidate from "../components/Results/ResultCandidate.tsx"
import ResultParty from "../components/Results/ResultParty.tsx"
import ResultQuestion from "../components/Results/ResultQuestion.tsx"
import Action from "../components/Action.tsx" /* ค่อยลบออก */
import '../styles/ResultPage.css'

export default function ResultsPage() {
  const partyResults = GetResults("party")
  const questionResults = GetResults("question")

  return (
    <main className="results-container">
      <div className="dashboard-container">
        {/* 🏛️ พรรค */}
        <ResultParty partyResults={partyResults} />
        {/* 🗳️ ประชามติ */}
        <ResultQuestion questionResults={questionResults} />
      </div>

      {/* 👤 ผู้สมัคร */}
      <ResultCandidate />

    </main>
  )
}