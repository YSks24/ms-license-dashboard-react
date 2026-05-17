/**
 * 製品比較ビュー
 * 全製品の値上げ率を横並びで比較
 */
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import { PRODUCTS } from "../../data/products";
import { YearSelect } from "../common/YearSelect";
import { NumberInput } from "../common/NumberInput";
import { decomposeChange, hasData } from "../../utils/decompose";
import { fmtJPY, fmtPct, fmtJPYM } from "../../utils/format";

export function CompareTab() {
  const [yearA, setYearA] = useState(2020);
  const [yearB, setYearB] = useState(2027);
  const [users, setUsers] = useState(500);

  const decs = Object.keys(PRODUCTS).map((k) => ({
    key: k,
    label: PRODUCTS[k].label,
    dec: decomposeChange(k, yearA, yearB),
    available: hasData(k, yearA) && hasData(k, yearB),
  }));
  const visible = decs.filter((d) => d.available);
  const unavail = decs.filter((d) => !d.available);

  return (
    <>
      <div className="tab-section">
        <h2>製品比較ビュー</h2>
        <p>全製品の値上げ率を横並びで比較。「どの製品が一番値上がりしているか」を一目で確認。</p>
        <div className="form-row">
          <YearSelect value={yearA} onChange={setYearA} label="基準年" />
          <YearSelect value={yearB} onChange={setYearB} label="比較年" />
          <NumberInput value={users} onChange={setUsers} label="合計ライセンス数" step={50} />
        </div>
        <div className="chart-wrap tall">
          <Bar
            data={{
              labels: visible.map((d) => d.label),
              datasets: [
                { label: "MS都合", data: visible.map((d) => d.dec.msPct), backgroundColor: "#2563eb", stack: "s" },
                { label: "為替", data: visible.map((d) => d.dec.fxPct), backgroundColor: "#ea580c", stack: "s" },
                { label: "日本独自", data: visible.map((d) => d.dec.localPct), backgroundColor: "#dc2626", stack: "s" },
              ],
            }}
            options={{
              indexAxis: "y",
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: { display: true, text: `${yearA}年 → ${yearB}年 値上げ率の製品別比較` },
                legend: { position: "bottom" },
                tooltip: {
                  callbacks: {
                    label: (c) => c.dataset.label + "：" + fmtPct(c.parsed.x ?? 0),
                  },
                },
              },
              scales: {
                x: {
                  stacked: true,
                  title: { display: true, text: "値上げ率（%）" },
                  ticks: { callback: (v) => v + "%" },
                },
                y: { stacked: true },
              },
            }}
          />
        </div>
      </div>

      <div className="tab-section">
        <h2>製品別 詳細比較表</h2>
        <table className="data">
          <thead>
            <tr>
              <th>製品</th>
              <th>JPY価格（基準年）</th>
              <th>JPY価格（比較年）</th>
              <th>総変動率</th>
              <th>MS都合</th>
              <th>為替</th>
              <th>日本独自</th>
              <th>年間影響額</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((d) => {
              const p = PRODUCTS[d.key];
              const annualImpact = (p.jpy[yearB]! - p.jpy[yearA]!) * 12 * users;
              const totalCls = d.dec.totalPct > 0 ? "pos" : d.dec.totalPct < 0 ? "neg" : "";
              return (
                <tr key={d.key}>
                  <td><strong>{d.label}</strong></td>
                  <td>{fmtJPY(p.jpy[yearA]!)}</td>
                  <td>{fmtJPY(p.jpy[yearB]!)}</td>
                  <td className={totalCls}>{fmtPct(d.dec.totalPct)}</td>
                  <td>{fmtPct(d.dec.msPct)}</td>
                  <td>{fmtPct(d.dec.fxPct)}</td>
                  <td>{fmtPct(d.dec.localPct)}</td>
                  <td className={annualImpact > 0 ? "pos" : annualImpact < 0 ? "neg" : ""}>
                    {annualImpact >= 0 ? "+" : ""}{fmtJPYM(annualImpact)}
                  </td>
                </tr>
              );
            })}
            {unavail.map((d) => (
              <tr key={d.key} style={{ color: "#9ca3af" }}>
                <td><strong>{d.label}</strong></td>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  この期間のデータなし
                  {PRODUCTS[d.key].availableFrom
                    ? `（${PRODUCTS[d.key].availableFrom}年〜）`
                    : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
