import { getCandidates, getCandidatesByDistrict, getDistricts} from "../../services/candidate.ts"
import { GetResults } from "../../services/voteServices.ts"
import { getPartyById } from "../../services/party.ts"
import { useState } from "react"

export default function ResultCandidate() {
    const [selectedDistrict, setSelectedDistrict] = useState<number | "all">(1)

    const filteredCandidates =
        selectedDistrict === "all"
            ? getCandidates()
            : getCandidatesByDistrict(selectedDistrict)

    const candidateResults = GetResults("candidate")
    const sortedCandidates = filteredCandidates.map((c) => {
        const count = candidateResults[c.id] || 0
        return { ...c, count }
    }).sort((a, b) => b.count - a.count)

    const top3Candidates = sortedCandidates.slice(0, 3)
    const ntop3Candidates = sortedCandidates.slice(3)

    const totalCandidateVotes = Object.values(candidateResults).reduce((a, b) => a + b, 0)

    const districts = getDistricts()

    return (
        <div className="district-wrapper">
            <div className="block-header">
                <h3>คะแนนผู้สมัคร</h3>
            </div>

            {totalCandidateVotes === 0 ? (
                <div className="block-empty">
                    <p className="empty">ยังไม่มีคะแนน</p>
                </div>
            ) : (
                <>
                    <div className="district-selector-container">
                        <div className="district-selector">
                            {districts && districts.map((d) => (
                                <button
                                    key={d}
                                    className={String(selectedDistrict) === String(d) ? "active" : ""}
                                    onClick={() => setSelectedDistrict(d)}
                                >
                                    เขต {d}
                                </button>
                            ))}
                            <button
                                className={selectedDistrict === "all" ? "active" : ""}
                                onClick={() => setSelectedDistrict("all")}
                            >
                                ทั้งหมด
                            </button>
                        </div>
                    </div>

                    {/* 🏆 Layout แดชบอร์ดรายบุคคล แบ่งฝั่ง ซ้าย (โพเดียม) และ ขวา (ลำดับอื่น ๆ) */}
                    <div className="candidate-layout" style={{ gridTemplateColumns: '1.4fr 1fr' }}>

                        {/* 🥇🥈🥉 ฝั่งซ้าย: เปลี่ยนเป็นแท่นรับรางวัลแบบ Podium 3 มิติ */}
                        <section className="candidate-podium-wrapper">

                            <div className="top3-podium">
                                {/* [อันดับ 2] */}
                                {top3Candidates[1] && (() => {
                                    const percent = ((top3Candidates[1].count / totalCandidateVotes) * 100).toFixed(1);
                                    const party = getPartyById(top3Candidates[1].partyId)
                                    return (
                                        <div className="podium-column rank-2">
                                            <div className="medal-avatar">2</div>
                                            <p className="name">{top3Candidates[1].fname} {top3Candidates[1].lname}</p>
                                            <p className="party" style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '0 0 6px 0' }}>{party ? party.name : "ผู้สมัครอิสระ"}</p>
                                            <span className="score">{top3Candidates[1].count} คะแนน ({percent}%)</span>
                                            <div className="podium-display"></div>
                                        </div>
                                    );
                                })()}

                                {/* [อันดับ 1] */}
                                {top3Candidates[0] && (() => {
                                    const percent = ((top3Candidates[0].count / totalCandidateVotes) * 100).toFixed(1);
                                    const party = getPartyById(top3Candidates[0].partyId)
                                    return (
                                        <div className="podium-column rank-1">
                                            <div className="medal-avatar">1</div>
                                            <p className="name">{top3Candidates[0].fname} {top3Candidates[0].lname}</p>
                                            <p className="party" style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '0 0 6px 0' }}>{party ? party.name : "ผู้สมัครอิสระ"}</p>
                                            <span className="score" style={{ fontWeight: '600' }}>{top3Candidates[0].count} คะแนน ({percent}%)</span>
                                            <div className="podium-display"></div>
                                        </div>
                                    );
                                })()}

                                {/* [อันดับ 3] */}
                                {top3Candidates[2] && (() => {
                                    const percent = ((top3Candidates[2].count / totalCandidateVotes) * 100).toFixed(1);
                                    const party = getPartyById(top3Candidates[2].partyId)
                                    return (
                                        <div className="podium-column rank-3">
                                            <div className="medal-avatar">3</div>
                                            <p className="name">{top3Candidates[2].fname} {top3Candidates[2].lname}</p>
                                            <p className="party" style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '0 0 6px 0' }}>{party ? party.name : "ผู้สมัครอิสระ"}</p>
                                            <span className="score">{top3Candidates[2].count} คะแนน ({percent}%)</span>
                                            <div className="podium-display"></div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </section>

                        {/* 📊 ฝั่งขวา: รายชื่อลำดับอื่น ๆ สไตล์คลาสสิก สะอาดตา */}
                        <section className="others-side">
                            <ul className="results-list">
                                {ntop3Candidates && ntop3Candidates.map((c, index) => {
                                    const percent = totalCandidateVotes > 0 ? ((c.count / totalCandidateVotes) * 100).toFixed(1) : "0.0";
                                    const party = getPartyById(c.partyId)
                                    const realRank = index + 4;

                                    return (
                                        <li key={c.id} className="result-item">
                                            <span className="rank-num">{realRank}</span>
                                            <span className="party-name">
                                                {c.fname} {c.lname} <small style={{ color: 'var(--color-text-muted)' }}>({party ? party.name : "อิสระ"})</small>
                                            </span>
                                            <span className="vote-stats">{c.count} <small>({percent}%)</small></span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>

                    </div>
                </>
            )}
        </div >
    );
}

