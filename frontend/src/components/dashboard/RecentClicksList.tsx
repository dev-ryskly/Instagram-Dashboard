import type { RecentClick } from '../../api/dashboard'

type RecentClicksListProps = {
  clicks: RecentClick[]
}

export default function RecentClicksList({ clicks }: RecentClicksListProps) {
  if (clicks.length === 0) {
    return (
      <div className="card">
        <p className="text-muted">No clicks recorded yet.</p>
      </div>
    )
  }

  return (
    <ul className="click-list">
      {clicks.map((click, index) => (
        <li key={index} className="click-list__item">
          <div className="click-list__left">
            <span className="click-list__dot" />
            <div>
              <div className="click-list__slug">/{click.slug}</div>
              <div className="click-list__reel">{click.reel_id}</div>
            </div>
          </div>
          <time
            className="click-list__time"
            dateTime={click.visited_at}
          >
            {new Date(click.visited_at).toLocaleString()}
          </time>
        </li>
      ))}
    </ul>
  )
}
