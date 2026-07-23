import { getCandidates, getCandidatesByDistrict } from "../services/candidate.ts"
import { getParties } from "../services/party.ts"
import { useState } from "react"
import '../styles/VotePage.css'

type Props = {
  goResults: () => void
}


export default function DemoVotePage({ goResults }: Props) {
  const [selectedParty, setSelectedParty] = useState<number | null>(null)
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [complete, setComplete] = useState(false)

  const candidates = getCandidates()
  const parties = getParties()
  const filteredCandidates = getCandidatesByDistrict(1)

  const handleConfirm = () => {
    setShowConfirm(false)
    setComplete(true)
  }

  return (
    <div className="vote-container test-mode"> {/* เพิ่ม test-mode เผื่ออยากเปลี่ยนสีธีม */}
      <h2 className="test-title">โหมดทดลองระบบเลือกตั้ง</h2>

      {/* 🏛️ พรรค */}
      <section className="vote-section">
        <h3>เลือกพรรค</h3>
        <div className="selection-grid"> {/* ใช้ Grid เดิม */}
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

      <hr />

      {/* 👤 ผู้สมัคร */}
      <section className="vote-section">
        <h3>เลือกผู้สมัครเขต 1</h3>
        <div className="selection-grid">
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

      <hr />

      {/* 🗳️ ประชามติ */}
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
        ยืนยันการเลือก
      </button>

      {/* Popup ยืนยัน และ Popup เสร็จสิ้น ใช้ Class modal เดิมได้เลย */}
      {(showConfirm || complete) && (
        <div className="modal-overlay"> {/* เพิ่ม backdrop-filter: blur ใน CSS จะดูดีมาก */}
          <div className={`modal-card test-modal ${complete ? 'complete-modal' : ''}`}>

            {showConfirm ? (
              <>
                {/* ส่วนหัว Popup สำหรับโหมดทดลอง */}
                <div className="modal-header test-header">
                  <h3>ยืนยันการเลือกของคุณ</h3>
                </div>

                <div className="modal-body">
                  <p>ตรวจสอบความถูกต้องของการทดลองเลือกตั้ง</p>

                  <div className="confirm-summary test-summary">
                    {/* จับกลุ่มเพื่อความสวยงาม */}
                    <div className="summary-item">
                      <span className="summary-label">พรรค</span>
                      <span className="summary-value">
                        {parties.find(p => p.id === selectedParty)?.name}
                      </span>
                    </div>

                    <div className="summary-item">
                      <span className="summary-label">ผู้สมัคร</span>
                      <span className="summary-value">
                        {candidates.find(c => c.id === selectedCandidate)?.fname}{" "}
                        {candidates.find(c => c.id === selectedCandidate)?.lname}
                      </span>
                    </div>

                    <div className="summary-item">
                      <span className="summary-label">ประชามติ</span>
                      <span className="summary-value">
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

                <div className="modal-footer action-footer">
                  <button
                    className="btn-secondary"
                    onClick={() => setShowConfirm(false)}
                  >
                    แก้ไขข้อมูล
                  </button>
                  <button
                    className="btn-confirm-test"
                    onClick={handleConfirm}
                  >
                    ยืนยันการเลือก
                  </button>
                </div>
              </>
            ) : (
              /* Popup เมื่อทดลองเสร็จสิ้น */
              <div className="modal-body complete-body">
                <h3>ท่านได้ทดลองใช้ระบบเสร็จสิ้น</h3>
                <p>ขอบคุณที่ร่วมทดลองระบบเลือกตั้งจำลอง</p>
                <button className="btn-confirm-test go-home-btn" onClick={goResults}>
                  กลับหน้าหลักผลคะแนน
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}