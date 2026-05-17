/**
 * 1件のニュースカード
 *
 * 親（NewsTab）から1つのニュース情報を受け取って描画する。
 * 中で SourceChip を呼び出す（コンポーネントの入れ子）。
 *
 * ※ 型名 `NewsItem` と コンポーネント名 `NewsItem` が衝突するので
 *    型をインポートするときは `as NewsItemType` でリネームする慣習。
 */
import type { NewsItem as NewsItemType } from "../../types";
import { PRODUCTS } from "../../data/products";
import { SourceChip } from "./SourceChip";

interface NewsItemProps {
  news: NewsItemType;
}

export function NewsItem({ news }: NewsItemProps) {
  return (
    <div className={`news-item ${news.severity}`}>
      {/* 日付＋バッジ */}
      <div className="head">
        <span className="date">{news.date}</span>
        <span className="news-badge">{news.badge}</span>
        {news.unread && (
          <span className="news-badge" style={{ background: "#dc2626", color: "#fff" }}>
            NEW
          </span>
        )}
      </div>

      {/* タイトル + 本文 */}
      <div className="title">{news.title}</div>
      <div className="body">{news.body}</div>

      {/* 関連製品チップ（あれば） */}
      {news.targets && news.targets.length > 0 && (
        <div className="targets">
          {news.targets.map((key) => {
            const product = PRODUCTS[key];
            return (
              <span key={key} className="target-chip">
                {product ? product.label : key}
              </span>
            );
          })}
        </div>
      )}

      {/* ソース（出典）チップ（あれば） */}
      {news.sources && news.sources.length > 0 && (
        <div className="sources">
          <span className="sources-label">📚 ソース：</span>
          {news.sources.map((source, i) => (
            <SourceChip key={i} source={source} />
          ))}
        </div>
      )}
    </div>
  );
}
