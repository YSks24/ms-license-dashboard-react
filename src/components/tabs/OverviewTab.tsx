/**
 * 概要タブ
 * KPI 4枚 + 積層棒（10年推移） + 年次内訳バー
 */
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import { PRODUCTS } from "../../data/products";
import { FX_BY_YEAR } from "../../data/fxRates";
import { ProductSelect } from "../common/ProductSelect";
import { KpiCard } from "../common/KpiCard";
import {
  decomposeChange,
  decomposeAbsolute,
  productAvailableYears,
} from "../../utils/decompose";
import { fmtJPY, fmtUSD, fmtFx, fmtPct } from "../../utils/format";

export function OverviewTab() {
  const [productKey, setProductKey] = useState("M365_E3");
  const p = PRODUCTS[productKey];
  const available = productAvailableYears(productKey);
  const first = available[0];
  const last = available[available.length - 1];
  const dec = decomposeChange(productKey, first, last);

  const usdIdx = (p.usd[last]! / p.usd[first]!) * 100;
  const jpyIdx = (p.jpy[last]! / p.jpy[first]!) * 100;
  const fxIdx = (FX_BY_YEAR[last] / FX_BY_YEAR[first]) * 100;

  // 積層棒データ（基準価格＋MS追加＋FX追加＋日本独自追加）
  const baseSeries = available.map(() => p.jpy[first]!);
  const msSeries = available.map(
    (y) => decomposeAbsolute(productKey, y, first).msAdd
  );
  const fxSeries = available.map(
    (y) => decomposeAbsolute(productKey, y, first).fxAdd
  );
  const localSeries = available.map(
    (y) => decomposeAbsolute(productKey, y, first).localAdd
  );

  // 年次内訳（前年比）
  const ybr = available.slice(1);
  const yoyDecs = ybr.map((y, i) =>
    decomposeChange(productKey, available[i], y)
  );

  return (
    <>
      <div className="kpi-grid">
        <KpiCard
          label={`${first}年 → ${last}年 USD価格`}
          value={
            <>
              {usdIdx.toFixed(0)}
              <span style={{ fontSize: 14 }}> 指数</span>
            </>
          }
          sub={`${fmtUSD(p.usd[first]!)} → ${fmtUSD(p.usd[last]!)}`}
        />
        <KpiCard
          label={`${first}年 → ${last}年 JPY価格`}
          value={
            <>
              {jpyIdx.toFixed(0)}
              <span style={{ fontSize: 14 }}> 指数</span>
            </>
          }
          sub={`${fmtJPY(p.jpy[first]!)} → ${fmtJPY(p.jpy[last]!)}`}
          accent="red"
        />
        <KpiCard
          label={`${first}年 → ${last}年 為替`}
          value={
            <>
              {fxIdx.toFixed(0)}
              <span style={{ fontSize: 14 }}> 指数</span>
            </>
          }
          sub={`${fmtFx(FX_BY_YEAR[first])} → ${fmtFx(FX_BY_YEAR[last])} 円/USD`}
          accent="orange"
        />
        <KpiCard
          label={`値上げ内訳（${first}→${last}）`}
          value={
            <span style={{ fontSize: 16 }}>
              MS {fmtPct(dec.msPct)}
              <br />
              FX {fmtPct(dec.fxPct)}
              <br />
              独自 {fmtPct(dec.localPct)}
            </span>
          }
          sub={`合計 ${fmtPct(dec.totalPct)}`}
          accent="green"
        />
      </div>

      <div className="tab-section">
        <h2>10年間の価格推移（積層棒）</h2>
        <p>
          基準価格＋MS都合＋為替＋日本独自の積み上げ。合計が当年のJPY価格。
        </p>
        <div className="form-row">
          <ProductSelect value={productKey} onChange={setProductKey} />
        </div>
        <div className="chart-wrap xtall">
          <Bar
            data={{
              labels: available.map(String),
              datasets: [
                {
                  label: `基準価格（${first}年）`,
                  data: baseSeries,
                  backgroundColor: "#64748b",
                  stack: "s",
                },
                {
                  label: "MS都合の値上げ分",
                  data: msSeries,
                  backgroundColor: "#2563eb",
                  stack: "s",
                },
                {
                  label: "為替影響分",
                  data: fxSeries,
                  backgroundColor: "#ea580c",
                  stack: "s",
                },
                {
                  label: "日本独自改定分",
                  data: localSeries,
                  backgroundColor: "#dc2626",
                  stack: "s",
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              interaction: { mode: "index", intersect: false },
              plugins: {
                legend: { position: "bottom" },
                tooltip: {
                  callbacks: {
                    label: (c) => c.dataset.label + "：" + fmtJPY(c.parsed.y ?? 0),
                  },
                },
              },
              scales: {
                x: { stacked: true, grid: { display: false } },
                y: {
                  stacked: true,
                  title: { display: true, text: "JPY価格（ユーザー/月）" },
                  ticks: {
                    callback: (v) => "¥" + Number(v).toLocaleString(),
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="tab-section">
        <h2>年次値上げの内訳（前年比）</h2>
        <p>前年からのJPY価格上昇率の3要素分解。</p>
        <div className="chart-wrap tall">
          <Bar
            data={{
              labels: ybr.map((y, i) => `${available[i]}→${y}`),
              datasets: [
                {
                  label: "MS都合",
                  data: yoyDecs.map((d) => d.msPct),
                  backgroundColor: "#2563eb",
                  stack: "s",
                },
                {
                  label: "為替",
                  data: yoyDecs.map((d) => d.fxPct),
                  backgroundColor: "#ea580c",
                  stack: "s",
                },
                {
                  label: "日本独自",
                  data: yoyDecs.map((d) => d.localPct),
                  backgroundColor: "#dc2626",
                  stack: "s",
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "bottom" },
                tooltip: {
                  callbacks: {
                    label: (c) => c.dataset.label + "：" + fmtPct(c.parsed.y ?? 0),
                  },
                },
              },
              scales: {
                x: { stacked: true, grid: { display: false } },
                y: {
                  stacked: true,
                  title: { display: true, text: "前年比 寄与度（%）" },
                  ticks: { callback: (v) => v + "%" },
                },
              },
            }}
          />
        </div>
      </div>
    </>
  );
}
