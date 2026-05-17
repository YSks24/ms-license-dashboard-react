/**
 * 為替IFシミュレーター
 * スライダーで将来の為替を動かすと、各製品の想定JPY価格がリアルタイム更新
 */
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import { PRODUCTS } from "../../data/products";
import { FX_BY_YEAR } from "../../data/fxRates";
import { KpiCard } from "../common/KpiCard";
import { fmtJPY, fmtUSD, fmtPct, fmtJPYM } from "../../utils/format";

const PRESETS = [110, 130, 148, 160, 180];

export function FxSimulatorTab() {
  const [fxRate, setFxRate] = useState(148);
  const baseYear = 2027; // 2026年7月値上げ後のベースUSD価格
  const refYear = 2026;
  const currentFx = FX_BY_YEAR[refYear];

  // 各製品の想定価格を計算
  const rows = Object.entries(PRODUCTS)
    .map(([key, p]) => {
      const usd = p.usd[baseYear];
      const refJpy = p.jpy[refYear];
      const refUsd = p.usd[refYear];
      if (usd == null) return null;

      // 日本独自プレミアム（2026年実勢から）
      let markup = 1.0;
      if (refJpy != null && refUsd != null) {
        markup = refJpy / (refUsd * FX_BY_YEAR[refYear]);
      }
      const purelyFx = usd * fxRate;
      const projected = usd * fxRate * markup;
      const diffMonthly = refJpy != null ? projected - refJpy : null;

      return { key, label: p.label, usd, refJpy, purelyFx, projected, diffMonthly, markup };
    })
    .filter((r): r is NonNullable<typeof r> => r != null);

  const totalCurrent = rows.reduce((s, r) => s + (r.refJpy || 0), 0);
  const totalProjected = rows.reduce((s, r) => s + r.projected, 0);
  const totalDiff = totalProjected - totalCurrent;
  const annualImpact500 = totalDiff * 12 * 500;
  const delta = fxRate - currentFx;

  return (
    <>
      <div className="tab-section">
        <h2>為替IFシミュレーター</h2>
        <p>「もし将来の為替が○○円になったら、各ライセンスの日本円価格はどうなる？」をリアルタイム試算。</p>

        <div className="fx-slider-box">
          <div className="label">想定 USD/JPY レート</div>
          <div className="current-fx">
            {fxRate.toFixed(1)}<span className="unit">円 / USD</span>
          </div>
          <div className={`delta ${delta > 0 ? "up" : delta < 0 ? "down" : ""}`}>
            現在レート({currentFx}円)から{" "}
            <span className="strong">
              {delta >= 0 ? "+" : ""}{delta.toFixed(1)}円
            </span>{" "}
            {delta > 0 ? "（円安方向）" : delta < 0 ? "（円高方向）" : ""}
          </div>
          <input
            type="range"
            min="100"
            max="200"
            step="0.5"
            value={fxRate}
            onChange={(e) => setFxRate(parseFloat(e.target.value))}
          />
          <div className="slider-labels">
            <span>100円（超円高）</span>
            <span>130円</span>
            <span>150円</span>
            <span>170円</span>
            <span>200円（超円安）</span>
          </div>
          <div className="fx-preset">
            {PRESETS.map((p) => (
              <button
                key={p}
                className={Math.abs(p - fxRate) < 0.5 ? "active" : ""}
                onClick={() => setFxRate(p)}
              >
                {p}円
              </button>
            ))}
          </div>
        </div>

        <div className="kpi-grid">
          <KpiCard
            label="想定 USD/JPY"
            value={
              <>
                {fxRate.toFixed(1)}<span style={{ fontSize: 14 }}>円</span>
              </>
            }
            sub={`現在 ${currentFx}円`}
          />
          <KpiCard
            label="月額合計（全製品1ライセンスずつ）"
            value={fmtJPY(totalProjected)}
            sub={`現行：${fmtJPY(totalCurrent)}`}
            accent="red"
          />
          <KpiCard
            label="月額差分"
            value={`${totalDiff >= 0 ? "+" : ""}${fmtJPY(totalDiff)}`}
            sub={totalCurrent > 0 ? fmtPct((totalProjected / totalCurrent - 1) * 100) : "—"}
            accent="orange"
          />
          <KpiCard
            label="年間影響額（500人想定）"
            value={
              <span style={{ fontSize: 22 }}>
                {annualImpact500 >= 0 ? "+" : ""}{fmtJPYM(annualImpact500)}
              </span>
            }
            sub="月差分 × 12ヶ月 × 500人"
            accent="green"
          />
        </div>
      </div>

      <div className="tab-section">
        <h2>製品別 想定価格 一覧</h2>
        <p>
          ベースUSD価格は <strong>2027年（2026年7月値上げ後）</strong> の発表/予想値。
          「日本独自プレミアム」は2026年の実勢値を継承（Microsoft Japanの上乗せ率が変わらないと仮定）。
        </p>
        <table className="data">
          <thead>
            <tr>
              <th>製品</th>
              <th>ベースUSD価格</th>
              <th>純粋FX換算<br/>（USD×想定FX）</th>
              <th>想定JPY価格<br/>（プレミアム加味）</th>
              <th>現行JPY（2026年）</th>
              <th>差分 / 月</th>
              <th>差分 / 年（500人）</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const diff = r.diffMonthly;
              const diffAnnual = diff != null ? diff * 12 * 500 : null;
              const cls = diff != null ? (diff > 0 ? "pos" : diff < 0 ? "neg" : "") : "";
              return (
                <tr key={r.key}>
                  <td><strong>{r.label}</strong></td>
                  <td>{fmtUSD(r.usd)}</td>
                  <td>{fmtJPY(r.purelyFx)}</td>
                  <td>
                    <strong>{fmtJPY(r.projected)}</strong>{" "}
                    <span style={{ color: "#9ca3af", fontSize: 11 }}>(×{r.markup.toFixed(2)})</span>
                  </td>
                  <td>{r.refJpy != null ? fmtJPY(r.refJpy) : "—"}</td>
                  <td className={cls}>
                    {diff != null ? (diff >= 0 ? "+" : "") + fmtJPY(diff) : "—"}
                  </td>
                  <td className={cls}>
                    {diffAnnual != null ? (diffAnnual >= 0 ? "+" : "") + fmtJPYM(diffAnnual) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="tab-section">
        <h2>想定価格の比較グラフ</h2>
        <div className="chart-wrap tall">
          <Bar
            data={{
              labels: rows.map((r) => r.label),
              datasets: [
                {
                  label: `現行JPY価格（${refYear}年）`,
                  data: rows.map((r) => r.refJpy || 0),
                  backgroundColor: "#94a3b8",
                },
                {
                  label: `想定JPY価格（${fxRate.toFixed(1)}円時）`,
                  data: rows.map((r) => r.projected),
                  backgroundColor: "#2563eb",
                },
              ],
            }}
            options={{
              indexAxis: "y",
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "bottom" },
                tooltip: {
                  callbacks: {
                    label: (c) => c.dataset.label + "：" + fmtJPY(c.parsed.x ?? 0),
                  },
                },
              },
              scales: {
                x: {
                  title: { display: true, text: "JPY価格（ユーザー/月）" },
                  ticks: { callback: (v) => "¥" + Number(v).toLocaleString() },
                },
              },
            }}
          />
        </div>
      </div>
    </>
  );
}
