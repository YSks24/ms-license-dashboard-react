/**
 * ソースタイプの凡例
 * ニュースリストの上に表示する小さな説明バー
 */
export function NewsLegend() {
  return (
    <div className="sources-legend">
      <strong style={{ color: "#374151" }}>📚 ソース凡例：</strong>
      <span className="item">
        <span className="swatch" style={{ background: "#dbeafe", borderColor: "#93c5fd" }} />
        公式（Microsoft 一次情報）
      </span>
      <span className="item">
        <span className="swatch" style={{ background: "#fce7f3", borderColor: "#fbcfe8" }} />
        報道（メディア記事）
      </span>
      <span className="item">
        <span className="swatch" style={{ background: "#ecfccb", borderColor: "#bef264" }} />
        分析（業界レポート）
      </span>
      <span className="item">
        <span className="swatch" style={{ background: "#f3f4f6", borderColor: "#d1d5db" }} />
        推定/予想（モック値）
      </span>
    </div>
  );
}
