import { getParties } from "../../services/party.ts"

type Props = {
    partyResults: Record<number, number>
}

export default function ResultParty({ partyResults }: Props) {

    const totalPartyVotes = Object.values(partyResults).reduce((a, b) => a + b, 0)
    const sortedParties = getParties().map((party) => {
        const count = partyResults[party.id] || 0
        return { ...party, count }
    }).sort((a, b) => b.count - a.count)

    return (
        <div className="block party-layout">

            {totalPartyVotes === 0 ? (
                <div className="block-empty">
                 <p className="empty">ยังไม่มีคะแนน</p>
                </div>
            ) : (
                <>
                    {/* 🔥 TOP 3 Podium Section */}
                    <div className="top3-podium">
                        {sortedParties.slice(0, 3).map((party, index) => {
                            const percent = ((party.count / totalPartyVotes) * 100).toFixed(1);

                            // สร้างโครงสร้างลำดับ 1, 2, 3 เพื่อให้ CSS Flexbox สลับตำแหน่ง 2 - 1 - 3 อัตโนมัติ
                            return (
                                <div key={party.id} className={`podium-column rank-${index + 1}`}>
                                    <div className="medal-avatar">{index + 1}</div>
                                    <p className="name">{party.name}</p>
                                    <span className="score">{party.count} เสียง ({percent}%)</span>
                                    <div className="podium-display"></div> {/* แท่นสี ทอง/เงิน/ทองแดง จะงอกมาจากคลาสนี้ */}
                                </div>
                            );
                        })}
                    </div>

                    {/* 📊 Others Section (อันดับ 4 เป็นต้นไป) */}
                    {sortedParties.length > 3 && (
                        <div className="others-container">
                            <ul className="results-list">
                                {sortedParties.slice(3, 7).map((party, index) => {
                                    const percent = ((party.count / totalPartyVotes) * 100).toFixed(1);

                                    return (
                                        <li key={party.id} className="result-item">
                                            <span className="rank-num">{index + 4}</span>
                                            <span className="party-name">{party.name}</span>
                                            <span className="vote-stats">
                                                {party.count} <small>({percent}%)</small>
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </>
            )
            }
        </div >
    )
}