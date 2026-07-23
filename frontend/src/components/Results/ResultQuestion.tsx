type Props = {
  questionResults: Record<number, number>
}

export default function ResultQuestion({ questionResults }: Props) {
  const yes = questionResults[1] || 0
  const no = questionResults[2] || 0
  const abs = questionResults[3] || 0

  const totalQ = yes + no + abs

  // ✅ คิด % เป็น number
  const yesPct = (yes / totalQ) * 100
  const noPct = (no / totalQ) * 100
  const absPct = (abs / totalQ) * 100

  return (
    <div className="block question-layout">

      {totalQ === 0 ? (
        <div className="block-empty">
          <p className="empty">ยังไม่มีคะแนน</p>
        </div>
      ) : (
        <div className="block-body">
          <p className="question-text">ท่านเห็นชอบว่าสมควรมีรัฐธรรมนูญฉบับใหม่หรือไม่?</p>

          {/* 🔥 Progress bar Container ตัวใหม่ ครอบเพื่อให้โค้งมนสไตล์แคปซูล */}
          <div className="progress-bar">
              {yes > 0 && (
                <div
                  className="bar yes"
                  style={{ width: `${yesPct}%` }}
                >
                  {yesPct.toFixed(1)}%
                </div>
              )}

              {no > 0 && (
                <div
                  className="bar no"
                  style={{ width: `${noPct}%` }}
                >
                  {noPct.toFixed(1)}%
                </div>
              )}

              {abs > 0 && (
                <div
                  className="bar abstain"
                  style={{ width: `${absPct}%` }}
                >
                  {absPct.toFixed(1)}%
                </div>
              )}
            </div>

          {/* 📊 Cards Grid แสดงสถิติเสียง */}
          <div className="stats-grid">
            <div className="card yes">
              <p>เห็นชอบ</p>
              <h2>{yesPct.toFixed(1)}%</h2>
              <span>{yes} เสียง</span>
            </div>

            <div className="card no">
              <p>ไม่เห็นชอบ</p>
              <h2>{noPct.toFixed(1)}%</h2>
              <span>{no} เสียง</span>
            </div>

            <div className="card abstain">
              <p>งดออกเสียง</p>
              <h2>{absPct.toFixed(1)}%</h2>
              <span>{abs} เสียง</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

