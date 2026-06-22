interface CaptionInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export default function CaptionInput({ value, onChange, disabled }: CaptionInputProps) {
  return (
    <div className="form-field">
      <label className="form-label" htmlFor="caption-input">
        Caption
      </label>
      <textarea
        id="caption-input"
        className="form-input form-textarea"
        placeholder="Write your caption..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={4}
      />
    </div>
  )
}
