type ReelDetailStatProps = {
  label: string
  value: string | number
  variant?: 'default' | 'accent' | 'success'
}

export default function ReelDetailStat({
  label,
  value,
  variant = 'default',
}: ReelDetailStatProps) {
  const valueClass = [
    'detail-stat__value',
    variant === 'accent' ? 'detail-stat__value--accent' : '',
    variant === 'success' ? 'detail-stat__value--success' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="detail-stat">
      <span className="detail-stat__label">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  )
}
