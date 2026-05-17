/**
 * データ一覧タブ
 *
 * 製品セレクタで切り替えて、その製品の年次データテーブルを表示。
 * useState で「いま選ばれている製品」を覚えて、
 * セレクタが変わると全テーブルが自動再描画される。
 */
import { useState } from "react";
import { PRODUCTS } from "../../data/products";
import { YEARS, FX_BY_YEAR } from "../../data/fxRates";
import { OFFICIAL_LINKS } from "../../data/officialLinks";
import { ProductSelect } from "../common/ProductSelect";
import { OfficialLinkButton } from "../common/OfficialLinkButton";
import { fmtJPY, fmtUSD, fmtFx, fmtPct } from "../../utils/format";
import { hasData } from "../../utils/decompose";

export function DataTab() {
  // ユーザーが選択中の製品キー
  const [productKey, setProductKey] = useState<string>("M365_E3");
  const product = PRODUCTS[productKey];

  return (
    <div className="tab-section">
      <h2>データ一覧</h2>
      <p>
        本ダッシュボードで使用している基礎データ。
        各年の「公式情報」リンクから Microsoft 公式発表レターを参照できます（リンク先は参考）。
      </p>

      <div className="form-row">
        <ProductSelect value={productKey} onChange={setProductKey} />
      </div>

      <table className="data">
        <thead>
          <tr>
            <th>年</th>
            <th>US価格（USD/月）</th>
            <th>日本価格（JPY/月）</th>
            <th>USD/JPY</th>
            <th>USD×FX 理論値</th>
            <th>日本独自プレミアム</th>
            <th className="center">公式情報</th>
          </tr>
        </thead>
        <tbody>
          {YEARS.map((y) => {
            // データが無い年は薄く「—」表示
            if (!hasData(productKey, y)) {
              return (
                <tr key={y} style={{ color: "#cbd5e1" }}>
                  <td>{y}年</td>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    —
                  </td>
                </tr>
              );
            }

            // データがある場合の計算
            const usd = product.usd[y]!;
            const jpy = product.jpy[y]!;
            const fx = FX_BY_YEAR[y];
            const theory = usd * fx;
            const premium = jpy / theory;
            const premPct = (premium - 1) * 100;
            const premCls = premPct > 5 ? "pos" : premPct < -5 ? "neg" : "";

            return (
              <tr key={y}>
                <td>{y}年</td>
                <td>{fmtUSD(usd)}</td>
                <td>{fmtJPY(jpy)}</td>
                <td>{fmtFx(fx)}</td>
                <td>{fmtJPY(theory)}</td>
                <td className={premCls}>
                  {premium.toFixed(2)}倍（{fmtPct(premPct)}）
                </td>
                <td className="center">
                  <OfficialLinkButton link={OFFICIAL_LINKS[y]} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="note">
        <strong>日本独自プレミアム</strong> ＝ 実JPY価格 ÷（US価格×為替）。
        1.0 を超えるとMicrosoft Japanが為替以上の値上げをしていることを意味します。
      </div>
    </div>
  );
}
