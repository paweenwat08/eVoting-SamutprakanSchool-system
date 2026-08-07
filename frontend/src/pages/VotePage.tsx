import { getParties } from "../services/party";
import { getCandidates } from "../services/candidate";
import { sendVote } from "../services/voteServices";
import { useState, useEffect } from "react";
import '../styles/VotePage.css';

// 1. เพิ่ม Type Definitions สำหรับข้อมูล API
interface Party {
  id: string;
  name: string;
}

interface Candidate {
  id: string;
  fname: string;
  lname: string;
  district: number | string;
}

type Props = {
  userId: number | null;
  goResults: () => void;
};

export default function VotePage({ userId, goResults }: Props) {
  const [selectedParty, setSelectedParty] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // เพิ่ม State สำหรับจัดการสถานะ Loading ระหว่างยิง API
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. ระบุ Type ให้กับ State
  const [parties, setParties] = useState<Party[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const partyData = await getParties();
        const candidateData = await getCandidates();

        setParties(partyData.parties ?? []);
        setCandidates(candidateData.candidates ?? []);
      } catch (error) {
        console.error("Failed to load vote data:", error);
      }
    }

    loadData();
  }, []);

  // ดึงข้อมูล Voter จาก LocalStorage
  const voterRaw = localStorage.getItem("voter");
  const voter = voterRaw ? JSON.parse(voterRaw) : null;

  // 3. ปรับ Early Return ให้คืนค่า null แทน undefined
  if (!voter) {
    return <p>ไม่พบข้อมูลผู้ลงคะแนน กรุณาเข้าสู่ระบบใหม่</p>;
  }

  if (!userId) {
    return <p>กรุณา login ก่อน</p>;
  }

  const voterDistrict = voter.district;

  const filteredCandidates = candidates.filter(
    (c) => c.district === voterDistrict
  );

  // 4. ปรับเป็น async/await และเปลี่ยน Vote เป็น sendVote
  const handleConfirm = async () => {
    // ตรวจสอบความถูกต้องของข้อมูล
    if (!userId || !selectedParty || !selectedCandidate || !selectedQuestion) return;

    setIsSubmitting(true);

    try {
      // แปลงตัวเลือกประชามติ (1, 2, 3) ให้เป็นข้อความ string ตามที่ API คาดหวัง
      const referendumText =
        selectedQuestion === 1 ? "เห็นด้วย" :
          selectedQuestion === 2 ? "ไม่เห็นด้วย" : "งดออกเสียง";

      // เรียก sendVote ครั้งเดียว พร้อมส่ง พารามิเตอร์ 4 ตัวเรียงตามลำดับ
      await sendVote(
        String(userId),            // voter
        selectedParty,             // party
        selectedCandidate,         // candidate
        referendumText             // referendum (หรือเปลี่ยนเป็น String(selectedQuestion) ถ้า API รับเป็น "1","2","3")
      );

      goResults();
    } catch (error) {
      console.error("Failed to submit vote:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกผลโหวต กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="vote-container">
      <h2>เลือกพรรคและผู้สมัครที่คุณชอบ</h2>

      {/* 🏛️ Section พรรค */}
      <section className="vote-section">
        <h3>เลือกพรรค</h3>
        <div className="selection-grid">
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
        disabled={!selectedParty || !selectedCandidate || !selectedQuestion || isSubmitting}
      >
        {isSubmitting ? "กำลังส่งข้อมูล..." : "ยืนยันการโหวต"}
      </button>

      {/* 🛡️ Modal ยืนยัน */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>ยืนยันการลงคะแนน</h3>
            </div>

            <div className="modal-body">
              <p>ตรวจสอบข้อมูลการเลือกของคุณให้ถูกต้องก่อนยืนยัน</p>

              <div className="confirm-summary">
                <div className="summary-item">
                  <span className="label">พรรค</span>
                  <span className="value">
                    {parties.find((p) => p.id === selectedParty)?.name}
                  </span>
                </div>

                <div className="summary-item">
                  <span className="label">ผู้สมัคร</span>
                  <span className="value">
                    {(() => {
                      const candidate = candidates.find((c) => c.id === selectedCandidate);
                      return candidate ? `${candidate.fname} ${candidate.lname}` : "";
                    })()}
                  </span>
                </div>

                <div className="summary-item">
                  <span className="label">ประชามติ</span>
                  <span className="value">
                    {selectedQuestion === 1
                      ? "เห็นด้วย"
                      : selectedQuestion === 2
                        ? "ไม่เห็นด้วย"
                        : "งดออกเสียง"}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-back"
                onClick={() => setShowConfirm(false)}
                disabled={isSubmitting}
              >
                แก้ไขข้อมูล
              </button>
              <button
                className="btn-confirm"
                onClick={() => handleConfirm()}
                disabled={isSubmitting}
              >
                {isSubmitting ? "กำลังบันทึก..." : "ยืนยันโหวต"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}