/** 数値入力（再利用部品） */
interface NumberInputProps {
  value: number;
  onChange: (n: number) => void;
  label: string;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberInput({
  value, onChange, label,
  min = 0, max, step = 1,
}: NumberInputProps) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
      />
    </div>
  );
}
