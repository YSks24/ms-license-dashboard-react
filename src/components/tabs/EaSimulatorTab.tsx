/**
 * EA契約シミュレーター
 * 単一製品 × 契約期間 × ライセンス数 → 値上げ総額と内訳
 */
import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { PRODUCTS } from "../../data/products";
import { ProductSelect } from "../common/ProductSelect";
import { YearSelect } from "../common/YearSelect";
import { NumberInput } from "../common/NumberInput";
import { KpiCard } from "../common/KpiCard";
import { ImpactMegaCard } from "../common/ImpactMegaCard";
import { decomposeChange, hasData } from "../../utils/decompose";
import { fmtJPY, fmtUSD, fmtFx, fmtPct, fmtJPYM } from "../../utils/format";

export function EaSimulatorTab() {
  const [productKey, setProductKey] = useState("M365_E3");
  const [yearA, setYearA] = useState(2023);
  const [yearB, setYearB] = useState(2026);
  const [users, setUsers] = useState(500);
  const p = PRODUCTS[productKey];

  // データ不足チェック
  if (!hasData(productKey, yearA) || !hasData(productKey, yearB)) {
    return (
      <div className="tab-section">
        <h2>EA契約 値上がりシミュレーション</h2>
        <div className="form-row">
          <ProductSelect value={productKey} onChange={setProductKey} />
          <YearSelect value={yearA} onChange={setYearA} label="契約開始年" />
          <YearSelect value={yearB} onChange={setYearB} label="更新年" />
          <NumberInput value={users} onChange={setUsers} label="ライセンス数" step={50} />
        </div>
        <div className="alert warn">
          <div className="title">⚠ データ不足</div>
          選択した期間（{yearA}年→{yearB}年）に、{p.label}のデータがありません。
          {p.availableFrom && ` この製品は ${p.availableFrom}年 から提供開始です。`}
        </div>
      </div>
    );
  }

  const dec = decomposeChange(productKey, yearA, yearB);
  const monthlyDiff = p.jpy[yearB]! - p.jpy[yearA]!;
  const annualImpact = monthlyDiff * 12 * users;
  const ratioMs = dec.totalPct === 0 ? 0 : dec.msPct / dec.totalPct;
  const ratioFx = dec.totalPct === 0 ? 0 : dec.fxPct / dec.totalPct;
  const ratioLocal = dec.totalPct === 0 ? 0 : dec.localPct / dec.totalPct;
  const impactMs = annualImpact * ratioMs;
  const impactFx = annualImpact * ratioFx;
  const impactLocal = annualImpact * ratioLocal;

  return (
    <div className="tab-section">
      <h2>EA契約 値上がりシミュレーション</h2>
      <p>契約開始年と更新年、自社のライセンス数を入力すると、値上げ総額と内訳が表示されます。</p>

      <div className="form-row">
        <ProductSelect value={productKey} onChange={setProductKey} />
        <YearSelect value={yearA} onChange={setYearA} label="契約開始年" />
        <YearSelect value={yearB} onChange={setYearB} label="更新年" />
        <NumberInput value={users} onChange={setUsers} label="ライセンス数" step={50} />
      </div>

      <ImpactMegaCard
        label={`自社全体の年間影響額（${users.toLocaleString()}ライセンス × ${p.label} × ${yearA}→${yearB}年）`}
        totalImpact={annualImpact}
        subLabel={`月額1人あたり ${monthlyDiff >= 0 ? "+" : ""}${fmtJPY(monthlyDiff)} × 12ヶ月 × ${users.toLocaleString()}人`}
        breakdown={{ ms: impactMs, fx: impactFx, local: impactLocal }}
      />

      <div className="kpi-grid">
        <KpiCard label="契約期間" value={`${yearA}年 → ${yearB}年`} sub={`${yearB - yearA}年間`} />
        <KpiCard
          label="月額1人あたり値上げ率"
          value={fmtPct(dec.totalPct)}
          sub={`${fmtJPY(p.jpy[yearA]!)} → ${fmtJPY(p.jpy[yearB]!)}`}
          accent="red"
        />
        <KpiCard
          label="年間総コスト（更新後）"
          value={fmtJPYM(p.jpy[yearB]! * 12 * users)}
          sub={`更新前：${fmtJPYM(p.jpy[yearA]! * 12 * users)}`}
          accent="orange"
        />
        <KpiCard
          label="3年契約 累計差額"
          value={(annualImpact >= 0 ? "+" : "") + fmtJPYM(annualImpact * 3)}
          sub="年間影響額 × 3年"
          accent="green"
        />
      </div>

      <div className="two-col">
        <div>
          <div className="chart-wrap">
            <Doughnut
              data={{
                labels: [
                  `MS都合 ${fmtPct(dec.msPct)}`,
                  `為替 ${fmtPct(dec.fxPct)}`,
                  `日本独自 ${fmtPct(dec.localPct)}`,
                ],
                datasets: [
                  {
                    data: [Math.abs(dec.msPct), Math.abs(dec.fxPct), Math.abs(dec.localPct)],
                    backgroundColor: ["#2563eb", "#ea580c", "#dc2626"],
                    borderWidth: 2,
                    borderColor: "#fff",
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "bottom" },
                  title: { display: true, text: "値上げ要因の構成比", font: { size: 13 } },
                },
                cutout: "55%",
              }}
            />
          </div>
        </div>
        <div>
          <table className="data">
            <thead>
              <tr>
                <th>項目</th>
                <th>開始年</th>
                <th>更新年</th>
                <th>変化</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>US価格</td>
                <td>{fmtUSD(dec.usdA)}</td>
                <td>{fmtUSD(dec.usdB)}</td>
                <td className={dec.usdB > dec.usdA ? "pos" : dec.usdB < dec.usdA ? "neg" : ""}>
                  {fmtPct((dec.usdB / dec.usdA - 1) * 100)}
                </td>
              </tr>
              <tr>
                <td>JPY価格</td>
                <td>{fmtJPY(dec.jpyA)}</td>
                <td>{fmtJPY(dec.jpyB)}</td>
                <td className={dec.totalPct > 0 ? "pos" : dec.totalPct < 0 ? "neg" : ""}>
                  {fmtPct(dec.totalPct)}
                </td>
              </tr>
              <tr>
                <td>USD/JPY</td>
                <td>{fmtFx(dec.fxA)}</td>
                <td>{fmtFx(dec.fxB)}</td>
                <td className={dec.fxB > dec.fxA ? "pos" : dec.fxB < dec.fxA ? "neg" : ""}>
                  {fmtPct((dec.fxB / dec.fxA - 1) * 100)}
                </td>
              </tr>
              <tr>
                <td>MS都合 寄与</td><td>—</td><td>—</td>
                <td className={dec.msPct > 0 ? "pos" : dec.msPct < 0 ? "neg" : ""}>{fmtPct(dec.msPct)}</td>
              </tr>
              <tr>
                <td>為替 寄与</td><td>—</td><td>—</td>
                <td className={dec.fxPct > 0 ? "pos" : dec.fxPct < 0 ? "neg" : ""}>{fmtPct(dec.fxPct)}</td>
              </tr>
              <tr>
                <td>日本独自 寄与</td><td>—</td><td>—</td>
                <td className={dec.localPct > 0 ? "pos" : dec.localPct < 0 ? "neg" : ""}>{fmtPct(dec.localPct)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
