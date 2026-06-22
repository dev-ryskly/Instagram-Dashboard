interface PublishButtonProps {
  loading: boolean
  disabled: boolean
}

export default function PublishButton({ loading, disabled }: PublishButtonProps) {
  return (
    <button
      type="submit"
      className="btn-primary"
      disabled={disabled || loading}
      style={{ width: '100%' }}
    >
      {loading ? 'Publishing...' : 'Publish & Track'}
    </button>
  )
}
