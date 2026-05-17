/**
 * 構成シミュレーター
 * 全製品の数量を入力 → 自社全体の年間総影響額を一括計算
 */
import { useState } from "react";
import { PRODUCTS } from "../../data/products";
import { YearSelect } from "../common/YearSelect";
import { ImpactMegaCard } from "../common/ImpactMegaCard";
import { decomposeChange, hasData } from "../../utils/decompose";
import { fmtJPY, fmtJPYM, fmtPct } from "../../utils/format";

const PRESETS: Record<string, Record<string, number>> = {
  small: { M365_E3: 80, M365_E5: 10, DEFENDER_EP_P1: 80, POWERBI_PRO: 30 },
  mid: { M365_E3: 400, M365_E5: 50, DEFENDER_EP_P2: 100, ENTRA_P2: 50, POWERBI_PRO: 200, INTUNE: 400 },
  large: { M365_E3: 3500, M365_E5: 500, M365_E7: 30, DEFENDER_EP_P2: 1000, ENTRA_P2: 500, POWERBI_PRO: 2000, INTUNE: 4000 },
};

export function ConfigSimulatorTab() {
  const [yearA, setYearA] = useState(2023);
  const [yearB, setYearB] = useState(2027);
  const [qty, setQty] = useState<Record<string, number>>({
    M365_E3: 400,
    M365_E5: 50,
    DEFENDER_EP_P2: 100,
    ENTRA_P2: 50,
    POWERBI_PRO: 200,
  });

  const applyPreset = (name: string) => {
    if (name === "clear") setQty({});
    else if (PRESETS[name]) setQty({ ...PRESETS[name] });
  };

  const updateQty = (k: string, n: number) => {
    setQty((prev) => ({ ...prev, [k]: Math.max(0, n) }));
  };

  let totalImpact = 0, totalMs = 0, totalFx = 0, totalLocal = 0;
  let totalBefore = 0, totalAfter = 0;

  const rows = Object.entries(PRODUCTS).map(([key, p]) => {
    const q = qty[key] || 0;
    const hasA = hasData(key, yearA);
    const hasB = hasData(key, yearB);
    if (!hasA || !hasB) {
      return { key, p, q, hasData: false as const };
    }
    const dec = decomposeChange(key, yearA, yearB);
    const monthlyDiff = p.jpy[yearB]! - p.jpy[yearA]!;
    const annualImpact = monthlyDiff * 12 * q;
    const rMs = dec.totalPct === 0 ? 0 : dec.msPct / dec.totalPct;
    const rFx = dec.totalPct === 0 ? 0 : dec.fxPct / dec.totalPct;
    const rLocal = dec.totalPct === 0 ? 0 : dec.localPct / dec.totalPct;
    const iMs = annualImpact * rMs;
    const iFx = annualImpact * rFx;
    const iLocal = annualImpact * rLocal;
    totalImpact += annualImpact;
    totalMs += iMs;
    totalFx += iFx;
    totalLocal += iLocal;
    totalBefore += p.jpy[yearA]! * 12 * q;
    totalAfter += p.jpy[yearB]! * 12 * q;
    return {
      key, p, q,
      hasData: true as const,
      monthlyDiff, annualImpact, totalPct: dec.totalPct,
      iMs, iFx, iLocal,
    };
  });

  const totalLicenses = Object.values(qty).reduce((a, b) => a + b, 0);

  return (
    <div className="tab-section">
      <h2>自社ライセンス構成シミュレーター</h2>
      <p>全製品の数量を入力すると、契約期間における「年間総影響額」と内訳が一括で計算されます。</p>

      <div className="form-row">
        <YearSelect value={yearA} onChange={setYearA} label="契約開始年" />
        <YearSelect value={yearB} onChange={setYearB} label="更新年" />
        <div className="form-group">
          <label>プリセット</label>
          <select
            value=""
            onChange={(e) => {
              applyPreset(e.target.value);
              e.target.value = "";
            }}
          >
            <option value="">-- 選択 --</option>
            <option value="small">中小企業（100名）</option>
            <option value="mid">中堅企業（500名）</option>
            <option value="large">大企業（5000名）</option>
            <option value="clear">全てクリア</option>
          </select>
        </div>
      </div>

      <ImpactMegaCard
        label={`自社全体の年間影響額（全${totalLicenses.toLocaleString()}ライセンス合算 / ${yearA}年→${yearB}年）`}
        totalImpact={totalImpact}
        subLabel={`年間総コスト：${fmtJPYM(totalBefore)} → ${fmtJPYM(totalAfter)}（3年累計差額：${totalImpact * 3 >= 0 ? "+" : ""}${fmtJPYM(totalImpact * 3)}）`}
        breakdown={{ ms: totalMs, fx: totalFx, local: totalLocal }}
      />

      <table className="data">
        <thead>
          <tr>
            <th>ライセンス名</th>
            <th className="center">購入数量</th>
            <th>開始年 単価/月</th>
            <th>更新年 単価/月</th>
            <th>月額単価 変化</th>
            <th>年間影響額</th>
            <th>うちMS都合</th>
            <th>うち為替</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key}>
              <td>
                <strong>{r.p.label}</strong>
                {r.p.isNew && <span className="badge-new">NEW</span>}
              </td>
              <td className="center">
                <input
                  type="number"
                  className="qty-input"
                  value={r.q}
                  min={0}
                  step={10}
                  onChange={(e) =>
                    updateQty(r.key, parseInt(e.target.value, 10) || 0)
                  }
                />
              </td>
              {r.hasData ? (
                <>
                  <td>{fmtJPY(r.p.jpy[yearA]!)}</td>
                  <td>{fmtJPY(r.p.jpy[yearB]!)}</td>
                  <td className={r.monthlyDiff > 0 ? "pos" : r.monthlyDiff < 0 ? "neg" : ""}>
                    {r.monthlyDiff >= 0 ? "+" : ""}{fmtJPY(r.monthlyDiff)} ({fmtPct(r.totalPct)})
                  </td>
                  <td className={r.annualImpact > 0 ? "pos" : r.annualImpact < 0 ? "neg" : ""}>
                    {r.q === 0
                      ? "—"
                      : (r.annualImpact >= 0 ? "+" : "") + fmtJPYM(r.annualImpact)}
                  </td>
                  <td>
                    {r.q === 0 ? "—" : (r.iMs >= 0 ? "+" : "") + fmtJPYM(r.iMs)}
                  </td>
                  <td>
                    {r.q === 0 ? "—" : (r.iFx >= 0 ? "+" : "") + fmtJPYM(r.iFx)}
                  </td>
                </>
              ) : (
                <td colSpan={6} style={{ textAlign: "center", color: "#9ca3af" }}>
                  この期間データなし
                </td>
              )}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ background: "#f1f5f9", fontWeight: 700 }}>
            <td colSpan={5}>合計（{totalLicenses.toLocaleString()}ライセンス）</td>
            <td className={totalImpact > 0 ? "pos" : totalImpact < 0 ? "neg" : ""}>
              {totalImpact >= 0 ? "+" : ""}{fmtJPYM(totalImpact)}
            </td>
            <td>{totalMs >= 0 ? "+" : ""}{fmtJPYM(totalMs)}</td>
            <td>{totalFx >= 0 ? "+" : ""}{fmtJPYM(totalFx)}</td>
          </tr>
        </tfoot>
      </table>

      <div className="note">
        <strong>計算式：</strong>各製品の「年間影響額 =（更新年単価 − 開始年単価）× 12 × 数量」。
        内訳は対数分解で算出。
      </div>
    </div>
  );
}
