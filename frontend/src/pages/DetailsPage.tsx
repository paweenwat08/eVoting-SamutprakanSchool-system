import { getParties, getPartyById } from "../services/party.ts";
import { getCandidates, getCandidateById, getCandidatesByParty, getCandidatesByDistrict } from "../services/candidate.ts";
import { useState } from "react"
import '../styles/DetailPage/DetailPage.css'
import '../styles/DetailPage/DetailBox.css'

export default function DetailsPage() {
  const [selectedParty, setSelectedParty] = useState<number | null>(null)
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null)
  const [selectedDistrictDetail, setSelectedDistrictDetail] = useState<number | "all">("all")

  const parties = getParties()
  const candidates = getCandidates()

  const filteredCandidatesListDetail =
    selectedDistrictDetail === "all"
      ? candidates
      : getCandidatesByDistrict(selectedDistrictDetail)

  const districts = [...new Set(candidates.map(c => c.district))]

  return (
    <>
      {!selectedParty && !selectedCandidate &&
        <div className="info-container">
          <h2 className="section-title">รายชื่อพรรค</h2>
          <div className="party-grid">
            {parties.map((party) => (
              <div key={party.id} className="party-info-card"
                onClick={() => {
                  setSelectedParty(party.id)
                  setSelectedCandidate(null)
                }}>
                <div className="party-number">{party.id}</div>
                <div className="party-detail">
                  <h3>{party.name}</h3>
                  {/* เพิ่มข้อมูลนโยบายตรงนี้ */}
                  <ul className="policy-list">
                    {party.policies?.map((policy, index) => (
                      <li key={index}>{policy}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <hr className="divider" />

          <div className="detail-district-selector-container">
            <h2 className="section-title">รายชื่อผู้สมัคร</h2>
            <div className="detail-district-selector">
              {districts && districts.map((d) => (
                <button
                  key={d}
                  className={String(selectedDistrictDetail) === String(d) ? "active" : ""}
                  onClick={() => setSelectedDistrictDetail(d)}
                >
                  เขต {d}
                </button>
              ))}
              <button
                className={selectedDistrictDetail === "all" ? "active" : ""}
                onClick={() => setSelectedDistrictDetail("all")}
              >
                ทั้งหมด
              </button>
            </div>
          </div>


          <div className="candidate-grid">
            {filteredCandidatesListDetail.map((candidate) => {
              const party = getPartyById(candidate.partyId)
              return (
                <div key={candidate.id} className="candidate-info-card"
                  onClick={() => {
                    setSelectedCandidate(candidate.id)
                    setSelectedParty(null)
                  }}>
                  <div className="candidate-avatar">👤</div>
                  <div className="candidate-text">
                    <h4>{candidate.fname} {candidate.lname}</h4>
                    <p className="party-tag">สังกัด: {party?.name}</p>
                    <p className="slogan"></p> {/* อาจจะเพิ่ม slogan */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      }

      {selectedParty && (
        <div className="detail-box">
          <button
            className="back-btn"
            onClick={() => {
              setSelectedParty(null)
              setSelectedCandidate(null)
            }}
          >
            ← กลับ
          </button>
          {(() => {
            const party = getPartyById(selectedParty)
            if (!party) return null

            const candidates = getCandidatesByParty(party.id)

            return (
              <>
                <h3>🏛️ {party.name}</h3>

                <h4>นโยบายหลัก</h4>
                <ul>
                  {party.policies.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>

                {/* 👇 เพิ่มตรงนี้ */}
                <h4 style={{ marginTop: "20px" }}>👤 ผู้สมัครในพรรคนี้</h4>

                {candidates.length === 0 ? (
                  <p>ไม่มีผู้สมัคร</p>
                ) : (
                  <div className="candidate-list">
                    {candidates.map(c => (
                      <div key={c.id} className="mini-candidate-card"
                        onClick={() => {
                          setSelectedCandidate(c.id)
                          setSelectedParty(null)
                        }}>
                        <span>👤 {c.fname} {c.lname}</span>
                        <span className="district">เขต {c.district}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )
          })()}
        </div>
      )}
      {selectedCandidate && (
        <div className="detail-box">
          <button
            className="back-btn"
            onClick={() => {
              setSelectedParty(null)
              setSelectedCandidate(null)
            }}
          >
            ← กลับ
          </button>
          {(() => {
            const c = getCandidateById(selectedCandidate)
            if (!c) return null

            const party = getPartyById(c.partyId)

            return (
              <>
                <h3>👤 {c.fname} {c.lname}</h3>
                <p>
                  <strong>พรรค:</strong>{" "}
                  <span
                    className="link-text"
                    onClick={() => {
                      setSelectedParty(party?.id || null)
                      setSelectedCandidate(null)
                    }}
                  >
                    {party?.name}
                  </span>
                </p>
                <p><strong>เขต:</strong> {c.district}</p>
              </>
            )
          })()}
        </div>
      )}
    </>
  )
}

