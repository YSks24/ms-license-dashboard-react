/** 年セレクタ（再利用部品） */
import { YEARS } from "../../data/fxRates";

interface YearSelectProps {
  value: number;
  onChange: (year: number) => void;
  label?: string;
}

export function YearSelect({ value, onChange, label = "年" }: YearSelectProps) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(parseInt(e.target.value, 10))}>
        {YEARS.map((y) => (
          <option key={y} value={y}>
            {y}年
          </option>
        ))}
      </select>
    </div>
  );
}
