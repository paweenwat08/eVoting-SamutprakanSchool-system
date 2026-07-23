import { getCandidates } from "../services/candidate.ts"
import { getCandidatesByDistrict } from "../services/candidate.ts"
import { getParties } from "../services/party.ts"
import { useState } from "react"
import { Vote, getVoterById } from "../services/voteServices.ts"
import '../styles/VotePage.css'

type Props = {
  userId: number | null
  goResults: () => void
}

export default function VotePage({ userId, goResults }: Props) {
  const [selectedParty, setSelectedParty] = useState<number | null>(null)
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const candidates = getCandidates()
  const parties= getParties()
  const voter = getVoterById(userId)
  if (!voter) {
    return;
  }
  const voterDistrict = voter.district;

  // กรองผู้สมัครที่สมัครในเขตที่ผู้ใช้อยู่
  const filteredCandidates = getCandidatesByDistrict(voterDistrict)

  // เช็คว่า login อยู่มั้ย
  if (!userId) {
    return <p>กรุณา login ก่อน</p>
  }

  const handleConfirm = () => {
    if (!selectedParty || !selectedCandidate || !selectedQuestion) return

    Vote({
      voterId: userId!,
      targetId: selectedParty,
      voteType: "party"
    })

    Vote({
      voterId: userId!,
      targetId: selectedCandidate,
      voteType: "candidate"
    })

    Vote({
      voterId: userId!,
      targetId: selectedQuestion,
      voteType: "question"
    })

    goResults()
  }

  return (
    <div className="vote-container">
      <h2>เลือกพรรคและผู้สมัครที่คุณชอบ</h2>

      {/* 🏛️ Section พรรค */}
      <section className="vote-section">
        <h3>เลือกพรรค</h3>
        <div className="selection-grid">
          {/* แสดงรายชื่อพรรคทั้งหมด */}
          {parties.map((p) => (
            <button
              key={p.id}
              className={`vote-btn ${selectedParty === p.id ? "active" : ""}`}
              onClick={() => setSelectedParty(p.id)}
            >
              {p.name}
            </button>
          ))}
        </div>
      </section>

      {/* 👤 Section ผู้สมัคร */}
      <section className="vote-section">
        <h3>เลือกผู้สมัครเขต {voterDistrict}</h3>
        <div className="selection-grid">
          {/* แสดงรายชื่อผู้สมัครที่ถูกกรองมาแล้ว */}
          {filteredCandidates.map((c) => (
            <button
              key={c.id}
              className={`vote-btn ${selectedCandidate === c.id ? "active" : ""}`}
              onClick={() => setSelectedCandidate(c.id)}
            >
              {c.fname} {c.lname}
            </button>
          ))}
        </div>
      </section>

      {/* 🗳️ Section ประชามติ */}
      <section className="vote-section">
        <h3>คำถามประชามติ</h3>
        <p>ท่านเห็นชอบว่าสมควรมีรัฐธรรมนูญฉบับใหม่หรือไม่?</p>

        <div className="opinion-box">
          <button
            className={`op-btn agree ${selectedQuestion === 1 ? "active" : ""}`}
            onClick={() => setSelectedQuestion(1)}
          >
            เห็นด้วย
          </button>
          <button
            className={`op-btn disagree ${selectedQuestion === 2 ? "active" : ""}`}
            onClick={() => setSelectedQuestion(2)}
          >
            ไม่เห็นด้วย
          </button>
          <button
            className={`op-btn abstain ${selectedQuestion === 3 ? "active" : ""}`}
            onClick={() => setSelectedQuestion(3)}
          >
            งดออกเสียง
          </button>
        </div>

      </section>

      <button
        className="confirm-submit-btn"
        onClick={() => setShowConfirm(true)}
        disabled={!selectedParty || !selectedCandidate || !selectedQuestion}
      >
        ยืนยันการโหวต
      </button>

      {/* 🛡️ Modal ยืนยัน (แยกเป็น CSS จะสะอาดกว่า) */}
      {showConfirm && (
        <div className="modal-overlay"> {/* พื้นหลังสีดำจางๆ */}
          <div className="modal-card"> {/* กล่อง Popup สีขาว */}

            <div className="modal-header">
              <h3>ยืนยันการลงคะแนน</h3>
            </div>

            <div className="modal-body">
              <p>ตรวจสอบข้อมูลการเลือกของคุณให้ถูกต้องก่อนยืนยัน</p>

              <div className="confirm-summary">
                <div className="summary-item">
                  <span className="label">พรรค</span>
                  <span className="value">
                    {parties.find(p => p.id === selectedParty)?.name}
                  </span>
                </div>

                <div className="summary-item">
                  <span className="label">ผู้สมัคร</span>
                  <span className="value">
                    {candidates.find(c => c.id === selectedCandidate)?.fname}{" "}
                    {candidates.find(c => c.id === selectedCandidate)?.lname}
                  </span>
                </div>

                <div className="summary-item">
                  <span className="label">ประชามติ</span>
                  <span className="value">
                    {
                      selectedQuestion === 1
                        ? "เห็นด้วย"
                        : selectedQuestion === 2
                          ? "ไม่เห็นด้วย"
                          : "งดออกเสียง"
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-back"
                onClick={() => setShowConfirm(false)}
              >
                แก้ไขข้อมูล
              </button>
              <button
                className="btn-confirm"
                onClick={() => {
                  handleConfirm();
                  setShowConfirm(false);
                }}
              >
                ยืนยันโหวต
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}