/**
 * ニュースタブ
 * NEWS_ITEMS データを NewsItem コンポーネントに1件ずつ流し込んで一覧表示する。
 */
import { NEWS_ITEMS } from "../../data/news";
import { NewsItem } from "../news/NewsItem";
import { NewsLegend } from "../news/NewsLegend";

export function NewsTab() {
  const unreadCount = NEWS_ITEMS.filter((n) => n.unread).length;

  return (
    <div className="tab-section">
      <h2>🔔 価格改定ニュース / リアルタイムタイムライン</h2>
      <p>
        Microsoftのライセンス価格に関する直近の動きを時系列で表示。
        全 <strong>{NEWS_ITEMS.length}件</strong>（うち未読 <strong>{unreadCount}件</strong>）
      </p>

      <NewsLegend />

      <div className="news-list">
        {NEWS_ITEMS.map((news, i) => (
          <NewsItem key={i} news={news} />
        ))}
      </div>
    </div>
  );
}
