import { useState, useEffect } from "react";
import { getParties } from "../services/party";
import { getCandidates } from "../services/candidate";
import type { Party } from "../types/Party";
import type { Candidate } from "../types/Candidate";
import '../styles/DetailPage/DetailPage.css';
import '../styles/DetailPage/DetailBox.css';

export default function DetailsPage() {
  const [selectedPartyId, setSelectedPartyId] = useState<string | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [selectedDistrictDetail, setSelectedDistrictDetail] = useState<number | "all">("all");

  const [parties, setParties] = useState<Party[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadAllData() {
      try {
        const partyRes = await getParties();
        const candidateRes = await getCandidates();

        const partyList = Array.isArray(partyRes) ? partyRes : partyRes?.parties ?? [];
        const candidateList = Array.isArray(candidateRes) ? candidateRes : candidateRes?.candidates ?? [];

        setParties(partyList);
        setCandidates(candidateList);
      } catch (error) {
        console.error("Failed to load details page data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAllData();
  }, []);

  if (loading) {
    return <p className="loading-text">กำลังโหลดข้อมูล...</p>;
  }

  const districts = Array.from(new Set(candidates.map((c) => c.district))).sort((a, b) => a - b);

  const filteredCandidates =
    selectedDistrictDetail === "all"
      ? candidates
      : candidates.filter((c) => c.district === selectedDistrictDetail);

  const selectedParty = parties.find((p) => p._id === selectedPartyId);
  const selectedCandidate = candidates.find((c) => c._id === selectedCandidateId);

  return (
    <>
      {/* 📌 หน้าหลัก: แสดงรายการพรรค และผู้สมัคร */}
      {!selectedPartyId && !selectedCandidateId && (
        <div className="info-container">
          <h2 className="section-title">รายชื่อพรรค</h2>
          <div className="party-grid">
            {parties.map((party) => (
              <div
                key={party._id}
                className="party-info-card"
                onClick={() => {
                  setSelectedPartyId(party._id);
                  setSelectedCandidateId(null);
                }}
              >
                <div className="party-number">{party.number}</div>
                <div className="party-detail">
                  <h3>{party.name}</h3>
                  {/* ❌ ตัดส่วน policy-list ออกไปแล้ว */}
                </div>
              </div>
            ))}
          </div>

          <hr className="divider" />

          {/* Selector เลือกเขต */}
          <div className="detail-district-selector-container">
            <h2 className="section-title">รายชื่อผู้สมัคร</h2>
            <div className="detail-district-selector">
              <button
                className={selectedDistrictDetail === "all" ? "active" : ""}
                onClick={() => setSelectedDistrictDetail("all")}
              >
                ทั้งหมด
              </button>
              {districts.map((d) => (
                <button
                  key={d}
                  className={String(selectedDistrictDetail) === String(d) ? "active" : ""}
                  onClick={() => setSelectedDistrictDetail(d)}
                >
                  เขต {d}
                </button>
              ))}
            </div>
          </div>

          {/* รายการ Card ผู้สมัคร */}
          <div className="candidate-grid">
            {filteredCandidates.map((candidate) => {
              const partyName =
                typeof candidate.party === "object"
                  ? candidate.party?.name
                  : parties.find((p) => p._id === candidate.party)?.name || "ผู้สมัครอิสระ";

              return (
                <div
                  key={candidate._id}
                  className="candidate-info-card"
                  onClick={() => {
                    setSelectedCandidateId(candidate._id);
                    setSelectedPartyId(null);
                  }}
                >
                  <div className="candidate-avatar">👤</div>
                  <div className="candidate-text">
                    <h4>
                      {candidate.firstname} {candidate.lastname}
                    </h4>
                    <p className="party-tag">สังกัด: {partyName}</p>
                    <p className="district-tag">เขตเลือกตั้งที่ {candidate.district}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 🏛️ รายละเอียดพรรคที่เลือก */}
      {selectedParty && (
        <div className="detail-box">
          <button
            className="back-btn"
            onClick={() => {
              setSelectedPartyId(null);
              setSelectedCandidateId(null);
            }}
          >
            ← กลับ
          </button>

          <h3>🏛️ {selectedParty.name} (หมายเลข {selectedParty.number})</h3>

          {/* ❌ ตัดส่วน "นโยบายหลัก" ออกไปแล้ว */}

          <h4 style={{ marginTop: "20px" }}>👤 ผู้สมัครในพรรคนี้</h4>
          {(() => {
            const partyCandidates = candidates.filter((c) => {
              if (typeof c.party === "object") return c.party?._id === selectedParty._id;
              return c.party === selectedParty._id;
            });

            if (partyCandidates.length === 0) return <p>ไม่มีข้อมูลผู้สมัครในพรรคนี้</p>;

            return (
              <div className="candidate-list">
                {partyCandidates.map((c) => (
                  <div
                    key={c._id}
                    className="mini-candidate-card"
                    onClick={() => {
                      setSelectedCandidateId(c._id);
                      setSelectedPartyId(null);
                    }}
                  >
                    <span>
                      👤 {c.firstname} {c.lastname}
                    </span>
                    <span className="district">เขต {c.district}</span>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* 👤 รายละเอียดผู้สมัครที่เลือก */}
      {selectedCandidate && (
        <div className="detail-box">
          <button
            className="back-btn"
            onClick={() => {
              setSelectedPartyId(null);
              setSelectedCandidateId(null);
            }}
          >
            ← กลับ
          </button>

          <h3>
            👤 {selectedCandidate.firstname} {selectedCandidate.lastname}
          </h3>
          <p>
            <strong>พรรค:</strong>{" "}
            {(() => {
              const partyObj =
                typeof selectedCandidate.party === "object"
                  ? selectedCandidate.party
                  : parties.find((p) => p._id === selectedCandidate.party);

              if (!partyObj) return <span>ผู้สมัครอิสระ</span>;

              return (
                <span
                  className="link-text"
                  onClick={() => {
                    setSelectedPartyId(partyObj._id);
                    setSelectedCandidateId(null);
                  }}
                >
                  {partyObj.name}
                </span>
              );
            })()}
          </p>
          <p>
            <strong>เขตเลือกตั้ง:</strong> {selectedCandidate.district}
          </p>
        </div>
      )}
    </>
  );
}