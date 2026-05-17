/**
 * ソース（出典）チップ
 *
 * 1つの出典を受け取って、色付きバッジで表示する。
 * URL があればリンク、なければただのテキスト。
 */
import type { NewsSource, SourceType } from "../../types";

// ソースタイプ → 日本語ラベルの対応表
const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  official: "公式",
  news:     "報道",
  estimate: "推定/予想",
  analysis: "分析",
};

interface SourceChipProps {
  source: NewsSource;
}

export function SourceChip({ source }: SourceChipProps) {
  const typeLabel = SOURCE_TYPE_LABELS[source.type];
  const className = `source-chip t-${source.type}`;

  // URL ありはリンク、なしはただのテキスト
  if (source.url) {
    return (
      <a
        className={className}
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        title="新しいタブで開く"
      >
        <span className="src-type">{typeLabel}</span>
        {source.label} 🔗
      </a>
    );
  }

  return (
    <span
      className={`${className} no-url`}
      title="リンク未設定（モック / 未発表データ）"
    >
      <span className="src-type">{typeLabel}</span>
      {source.label}
    </span>
  );
}
