/** 大きな影響額表示カード（再利用部品） */
import { fmtJPYM } from "../../utils/format";

interface ImpactMegaCardProps {
  label: string;
  totalImpact: number;
  subLabel?: string;
  breakdown: {
    ms: number;
    fx: number;
    local: number;
  };
}

export function ImpactMegaCard({
  label, totalImpact, subLabel, breakdown,
}: ImpactMegaCardProps) {
  const sumAbs =
    Math.abs(breakdown.ms) + Math.abs(breakdown.fx) + Math.abs(breakdown.local);
  const pctText = (n: number) =>
    sumAbs === 0 ? "0% 寄与" : ((Math.abs(n) / sumAbs) * 100).toFixed(1) + "% 寄与";

  const signed = (n: number) => (n >= 0 ? "+" : "") + fmtJPYM(n);

  return (
    <div className="impact-mega">
      <div className="label">{label}</div>
      <div className="value-main">
        {signed(totalImpact)}
        <span className="unit">/ 年</span>
      </div>
      {subLabel && <div className="sub-main">{subLabel}</div>}
      <div className="breakdown">
        <div className="breakdown-item ms">
          <div className="bk-label">うち Microsoft都合</div>
          <div className="bk-value">{signed(breakdown.ms)}</div>
          <div className="bk-pct">{pctText(breakdown.ms)}</div>
        </div>
        <div className="breakdown-item fx">
          <div className="bk-label">うち 為替影響</div>
          <div className="bk-value">{signed(breakdown.fx)}</div>
          <div className="bk-pct">{pctText(breakdown.fx)}</div>
        </div>
        <div className="breakdown-item local">
          <div className="bk-label">うち 日本独自改定</div>
          <div className="bk-value">{signed(breakdown.local)}</div>
          <div className="bk-pct">{pctText(breakdown.local)}</div>
        </div>
      </div>
    </div>
  );
}
