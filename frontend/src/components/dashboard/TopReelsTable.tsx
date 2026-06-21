import type { DashboardReelSummary } from '../../api/dashboard'

type TopReelsTableProps = {
  reels: DashboardReelSummary[]
}

export default function TopReelsTable({ reels }: TopReelsTableProps) {
  if (reels.length === 0) {
    return (
      <div className="card">
        <p className="text-muted">No reels tracked yet.</p>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th className="td-rank">#</th>
            <th>Campaign</th>
            <th>Slug</th>
            <th style={{ textAlign: 'right' }}>Clicks</th>
            <th style={{ textAlign: 'right' }}>Conversions</th>
            <th>Conversion Rate</th>
          </tr>
        </thead>
        <tbody>
          {reels.map((reel, index) => {
            const ratePercent = (reel.conversion_rate * 100).toFixed(2)
            const barWidth = Math.min(reel.conversion_rate * 100, 100)

            return (
              <tr key={reel.reel_id}>
                <td className="td-rank">{index + 1}</td>
                <td>
                  <span className="badge badge-purple">{reel.campaign_name}</span>
                </td>
                <td>
                  <span className="mono text-muted">{reel.slug}</span>
                </td>
                <td className="td-num">{reel.total_clicks.toLocaleString()}</td>
                <td className="td-num">{reel.total_conversions.toLocaleString()}</td>
                <td>
                  <div className="rate-bar-wrap">
                    <div className="rate-bar">
                      <div
                        className="rate-bar__fill"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <span className="rate-label">{ratePercent}%</span>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
