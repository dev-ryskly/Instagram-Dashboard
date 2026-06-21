type StatCardProps = {
  label: string
  value: string | number
  sublabel?: string
}

export default function StatCard({ label, value, sublabel }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card__accent" />
      <span className="stat-card__label">{label}</span>
      <span className="stat-card__value">{value}</span>
      {sublabel && (
        <span className="stat-card__sublabel">{sublabel}</span>
      )}
    </div>
  )
}
