/**
 * MPSAタイムライン
 * 年次のJPY価格＋為替の推移グラフと、価格改定イベント一覧
 */
import { useState } from "react";
import { Line } from "react-chartjs-2";
import { PRODUCTS } from "../../data/products";
import { YEARS, FX_BY_YEAR } from "../../data/fxRates";
import { PRICING_EVENTS } from "../../data/pricingEvents";
import { ProductSelect } from "../common/ProductSelect";
import { hasData } from "../../utils/decompose";

export function MpsaTimelineTab() {
  const [productKey, setProductKey] = useState("M365_E3");
  const p = PRODUCTS[productKey];
  const availableYears = YEARS.filter((y) => hasData(productKey, y));
  const labels = availableYears.map((y) => `${y}年`);
  const jpyData = availableYears.map((y) => p.jpy[y]!);
  const fxData = availableYears.map((y) => FX_BY_YEAR[y]);

  return (
    <>
      <div className="tab-section">
        <h2>MPSAタイムライン</h2>
        <p>年次の為替推移とJPY価格を重ねて表示。下のイベント表で、価格改定タイミングと連動を確認できます。</p>
        <div className="form-row">
          <ProductSelect value={productKey} onChange={setProductKey} />
        </div>
        <div className="chart-wrap tall">
          <Line
            data={{
              labels,
              datasets: [
                {
                  label: "JPY価格（左軸）",
                  data: jpyData,
                  borderColor: "#dc2626",
                  backgroundColor: "rgba(220,38,38,0.06)",
                  stepped: true,
                  borderWidth: 2,
                  yAxisID: "y",
                },
                {
                  label: "USD/JPY（右軸）",
                  data: fxData,
                  borderColor: "#ea580c",
                  backgroundColor: "rgba(234,88,12,0.04)",
                  tension: 0.25,
                  borderWidth: 1.8,
                  yAxisID: "y1",
                  borderDash: [3, 3],
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              interaction: { mode: "index", intersect: false },
              plugins: { legend: { position: "bottom" } },
              scales: {
                y: { position: "left", title: { display: true, text: "JPY価格（ユーザー/月）" } },
                y1: {
                  position: "right",
                  title: { display: true, text: "USD/JPY" },
                  grid: { drawOnChartArea: false },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="tab-section">
        <h2>価格改定イベント一覧</h2>
        <p>Microsoftのグローバル価格改定タイミング。MPSAの都度購入時の発注タイミング判断に。</p>
        <table className="data">
          <thead>
            <tr>
              <th>時期</th>
              <th>イベント内容</th>
            </tr>
          </thead>
          <tbody>
            {PRICING_EVENTS.map((ev, i) => (
              <tr key={i}>
                <td>
                  <strong>{ev.year}年{ev.month ? `${ev.month}月` : ""}</strong>
                </td>
                <td>{ev.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="note">
          発注前に最新の <strong>「🔔 価格改定ニュース」タブ</strong> も確認してください。
        </div>
      </div>
    </>
  );
}
