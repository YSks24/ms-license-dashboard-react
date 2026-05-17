/** ヘッダー下の速報バー */
import { NEWS_ITEMS } from "../data/news";

interface NewsBarProps {
  onClickJump?: () => void;
}

export function NewsBar({ onClickJump }: NewsBarProps) {
  const latest = NEWS_ITEMS[0];
  if (!latest) return null;
  return (
    <div className="news-bar">
      <span className="icon">📢</span>
      <span className="label">最新</span>
      <span className="news-text">
        {latest.date}：<strong>{latest.title}</strong>
      </span>
      {onClickJump && (
        <button className="news-link" onClick={onClickJump}>
          タイムラインを見る →
        </button>
      )}
    </div>
  );
}
